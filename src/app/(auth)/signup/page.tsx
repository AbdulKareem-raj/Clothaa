'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
        setLoading(false)
        return
      }

      // Auto sign-in after signup
      await signIn('credentials', { email, password, redirect: false })
      router.push('/account')
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="auth-wrap">
      <div className="auth-card">
        <p className="eyebrow dark" style={{ textAlign: 'center' }}>JOIN NORTHLINE</p>
        <h1 style={{ fontFamily: 'var(--serif)', fontWeight: 'normal', fontSize: 32, textAlign: 'center', margin: '8px 0 28px' }}>
          Create account
        </h1>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="auth-label">Full name</label>
          <input
            className="auth-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />

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
            minLength={8}
            autoComplete="new-password"
          />
          <p style={{ fontSize: 11, color: 'var(--muted)', margin: '6px 0 0' }}>At least 8 characters.</p>

          <button className="button dark" type="submit" disabled={loading} style={{ width: '100%', textAlign: 'center', marginTop: 18 }}>
            {loading ? 'Creating…' : 'Create account ↗'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)', marginTop: 24 }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--gold)', fontWeight: 'bold' }}>Sign in</Link>
        </p>
      </div>
    </main>
  )
}
