import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getProduct, PRODUCTS, formatPrice } from '@/data/products'
import ProductCard from '@/components/ProductCard'
import AddToCartButton from '@/components/AddToCartButton'
import WishlistButton from '@/components/WishlistButton'
import ProductViewTracker from '@/components/ProductViewTracker'
import ProductReviews from '@/components/reviews/ProductReviews'
import Stars from '@/components/reviews/Stars'
import { getProductReviews } from '@/lib/reviews'
import type { Metadata } from 'next'

interface Props {
  params: { id: string }
}

// Dynamic: reviews come from the DB at request time (degrades gracefully
// to no reviews when the database isn't configured).
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct(params.id)
  return { title: product ? `${product.name} | Northline` : 'Product | Northline' }
}

export default async function ProductPage({ params }: Props) {
  const product = getProduct(params.id)
  if (!product) notFound()

  const { average, count } = await getProductReviews(product.id)
  const related = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4)

  return (
    <main className="wrap product-detail">
      <div className="detail-grid">
        <div style={{ position: 'relative', background: '#eee', minHeight: 400 }}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 650px) 100vw, 50vw"
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        <div>
          <p className="eyebrow dark">
            <Link href="/shop">← BACK TO SHOP</Link>
          </p>
          <div className="product-category">{product.category}</div>
          <h1>{product.name}</h1>
          {count > 0 && (
            <a href="#reviews" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, margin: '4px 0 8px' }}>
              <Stars value={average} />
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>{average.toFixed(1)} · {count} review{count === 1 ? '' : 's'}</span>
            </a>
          )}
          <div className="price">{formatPrice(product.price)}</div>
          <p>{product.description}</p>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <AddToCartButton product={product} />
            <WishlistButton productId={product.id} productName={product.name} />
          </div>
          <p>Check the size guide and shipping policies before ordering.</p>
          <ProductViewTracker id={product.id} name={product.name} category={product.category} price={product.price} />
        </div>
      </div>

      <ProductReviews
        product={{
          id: product.id,
          name: product.name,
          image: product.image,
          description: product.description,
          price: product.price,
        }}
      />

      <section className="section">
        <h2>You may also like</h2>
        <div className="products">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </main>
  )
}
