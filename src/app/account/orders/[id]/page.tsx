import Link from 'next/link'
import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import ReorderButton from '@/components/account/ReorderButton'

export const dynamic = 'force-dynamic'

function money(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

export default async function AccountOrderDetailPage({ params }: { params: { id: string } }) {
  const session = await auth()
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true, address: true },
  })

  // Only the owner may view their order.
  if (!order || order.userId !== session!.user.id) notFound()

  return (
    <div>
      <Link href="/account/orders" style={{ fontSize: 12, color: 'var(--muted)' }}>← My orders</Link>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 'normal', fontSize: 22, margin: '10px 0 6px' }}>{order.orderNumber}</h2>
        <ReorderButton
          items={order.items.map((i) => ({ productId: i.productId, size: i.size, qty: i.qty }))}
          className="button dark"
          label="Re-order these items"
        />
      </div>
      <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 0 }}>
        Placed {new Date(order.createdAt).toLocaleString()} · Status: <strong>{order.status}</strong>
        {order.trackingNumber ? ` · Tracking: ${order.trackingNumber}` : ''}
      </p>

      <div className="admin-card">
        {order.items.map((i) => (
          <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '8px 0', borderBottom: '1px solid var(--line)' }}>
            <span>{i.productName} <span style={{ color: 'var(--muted)' }}>({i.size} × {i.qty})</span></span>
            <span>{money(i.priceCents * i.qty)}</span>
          </div>
        ))}
        <div style={{ textAlign: 'right', marginTop: 12, fontSize: 13 }}>
          <p style={{ margin: '4px 0' }}>Subtotal: {money(order.subtotalCents)}</p>
          <p style={{ margin: '4px 0' }}>Shipping: {order.shippingCents === 0 ? 'Free' : money(order.shippingCents)}</p>
          <p style={{ margin: '8px 0 0', fontWeight: 'bold', fontSize: 16 }}>Total: {money(order.totalCents)}</p>
        </div>
      </div>

      <div className="admin-card">
        <p style={{ fontSize: 12, fontWeight: 'bold', margin: '0 0 8px' }}>SHIPPING ADDRESS</p>
        <p style={{ fontSize: 13, lineHeight: 1.8, margin: 0 }}>
          {order.address.fullName}<br />
          {order.address.phone}<br />
          {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ''}<br />
          {order.address.city}{order.address.state ? `, ${order.address.state}` : ''} {order.address.postalCode}<br />
          {order.address.country}
        </p>
      </div>
    </div>
  )
}
