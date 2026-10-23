import Link from 'next/link'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import ReorderButton from '@/components/account/ReorderButton'

export const dynamic = 'force-dynamic'

function money(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

export default async function AccountOrdersPage() {
  const session = await auth()
  const orders = await prisma.order.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  })

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 'normal', fontSize: 22, marginTop: 0 }}>My orders</h2>

      {orders.length === 0 ? (
        <div className="admin-card">
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>You haven&apos;t placed any orders yet.</p>
          <Link href="/shop" className="button dark">Shop jackets ↗</Link>
        </div>
      ) : (
        orders.map((o) => (
          <div key={o.id} className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <p style={{ margin: '0 0 4px', fontWeight: 'bold' }}>{o.orderNumber}</p>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)' }}>
                  {new Date(o.createdAt).toLocaleDateString()} · {o.items.reduce((s, i) => s + i.qty, 0)} item(s)
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 4px', fontWeight: 'bold' }}>{money(o.totalCents)}</p>
                <span className="badge-pill" style={{ background: '#efede6', color: '#5f655f' }}>{o.status}</span>
              </div>
            </div>
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <Link href={`/account/orders/${o.id}`} style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 'bold' }}>View details →</Link>
              <ReorderButton
                items={o.items.map((i) => ({ productId: i.productId, size: i.size, qty: i.qty }))}
                className="button light"
                label="Re-order"
              />
            </div>
          </div>
        ))
      )}
    </div>
  )
}
