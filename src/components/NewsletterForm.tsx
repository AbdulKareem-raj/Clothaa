'use client'

import { useState } from 'react'
import { useToast } from './Toast'

export default function NewsletterForm() {
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      showToast(res.ok ? 'Subscribed! Thanks for joining.' : data.error || 'Something went wrong.')
      if (res.ok) setEmail('')
    } catch {
      showToast('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email address"
        required
        aria-label="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="button dark" disabled={loading}>
        {loading ? 'Signing up…' : 'Sign me up ↗'}
      </button>
      <small>Connect an email service before launch.</small>
    </form>
  )
}
