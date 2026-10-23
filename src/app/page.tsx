import Link from 'next/link'
import { PRODUCTS } from '@/data/products'
import ProductCard from '@/components/ProductCard'
import NewsletterForm from '@/components/NewsletterForm'

export default function HomePage() {
  const featured = PRODUCTS.slice(0, 4)

  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div>
          <p className="eyebrow">THE OUTERWEAR EDIT</p>
          <h1>
            Find your<br />
            <em>next layer.</em>
          </h1>
          <p>Everyday essentials. Statement jackets. Your style, your story.</p>
          <Link className="button gold" href="/shop">Shop jackets ↗</Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="benefits">
        <div>✦ <b>Considered style</b><small>Timeless, versatile designs</small></div>
        <div>↗ <b>Worldwide delivery</b><small>Delivery options at checkout</small></div>
        <div>♡ <b>Here to help</b><small>Friendly customer support</small></div>
      </section>

      {/* Categories */}
      <section className="wrap section">
        <div className="section-head">
          <div>
            <p className="eyebrow dark">EXPLORE THE EDIT</p>
            <h2>Find your fit</h2>
          </div>
          <Link href="/shop">View all ↗</Link>
        </div>
        <div className="categories">
          <Link className="category leather" href="/shop?category=Leather">
            <span>01 / TIMELESS</span>
            <strong>Leather</strong>
            <small>Shop the edit ↗</small>
          </Link>
          <Link className="category varsity" href="/shop?category=Varsity">
            <span>02 / CAMPUS CLASSIC</span>
            <strong>Varsity</strong>
            <small>Shop the edit ↗</small>
          </Link>
          <Link className="category bomber" href="/shop?category=Bomber">
            <span>03 / EVERYDAY</span>
            <strong>Bomber</strong>
            <small>Shop the edit ↗</small>
          </Link>
          <Link className="category puffer" href="/shop?category=Puffer">
            <span>04 / COLD WEATHER</span>
            <strong>Puffer</strong>
            <small>Shop the edit ↗</small>
          </Link>
          <Link className="category denim" href="/shop?category=Denim">
            <span>05 / EVERGREEN</span>
            <strong>Denim</strong>
            <small>Shop the edit ↗</small>
          </Link>
          <Link className="category coach" href="/shop?category=Coach">
            <span>06 / STREETWEAR</span>
            <strong>Coach</strong>
            <small>Shop the edit ↗</small>
          </Link>
          <Link className="category custom" href="/shop?category=Custom">
            <span>07 / MADE TO ORDER</span>
            <strong>Custom</strong>
            <small>Shop the edit ↗</small>
          </Link>
        </div>
      </section>

      {/* Featured */}
      <section className="section featured">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow dark">CUSTOMER FAVOURITES</p>
              <h2>Featured jackets</h2>
            </div>
            <Link href="/shop">Shop all ↗</Link>
          </div>
          <div className="products">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="story">
        <p className="eyebrow">MADE TO BE WORN</p>
        <h2>
          Good jackets.<br />
          <em>Great stories.</em>
        </h2>
        <p>From early mornings to late nights, find the layer that feels like you.</p>
        <Link className="button light" href="/about">Meet the brand ↗</Link>
      </section>

      {/* Newsletter */}
      <section className="newsletter wrap">
        <div>
          <p className="eyebrow dark">THE NORTHLINE NOTE</p>
          <h2>Good things, occasionally.</h2>
          <p>New arrivals, styling ideas and special offers.</p>
        </div>
        <NewsletterForm />
      </section>
    </main>
  )
}
