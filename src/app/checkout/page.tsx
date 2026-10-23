'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCart } from '@/components/CartProvider'
import { PRODUCTS, formatPrice } from '@/data/products'
import { FREE_SHIPPING_THRESHOLD_CENTS, FLAT_SHIPPING_CENTS } from '@/lib/orders'
import { trackCheckoutStarted } from '@/lib/analytics'

function CheckoutInner() {
  const params = useSearchParams()
  const canceled = params.get('canceled') === '1'
  const { data: session } = useSession()
  const { cart } = useCart()

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'PK',
    notes: '',
  })
  const [error, setError] = useState('')
  const [placing, setPlacing] = useState(false)

  const items = cart
    .map((i) => ({ ...i, product: PRODUCTS.find((p) => p.id === i.id) }))
    .filter((i) => i.product)

  const subtotal = items.reduce((s, i) => s + i.product!.price * i.qty, 0)
  const subtotalCents = Math.round(subtotal * 100)
  const shippingCents =
    subtotalCents <= 0 ? 0 : subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : FLAT_SHIPPING_CENTS
  const total = (subtotalCents + shippingCents) / 100

  useEffect(() => {
    if (session?.user) {
      setForm((f) => ({
        ...f,
        fullName: f.fullName || session.user.name || '',
        email: f.email || session.user.email || '',
      }))
    }
  }, [session])

  useEffect(() => {
    if (items.length > 0) {
      trackCheckoutStarted(subtotalCents, items.reduce((s, i) => s + i.qty, 0))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setPlacing(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart, customer: form }),
      })
      const data = await res.json()

      if (!res.ok || !data.url) {
        setError(data.error || 'Could not start payment. Please try again.')
        setPlacing(false)
        return
      }

      // Redirect to Stripe's hosted checkout page.
      window.location.href = data.url
    } catch {
      setError('Network error. Please try again.')
      setPlacing(false)
    }
  }

  if (items.length === 0) {
    return (
      <main className="wrap cart-page">
        <p className="eyebrow dark">CHECKOUT</p>
        <h1>Your bag is empty</h1>
        <div className="empty">
          Add something before checking out.
          <p><Link className="button dark" href="/shop">Shop jackets ↗</Link></p>
        </div>
      </main>
    )
  }

  return (
    <main className="wrap cart-page">
      <p className="eyebrow dark">CHECKOUT</p>
      <h1>Shipping details</h1>

      {canceled && (
        <div className="auth-error" style={{ maxWidth: 'none', background: '#fff3cd', borderColor: '#ffe69c', color: '#8a6d1f' }}>
          Payment was canceled. Your bag is still saved — you can try again.
        </div>
      )}
      {error && <div className="auth-error" style={{ maxWidth: 'none' }}>{error}</div>}

      <form onSubmit={handleSubmit} className="cart-layout" style={{ marginTop: 20 }}>
        <div>
          <div className="checkout-fields">
            <Field label="Full name" value={form.fullName} onChange={(v) => update('fullName', v)} required />
            <Field label="Email" type="email" value={form.email} onChange={(v) => update('email', v)} required />
            <Field label="Phone" value={form.phone} onChange={(v) => update('phone', v)} required />
            <Field label="Address line 1" value={form.line1} onChange={(v) => update('line1', v)} required full />
            <Field label="Address line 2 (optional)" value={form.line2} onChange={(v) => update('line2', v)} full />
            <Field label="City" value={form.city} onChange={(v) => update('city', v)} required />
            <Field label="State / Province" value={form.state} onChange={(v) => update('state', v)} />
            <Field label="Postal code" value={form.postalCode} onChange={(v) => update('postalCode', v)} required />
            <Field label="Country" value={form.country} onChange={(v) => update('country', v)} required />
          </div>
          <label className="admin-field" style={{ marginTop: 16 }}>
            <span>Order notes (optional)</span>
            <textarea rows={3} value={form.notes} onChange={(e) => update('notes', e.target.value)} />
          </label>
        </div>

        <aside className="summary">
          <h2>Order summary</h2>
          {items.map((item) => (
            <div key={`${item.id}-${item.size}`} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
              <Image src={item.product!.image} alt={item.product!.name} width={46} height={58} style={{ objectFit: 'cover' }} />
              <div style={{ flex: 1, fontSize: 12 }}>
                <div style={{ fontWeight: 'bold' }}>{item.product!.name}</div>
                <div style={{ color: 'var(--muted)' }}>{item.size} × {item.qty}</div>
              </div>
              <b style={{ fontSize: 12 }}>{formatPrice(item.product!.price * item.qty)}</b>
            </div>
          ))}
          <hr />
          <p className="summary-line"><span>Subtotal</span><b>{formatPrice(subtotal)}</b></p>
          <p className="summary-line">
            <span>Shipping</span>
            <b>{shippingCents === 0 ? 'Free' : formatPrice(shippingCents / 100)}</b>
          </p>
          <p className="summary-line"><span>Total</span><b>{formatPrice(total)}</b></p>
          <hr />
          <p style={{ fontSize: 12, color: 'var(--muted)' }}>Secure card payment via Stripe</p>
          <button className="button dark" type="submit" disabled={placing} style={{ width: '100%', textAlign: 'center' }}>
            {placing ? 'Redirecting to payment…' : `Pay ${formatPrice(total)} ↗`}
          </button>
          <small>You&apos;ll be redirected to Stripe&apos;s secure page to complete payment.</small>
        </aside>
      </form>
    </main>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<main className="wrap cart-page"><h1>Loading…</h1></main>}>
      <CheckoutInner />
    </Suspense>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  full = false,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
  full?: boolean
}) {
  return (
    <label className="admin-field" style={full ? { gridColumn: '1 / -1' } : undefined}>
      <span>{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} />
    </label>
  )
}
