import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AdminNav from '@/components/admin/AdminNav'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') redirect('/login?redirect=/admin/dashboard')

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="brand">
          <p>NORTHLINE ADMIN</p>
          <p>{session.user.name || session.user.email}</p>
        </div>
        <AdminNav />
        <div className="admin-foot">
          <Link href="/">← View store</Link>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  )
}
