import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { getProductReviews } from '@/lib/reviews'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().max(120).optional().nullable(),
  body: z.string().min(3, 'Please write a few words').max(2000),
})

// GET /api/products/[id]/reviews — public summary + approved reviews
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const summary = await getProductReviews(params.id)
  return NextResponse.json(summary)
}

// POST /api/products/[id]/reviews — logged-in users submit/update their review
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Please sign in to write a review.' }, { status: 401 })
  }

  const parsed = schema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }
  const { rating, title, body } = parsed.data
  const productId = params.id

  // Verified purchase = user has a paid order containing this product.
  let isVerified = false
  try {
    const purchased = await prisma.order.findFirst({
      where: {
        userId: session.user.id,
        paymentStatus: 'PAID',
        items: { some: { productId } },
      },
      select: { id: true },
    })
    isVerified = Boolean(purchased)
  } catch {
    isVerified = false
  }

  try {
    const review = await prisma.review.upsert({
      where: { userId_productId: { userId: session.user.id, productId } },
      update: { rating, title: title || null, body, isVerified, isApproved: true },
      create: {
        userId: session.user.id,
        productId,
        rating,
        title: title || null,
        body,
        isVerified,
        isApproved: true,
      },
    })
    return NextResponse.json({ success: true, review }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Could not save review. The product may not exist in the catalog yet.' },
      { status: 400 }
    )
  }
}
