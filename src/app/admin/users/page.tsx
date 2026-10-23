import { prisma } from '@/lib/prisma'
import UserActions from '@/components/admin/UserActions'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { orders: true } } },
  })

  return (
    <div>
      <h1>Users</h1>
      <table className="admin-table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Orders</th><th>Status</th><th>Joined</th><th></th></tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td style={{ fontWeight: 'bold' }}>{u.name || '—'}</td>
              <td>{u.email}</td>
              <td>
                <span className="badge-pill" style={{ background: u.role === 'ADMIN' ? '#efe3cc' : '#eef', color: u.role === 'ADMIN' ? '#8a6d1f' : '#4a4a8a' }}>{u.role}</span>
              </td>
              <td>{u._count.orders}</td>
              <td>{u.isActive ? 'Active' : 'Inactive'}</td>
              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              <td><UserActions id={u.id} isActive={u.isActive} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 16 }}>No users yet.</p>}
    </div>
  )
}
