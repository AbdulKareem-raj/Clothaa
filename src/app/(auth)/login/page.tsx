'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const redirect = params.get('redirect') || '/account'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (res?.error) {
      setError('Invalid email or password.')
      return
    }
    router.push(redirect)
    router.refresh()
  }

  return (
    <div className="auth-card">
      <p className="eyebrow dark" style={{ textAlign: 'center' }}>WELCOME BACK</p>
      <h1 style={{ fontFamily: 'var(--serif)', fontWeight: 'normal', fontSize: 32, textAlign: 'center', margin: '8px 0 28px' }}>
        Sign in
      </h1>

      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <label className="auth-label">Email</label>
        <input
          className="auth-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <label className="auth-label">Password</label>
        <input
          className="auth-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <button className="button dark" type="submit" disabled={loading} style={{ width: '100%', textAlign: 'center', marginTop: 18 }}>
          {loading ? 'Signing in…' : 'Sign in ↗'}
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)', marginTop: 24 }}>
        Don&apos;t have an account?{' '}
        <Link href="/signup" style={{ color: 'var(--gold)', fontWeight: 'bold' }}>Create one</Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="auth-wrap">
      <Suspense fallback={<div className="auth-card">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </main>
  )
}
