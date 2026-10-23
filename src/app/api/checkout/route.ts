import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { stripe, isStripeConfigured } from '@/lib/stripe'
import { calcShippingCents, generateOrderNumber } from '@/lib/orders'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        size: z.string().min(1),
        qty: z.number().int().positive(),
      })
    )
    .min(1, 'Cart is empty'),
  customer: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(6),
    line1: z.string().min(3),
    line2: z.string().optional().default(''),
    city: z.string().min(2),
    state: z.string().optional().default(''),
    postalCode: z.string().min(2),
    country: z.string().optional().default('PK'),
    notes: z.string().optional().default(''),
  }),
})

// POST /api/checkout — create a pending order and a Stripe Checkout Session
export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: 'Payments are not configured yet. Add Stripe keys to .env.' },
      { status: 503 }
    )
  }

  const session = await auth()

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
      { status: 400 }
    )
  }

  const { items, customer } = parsed.data

  // Load products from DB and recompute prices server-side (never trust client).
  const ids = Array.from(new Set(items.map((i) => i.id)))
  const products = await prisma.product.findMany({
    where: { id: { in: ids }, isActive: true },
  })
  const byId = new Map(products.map((p) => [p.id, p]))

  const missing = ids.filter((id) => !byId.has(id))
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Some items are no longer available: ${missing.join(', ')}` },
      { status: 400 }
    )
  }

  const lineItems = items.map((i) => {
    const product = byId.get(i.id)!
    return {
      productId: product.id,
      productName: product.name,
      productImage: product.images[0] ?? '',
      priceCents: product.priceCents,
      size: i.size,
      qty: i.qty,
    }
  })

  const subtotalCents = lineItems.reduce((s, i) => s + i.priceCents * i.qty, 0)
  const shippingCents = calcShippingCents(subtotalCents)
  const totalCents = subtotalCents + shippingCents

  const userConnect = session?.user ? { connect: { id: session.user.id } } : undefined

  // 1. Pending order — confirmed by the Stripe webhook after payment.
  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      status: 'PENDING',
      paymentStatus: 'UNPAID',
      paymentMethod: 'STRIPE',
      subtotalCents,
      shippingCents,
      totalCents,
      notes: customer.notes || null,
      guestEmail: session?.user ? null : customer.email,
      ...(userConnect && { user: userConnect }),
      address: {
        create: {
          fullName: customer.fullName,
          phone: customer.phone,
          line1: customer.line1,
          line2: customer.line2 || null,
          city: customer.city,
          state: customer.state || null,
          postalCode: customer.postalCode,
          country: customer.country || 'PK',
          ...(userConnect && { user: userConnect }),
        },
      },
      items: { create: lineItems },
    },
  })

  // 2. Stripe Checkout Session
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const stripeLineItems = lineItems.map((i) => ({
    quantity: i.qty,
    price_data: {
      currency: 'usd',
      unit_amount: i.priceCents,
      product_data: {
        name: `${i.productName} (${i.size})`,
        ...(i.productImage ? { images: [i.productImage] } : {}),
      },
    },
  }))

  if (shippingCents > 0) {
    stripeLineItems.push({
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: shippingCents,
        product_data: { name: 'Shipping' },
      },
    })
  }

  try {
    const checkout = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: stripeLineItems,
      customer_email: customer.email,
      client_reference_id: order.id,
      metadata: { orderId: order.id, orderNumber: order.orderNumber },
      success_url: `${appUrl}/checkout/success?order=${order.orderNumber}&total=${totalCents}&items=${items.reduce((s, i) => s + i.qty, 0)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout?canceled=1`,
    })

    await prisma.order.update({
      where: { id: order.id },
      data: { stripePaymentId: checkout.id },
    })

    return NextResponse.json({ url: checkout.url })
  } catch (err) {
    // Roll back the pending order if Stripe fails.
    await prisma.order.delete({ where: { id: order.id } }).catch(() => {})
    const message = err instanceof Error ? err.message : 'Payment session failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
