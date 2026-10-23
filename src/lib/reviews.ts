import { prisma } from '@/lib/prisma'

export interface PublicReview {
  id: string
  rating: number
  title: string | null
  body: string
  author: string
  isVerified: boolean
  createdAt: string
}

export interface ReviewSummary {
  reviews: PublicReview[]
  count: number
  average: number
  distribution: Record<number, number>
}

const EMPTY: ReviewSummary = {
  reviews: [],
  count: 0,
  average: 0,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
}

// Resilient: returns approved reviews, or an empty summary if the DB
// isn't configured yet (keeps the storefront working without a database).
export async function getProductReviews(productId: string): Promise<ReviewSummary> {
  try {
    const rows = await prisma.review.findMany({
      where: { productId, isApproved: true },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } },
    })

    const count = rows.length
    const average = count ? rows.reduce((s, r) => s + r.rating, 0) / count : 0
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    for (const r of rows) distribution[r.rating] = (distribution[r.rating] ?? 0) + 1

    return {
      count,
      average,
      distribution,
      reviews: rows.map((r) => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        body: r.body,
        author: r.user?.name?.trim() || 'Anonymous',
        isVerified: r.isVerified,
        createdAt: r.createdAt.toISOString(),
      })),
    }
  } catch {
    return EMPTY
  }
}
