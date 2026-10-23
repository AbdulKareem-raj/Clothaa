import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import type { OrderStatus } from '@prisma/client'

export const dynamic = 'force-dynamic'

function money(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

const STATUSES: (OrderStatus | 'ALL')[] = ['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']

export default async function AdminOrdersPage({ searchParams }: { searchParams: { status?: string } }) {
  const statusFilter = searchParams.status?.toUpperCase()
  const where = statusFilter && statusFilter !== 'ALL' ? { status: statusFilter as OrderStatus } : {}

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { items: true, user: true },
  })

  return (
    <div>
      <h1>Orders</h1>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
        {STATUSES.map((s) => {
          const active = (statusFilter || 'ALL') === s
          return (
            <Link key={s} href={s === 'ALL' ? '/admin/orders' : `/admin/orders?status=${s}`}
              className="badge-pill" style={{ background: active ? '#191c1b' : '#efede6', color: active ? 'white' : '#5f655f', padding: '6px 12px' }}>
              {s}
            </Link>
          )
        })}
      </div>

      {orders.length === 0 ? (
        <div className="admin-card"><p style={{ color: 'var(--muted)', fontSize: 14 }}>No orders found.</p></div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td><Link href={`/admin/orders/${o.id}`} style={{ color: 'var(--gold)', fontWeight: 'bold' }}>{o.orderNumber}</Link></td>
                <td>{o.user?.name || o.guestEmail || 'Guest'}</td>
                <td>{o.items.reduce((s, i) => s + i.qty, 0)}</td>
                <td>{money(o.totalCents)}</td>
                <td>{o.paymentStatus}</td>
                <td>{o.status}</td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
