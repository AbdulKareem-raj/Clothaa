import { getProductReviews } from '@/lib/reviews'
import Stars from '@/components/reviews/Stars'
import ReviewForm from '@/components/reviews/ReviewForm'

interface ProductInfo {
  id: string
  name: string
  image: string
  description: string
  price: number
}

export default async function ProductReviews({ product }: { product: ProductInfo }) {
  const { reviews, count, average, distribution } = await getProductReviews(product.id)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  // Google-recommended Product structured data with ratings + reviews.
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: [product.image],
    description: product.description,
    sku: product.id,
    brand: { '@type': 'Brand', name: 'Northline' },
    offers: {
      '@type': 'Offer',
      url: `${appUrl}/shop/${product.id}`,
      priceCurrency: 'USD',
      price: product.price.toFixed(2),
      availability: 'https://schema.org/InStock',
    },
  }

  // Only include ratings/reviews markup when real reviews exist (Google policy).
  if (count > 0) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: average.toFixed(1),
      reviewCount: count,
      bestRating: 5,
      worstRating: 1,
    }
    jsonLd.review = reviews.slice(0, 20).map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      datePublished: r.createdAt.slice(0, 10),
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
      ...(r.title ? { name: r.title } : {}),
      reviewBody: r.body,
    }))
  }

  return (
    <section className="section reviews-section" id="reviews">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 'normal', fontSize: 30, marginBottom: 20 }}>
        Customer reviews
      </h2>

      <div className="reviews-grid">
        {/* Summary + form */}
        <div>
          <div className="review-summary">
            {count > 0 ? (
              <>
                <div style={{ fontSize: 44, fontWeight: 'bold', lineHeight: 1 }}>{average.toFixed(1)}</div>
                <Stars value={average} size={18} />
                <p style={{ fontSize: 12, color: 'var(--muted)', margin: '6px 0 16px' }}>
                  Based on {count} review{count === 1 ? '' : 's'}
                </p>
                <div>
                  {[5, 4, 3, 2, 1].map((star) => {
                    const c = distribution[star] ?? 0
                    const pct = count ? Math.round((c / count) * 100) : 0
                    return (
                      <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 11, width: 28, color: 'var(--muted)' }}>{star}★</span>
                        <span style={{ flex: 1, height: 7, background: '#eceae3', borderRadius: 4, overflow: 'hidden' }}>
                          <span style={{ display: 'block', width: `${pct}%`, height: '100%', background: 'var(--gold)' }} />
                        </span>
                        <span style={{ fontSize: 11, width: 24, textAlign: 'right', color: 'var(--muted)' }}>{c}</span>
                      </div>
                    )
                  })}
                </div>
              </>
            ) : (
              <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
                No reviews yet. Be the first to review this jacket.
              </p>
            )}
          </div>

          <ReviewForm productId={product.id} />
        </div>

        {/* Review list */}
        <div>
          {reviews.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>Your review could appear here.</p>
          ) : (
            reviews.map((r) => (
              <article key={r.id} className="review-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <Stars value={r.rating} />
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                {r.title && <p style={{ fontWeight: 'bold', fontSize: 14, margin: '8px 0 4px' }}>{r.title}</p>}
                <p style={{ fontSize: 13, color: '#4a4f49', lineHeight: 1.8, margin: '4px 0 8px' }}>{r.body}</p>
                <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0 }}>
                  {r.author}
                  {r.isVerified && <span className="verified-badge">✓ Verified purchase</span>}
                </p>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
