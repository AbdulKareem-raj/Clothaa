import { prisma } from '@/lib/prisma'
import MessageActions from '@/components/admin/MessageActions'

export const dynamic = 'force-dynamic'

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <h1>Contact messages</h1>
      {messages.length === 0 ? (
        <div className="admin-card"><p style={{ color: 'var(--muted)', fontSize: 14 }}>No messages yet.</p></div>
      ) : (
        messages.map((m) => (
          <div key={m.id} className="admin-card" style={{ borderLeft: m.isRead ? '3px solid var(--line)' : '3px solid var(--gold)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 16 }}>
              <div>
                <p style={{ margin: '0 0 4px', fontWeight: 'bold' }}>{m.name} {!m.isRead && <span className="badge-pill" style={{ background: '#fff3cd', color: '#8a6d1f', marginLeft: 6 }}>NEW</span>}</p>
                <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)' }}>{m.email} · {new Date(m.createdAt).toLocaleString()}</p>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{m.message}</p>
              </div>
              <MessageActions id={m.id} isRead={m.isRead} />
            </div>
          </div>
        ))
      )}
    </div>
  )
}
