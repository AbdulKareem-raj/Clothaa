import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import AccountNav from '@/components/account/AccountNav'

export const dynamic = 'force-dynamic'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login?redirect=/account')

  return (
    <main className="wrap" style={{ paddingTop: 48, paddingBottom: 80, minHeight: '60vh' }}>
      <p className="eyebrow dark">MY ACCOUNT</p>
      <h1 style={{ fontFamily: 'var(--serif)', fontWeight: 'normal', fontSize: 34, margin: '6px 0 28px' }}>
        Hello, {session.user.name || 'there'}
      </h1>
      <div className="account-layout">
        <aside><AccountNav /></aside>
        <div>{children}</div>
      </div>
    </main>
  )
}
