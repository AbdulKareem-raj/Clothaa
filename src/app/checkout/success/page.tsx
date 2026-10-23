'use client'

import { useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCart } from '@/components/CartProvider'
import { trackOrderCompleted } from '@/lib/analytics'
import { logActivity } from '@/lib/activity'

function SuccessInner() {
  const params = useSearchParams()
  const { data: session } = useSession()
  const { clearCart } = useCart()
  const orderNumber = params.get('order') || ''
  const cleared = useRef(false)

  useEffect(() => {
    if (!cleared.current) {
      cleared.current = true
      clearCart()
      if (orderNumber) {
        const total = Number(params.get('total') || 0)
        const itemCount = Number(params.get('items') || 0)
        trackOrderCompleted({ orderNumber, total, itemCount, payMethod: 'STRIPE' })
        logActivity('order_completed', { orderNumber, total, itemCount })
      }
    }
  }, [clearCart, orderNumber, params])

  return (
    <main className="wrap" style={{ padding: '80px 20px', textAlign: 'center', minHeight: '55vh' }}>
      <p className="eyebrow dark">PAYMENT SUCCESSFUL</p>
      <h1 style={{ fontFamily: 'var(--serif)', fontWeight: 'normal', fontSize: 42, margin: '10px 0 14px' }}>
        Thank you! ✓
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: 14 }}>
        {orderNumber ? <>Your order <strong>{orderNumber}</strong> is confirmed.</> : 'Your order is confirmed.'}
      </p>
      <p style={{ fontSize: 13, color: 'var(--muted)', margin: '6px 0 28px' }}>
        A confirmation email is on its way.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        {session?.user && <Link href="/account/orders" className="button dark">View my orders ↗</Link>}
        <Link href="/shop" className="button light" style={{ border: '1px solid var(--line)' }}>
          Continue shopping
        </Link>
      </div>
    </main>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<main className="wrap" style={{ padding: 80, textAlign: 'center' }}>Loading…</main>}>
      <SuccessInner />
    </Suspense>
  )
}
