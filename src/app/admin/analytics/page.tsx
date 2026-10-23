import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

interface Analytics {
  ok: boolean
  total: number
  last7: number
  sessions: number
  guestEvents: number
  userEvents: number
  byEvent: { event: string; count: number }[]
  topProducts: { name: string; views: number }[]
  recent: { id: string; event: string; path: string; who: string; when: string }[]
}

async function getAnalytics(): Promise<Analytics> {
  const empty: Analytics = {
    ok: false, total: 0, last7: 0, sessions: 0, guestEvents: 0, userEvents: 0,
    byEvent: [], topProducts: [], recent: [],
  }
  try {
    const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000)

    const [total, last7, sessionGroups, userEvents, byEventRaw, productViews, recentRaw] =
      await Promise.all([
        prisma.userActivity.count(),
        prisma.userActivity.count({ where: { createdAt: { gte: weekAgo } } }),
        prisma.userActivity.groupBy({ by: ['sessionId'], _count: { sessionId: true } }),
        prisma.userActivity.count({ where: { userId: { not: null } } }),
        prisma.userActivity.groupBy({ by: ['event'], _count: { event: true } }),
        prisma.userActivity.findMany({
          where: { event: 'product_viewed' },
          orderBy: { createdAt: 'desc' },
          take: 1000,
          select: { data: true },
        }),
        prisma.userActivity.findMany({
          orderBy: { createdAt: 'desc' },
          take: 30,
          include: { user: { select: { name: true, email: true } } },
        }),
      ])

    // Top viewed products from the JSON payloads.
    const productCount = new Map<string, number>()
    for (const row of productViews) {
      const name = (row.data as { name?: string } | null)?.name
      if (name) productCount.set(name, (productCount.get(name) ?? 0) + 1)
    }
    const topProducts = Array.from(productCount.entries())
      .map(([name, views]) => ({ name, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 8)

    return {
      ok: true,
      total,
      last7,
      sessions: sessionGroups.length,
      guestEvents: total - userEvents,
      userEvents,
      byEvent: byEventRaw
        .map((e) => ({ event: e.event, count: e._count.event }))
        .sort((a, b) => b.count - a.count),
      topProducts,
      recent: recentRaw.map((r) => ({
        id: r.id,
        event: r.event,
        path: (r.data as { path?: string } | null)?.path ?? '',
        who: r.user?.name || r.user?.email || 'Guest',
        when: r.createdAt.toISOString(),
      })),
    }
  } catch {
    return empty
  }
}

export default async function AdminAnalyticsPage() {
  const a = await getAnalytics()

  if (!a.ok) {
    return (
      <div>
        <h1>Analytics</h1>
        <div className="admin-card">
          <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0 }}>
            No activity data yet. Once the database is connected and visitors start browsing,
            page views, product views, cart adds and orders will be tracked here automatically.
          </p>
        </div>
      </div>
    )
  }

  const stats = [
    { label: 'Total Events', value: a.total },
    { label: 'Last 7 Days', value: a.last7 },
    { label: 'Unique Sessions', value: a.sessions },
    { label: 'Guest Events', value: a.guestEvents },
    { label: 'Logged-in Events', value: a.userEvents },
  ]

  return (
    <div>
      <h1>Analytics &amp; guest tracking</h1>

      <div className="stat-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <p className="label">{s.label.toUpperCase()}</p>
            <p className="value">{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
        <div className="admin-card">
          <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 'normal', fontSize: 18, marginTop: 0 }}>Events by type</h2>
          {a.byEvent.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>No events yet.</p>
          ) : (
            <table className="admin-table">
              <tbody>
                {a.byEvent.map((e) => (
                  <tr key={e.event}><td>{e.event}</td><td style={{ textAlign: 'right', fontWeight: 'bold' }}>{e.count}</td></tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="admin-card">
          <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 'normal', fontSize: 18, marginTop: 0 }}>Most viewed products</h2>
          {a.topProducts.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>No product views yet.</p>
          ) : (
            <table className="admin-table">
              <tbody>
                {a.topProducts.map((p) => (
                  <tr key={p.name}><td>{p.name}</td><td style={{ textAlign: 'right', fontWeight: 'bold' }}>{p.views}</td></tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="admin-card">
        <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 'normal', fontSize: 18, marginTop: 0 }}>Recent activity</h2>
        {a.recent.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>No activity yet.</p>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Event</th><th>Path / detail</th><th>Who</th><th>When</th></tr></thead>
            <tbody>
              {a.recent.map((r) => (
                <tr key={r.id}>
                  <td>{r.event}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{r.path || '—'}</td>
                  <td>{r.who}</td>
                  <td>{new Date(r.when).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 12 }}>
        Self-hosted tracking (stored in your database). Mixpanel, if configured, provides deeper funnels alongside this.
      </p>
    </div>
  )
}
