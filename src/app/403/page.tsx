import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Access denied | Northline',
}

export default function ForbiddenPage() {
  return (
    <main className="wrap" style={{ textAlign: 'center', padding: '100px 20px', minHeight: '50vh' }}>
      <p className="eyebrow dark">403</p>
      <h1 style={{ fontFamily: 'var(--serif)', fontWeight: 'normal', fontSize: 40, margin: '10px 0 14px' }}>
        Access denied
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: 14, maxWidth: 420, margin: '0 auto 24px' }}>
        You don&apos;t have permission to view this page. This area is for store administrators only.
      </p>
      <Link href="/" className="button dark">Back to home ↗</Link>
    </main>
  )
}
