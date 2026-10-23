import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import OrderStatusForm from '@/components/admin/OrderStatusForm'

export const dynamic = 'force-dynamic'

function money(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true, address: true, user: true },
  })
  if (!order) notFound()

  return (
    <div>
      <Link href="/admin/orders" style={{ fontSize: 12, color: 'var(--muted)' }}>← All orders</Link>
      <h1 style={{ marginTop: 10 }}>{order.orderNumber}</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24, alignItems: 'start' }}>
        <div>
          <div className="admin-card">
            <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 'normal', fontSize: 18, marginTop: 0 }}>Items</h2>
            <table className="admin-table">
              <thead><tr><th>Product</th><th>Size</th><th>Qty</th><th>Price</th><th>Line</th></tr></thead>
              <tbody>
                {order.items.map((i) => (
                  <tr key={i.id}>
                    <td>{i.productName}</td>
                    <td>{i.size}</td>
                    <td>{i.qty}</td>
                    <td>{money(i.priceCents)}</td>
                    <td>{money(i.priceCents * i.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 14, textAlign: 'right', fontSize: 13 }}>
              <p style={{ margin: '4px 0' }}>Subtotal: {money(order.subtotalCents)}</p>
              <p style={{ margin: '4px 0' }}>Shipping: {order.shippingCents === 0 ? 'Free' : money(order.shippingCents)}</p>
              {order.discountCents > 0 && <p style={{ margin: '4px 0' }}>Discount: −{money(order.discountCents)}</p>}
              <p style={{ margin: '8px 0 0', fontWeight: 'bold', fontSize: 16 }}>Total: {money(order.totalCents)}</p>
            </div>
          </div>

          <div className="admin-card">
            <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 'normal', fontSize: 18, marginTop: 0 }}>Shipping address</h2>
            <p style={{ fontSize: 13, lineHeight: 1.8, margin: 0 }}>
              <strong>{order.address.fullName}</strong><br />
              {order.address.phone}<br />
              {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ''}<br />
              {order.address.city}{order.address.state ? `, ${order.address.state}` : ''} {order.address.postalCode}<br />
              {order.address.country}
            </p>
            {order.notes && <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12 }}>Notes: {order.notes}</p>}
          </div>
        </div>

        <div>
          <div className="admin-card">
            <p style={{ fontSize: 12, margin: '0 0 6px' }}>Customer: <strong>{order.user?.name || 'Guest'}</strong></p>
            <p style={{ fontSize: 12, margin: '0 0 6px' }}>Email: {order.user?.email || order.guestEmail}</p>
            <p style={{ fontSize: 12, margin: '0 0 6px' }}>Payment method: {order.paymentMethod}</p>
            <p style={{ fontSize: 12, margin: 0 }}>Placed: {new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <OrderStatusForm
            orderId={order.id}
            initialStatus={order.status}
            initialPaymentStatus={order.paymentStatus}
            initialTracking={order.trackingNumber ?? ''}
          />
        </div>
      </div>
    </div>
  )
}
