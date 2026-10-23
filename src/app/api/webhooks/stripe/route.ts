import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { stripe, isStripeConfigured } from '@/lib/stripe'
import { sendOrderConfirmation } from '@/lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret missing' }, { status: 503 })
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const rawBody = await request.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature'
    return NextResponse.json({ error: `Webhook verification failed: ${message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const checkoutSession = event.data.object as Stripe.Checkout.Session
    const orderId = checkoutSession.metadata?.orderId || checkoutSession.client_reference_id

    if (orderId) {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'PAID',
          status: 'CONFIRMED',
          stripePaymentId: (checkoutSession.payment_intent as string) || checkoutSession.id,
        },
        include: { items: true, user: true },
      })

      // Decrement stock for each item.
      await Promise.all(
        order.items.map((i) =>
          prisma.product.update({
            where: { id: i.productId },
            data: { stock: { decrement: i.qty } },
          }).catch(() => {})
        )
      )

      // Confirmation email — must not fail the webhook.
      const email = order.user?.email || order.guestEmail
      if (email) {
        try {
          await sendOrderConfirmation({
            toEmail: email,
            toName: order.user?.name || 'Customer',
            orderNumber: order.orderNumber,
            total: order.totalCents,
            items: order.items.map((i) => ({
              name: i.productName,
              qty: i.qty,
              size: i.size,
              priceCents: i.priceCents,
            })),
          })
        } catch (err) {
          console.error('Order confirmation email failed:', err)
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}
