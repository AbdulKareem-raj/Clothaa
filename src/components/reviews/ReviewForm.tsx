'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function ReviewForm({ productId }: { productId: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [saving, setSaving] = useState(false)

  if (status === 'loading') return null

  if (!session) {
    return (
      <div className="review-form">
        <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
          <Link href={`/login?redirect=${pathname}`} style={{ color: 'var(--gold)', fontWeight: 'bold' }}>Sign in</Link>{' '}
          to write a review.
        </p>
      </div>
    )
  }

  if (done) {
    return (
      <div className="review-form">
        <p style={{ fontSize: 14, color: '#1e7e34', margin: 0 }}>Thank you! Your review has been posted. ✓</p>
      </div>
    )
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (rating < 1) {
      setError('Please select a star rating.')
      return
    }
    setSaving(true)
    const res = await fetch(`/api/products/${productId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, title: title || null, body }),
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) {
      setError(data.error || 'Could not submit review.')
      return
    }
    setDone(true)
    router.refresh()
  }

  return (
    <form className="review-form" onSubmit={submit}>
      <h3 style={{ fontFamily: 'var(--serif)', fontWeight: 'normal', fontSize: 18, margin: '0 0 14px' }}>Write a review</h3>
      {error && <div className="auth-error">{error}</div>}

      <div style={{ marginBottom: 14 }}>
        <span style={{ display: 'block', fontSize: 11, fontWeight: 'bold', letterSpacing: '.05em', marginBottom: 6 }}>YOUR RATING</span>
        <div onMouseLeave={() => setHover(0)} style={{ fontSize: 28, lineHeight: 1, cursor: 'pointer', color: 'var(--gold)' }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              role="button"
              aria-label={`${n} star`}
              onMouseEnter={() => setHover(n)}
              onClick={() => setRating(n)}
              style={{ color: (hover || rating) >= n ? 'var(--gold)' : '#d9d5cc', padding: '0 2px' }}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <label className="admin-field"><span>Title (optional)</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder="Great fit and quality" />
      </label>
      <label className="admin-field"><span>Your review</span>
        <textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} required maxLength={2000} placeholder="Share your experience with this jacket…" />
      </label>

      <button className="button dark" type="submit" disabled={saving}>
        {saving ? 'Posting…' : 'Post review'}
      </button>
    </form>
  )
}
