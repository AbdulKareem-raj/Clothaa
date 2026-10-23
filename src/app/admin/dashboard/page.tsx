import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function money(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

export default async function DashboardPage() {
  const [
    totalOrders,
    pendingOrders,
    revenue,
    totalUsers,
    totalProducts,
    lowStock,
    unreadMessages,
    pendingReviews,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.aggregate({ where: { paymentStatus: 'PAID' }, _sum: { totalCents: true } }),
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.findMany({ where: { stock: { lt: 5 }, isActive: true }, select: { name: true, stock: true } }),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.review.count({ where: { isApproved: false } }),
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 6, include: { items: true } }),
  ])

  const stats = [
    { label: 'Total Orders', value: totalOrders },
    { label: 'Pending Orders', value: pendingOrders },
    { label: 'Paid Revenue', value: money(revenue._sum.totalCents ?? 0) },
    { label: 'Customers', value: totalUsers },
    { label: 'Active Products', value: totalProducts },
    { label: 'Unread Messages', value: unreadMessages },
    { label: 'Reviews to Approve', value: pendingReviews },
  ]

  return (
    <div>
      <h1>Dashboard</h1>

      <div className="stat-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <p className="label">{s.label.toUpperCase()}</p>
            <p className="value">{s.value}</p>
          </div>
        ))}
      </div>

      {lowStock.length > 0 && (
        <div style={{ background: '#fff3cd', border: '1px solid #ffe69c', padding: '14px 18px', marginBottom: 24, fontSize: 13 }}>
          <strong>⚠ Low stock:</strong>{' '}
          {lowStock.map((p) => `${p.name} (${p.stock})`).join(' · ')}
        </div>
      )}

      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 'normal', fontSize: 20, margin: 0 }}>Recent orders</h2>
          <Link href="/admin/orders" style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 'bold' }}>View all →</Link>
        </div>
        {recentOrders.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>No orders yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Order</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id}>
                  <td><Link href={`/admin/orders/${o.id}`} style={{ color: 'var(--gold)', fontWeight: 'bold' }}>{o.orderNumber}</Link></td>
                  <td>{o.items.reduce((s, i) => s + i.qty, 0)}</td>
                  <td>{money(o.totalCents)}</td>
                  <td>{o.status}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
