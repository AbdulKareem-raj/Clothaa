import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminGuard'
import { sendShippingUpdate } from '@/lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']).optional(),
  paymentStatus: z.enum(['UNPAID', 'PAID', 'REFUNDED']).optional(),
  trackingNumber: z.string().optional().nullable(),
})

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { deny } = await requireAdmin()
  if (deny) return deny

  const parsed = schema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }
  const { status, paymentStatus, trackingNumber } = parsed.data

  const order = await prisma.order.update({
    where: { id: params.id },
    data: {
      ...(status && { status }),
      ...(paymentStatus && { paymentStatus }),
      ...(trackingNumber !== undefined && { trackingNumber: trackingNumber || null }),
    },
    include: { user: true },
  })

  // Email the customer when the order ships with a tracking number.
  if (status === 'SHIPPED' && order.trackingNumber) {
    const email = order.user?.email || order.guestEmail
    if (email) {
      try {
        await sendShippingUpdate({
          toEmail: email,
          toName: order.user?.name || 'Customer',
          orderNumber: order.orderNumber,
          trackingNumber: order.trackingNumber,
        })
      } catch (err) {
        console.error('Shipping email failed:', err)
      }
    }
  }

  return NextResponse.json(order)
}
