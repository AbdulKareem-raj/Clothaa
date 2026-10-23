'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/CartProvider'
import { PRODUCTS, formatPrice } from '@/data/products'
import { FREE_SHIPPING_THRESHOLD_CENTS, FLAT_SHIPPING_CENTS } from '@/lib/orders'

export default function CartPage() {
  const router = useRouter()
  const { cart, removeItem, changeQty } = useCart()

  const items = cart
    .map((i) => ({ ...i, product: PRODUCTS.find((p) => p.id === i.id) }))
    .filter((i) => i.product)

  const subtotal = items.reduce((s, i) => s + i.product!.price * i.qty, 0)
  const subtotalCents = Math.round(subtotal * 100)
  const shippingCents =
    subtotalCents <= 0 ? 0 : subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : FLAT_SHIPPING_CENTS

  if (items.length === 0) {
    return (
      <main className="wrap cart-page">
        <p className="eyebrow dark">YOUR SELECTION</p>
        <h1>Your bag</h1>
        <div className="empty">
          Your bag is empty.
          <p>
            <Link className="button dark" href="/shop">Shop jackets ↗</Link>
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="wrap cart-page">
      <p className="eyebrow dark">YOUR SELECTION</p>
      <h1>Your bag</h1>

      <div className="cart-layout">
        <div>
          {items.map((item) => (
            <article key={`${item.id}-${item.size}`} className="cart-row">
              <Image
                src={item.product!.image}
                alt={item.product!.name}
                width={85}
                height={100}
                style={{ objectFit: 'cover' }}
              />
              <div>
                <h3>{item.product!.name}</h3>
                <p>Size: {item.size} · {formatPrice(item.product!.price)}</p>
                <div className="qty">
                  <button onClick={() => changeQty(item.id, item.size, -1)}>−</button>
                  {item.qty}
                  <button onClick={() => changeQty(item.id, item.size, 1)}>+</button>
                </div>
                <button onClick={() => removeItem(item.id, item.size)}>Remove</button>
              </div>
              <b>{formatPrice(item.qty * item.product!.price)}</b>
            </article>
          ))}
        </div>

        <aside className="summary">
          <h2>Order summary</h2>
          <p className="summary-line"><span>Subtotal</span><b>{formatPrice(subtotal)}</b></p>
          <p className="summary-line">
            <span>Shipping</span>
            <b>{shippingCents === 0 ? 'Free' : formatPrice(shippingCents / 100)}</b>
          </p>
          <p className="summary-line">
            <span>Total</span><b>{formatPrice((subtotalCents + shippingCents) / 100)}</b>
          </p>
          <hr />
          {shippingCents > 0 && (
            <p><small>Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD_CENTS / 100)}.</small></p>
          )}
          <button className="button dark" onClick={() => router.push('/checkout')}>
            Continue to checkout ↗
          </button>
          <small>Secure card payment via Stripe at checkout.</small>
        </aside>
      </div>
    </main>
  )
}
