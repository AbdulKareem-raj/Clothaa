'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ReviewActions({ id, isApproved }: { id: string; isApproved: boolean }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function setApproved(value: boolean) {
    setBusy(true)
    await fetch(`/api/admin/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isApproved: value }),
    })
    setBusy(false)
    router.refresh()
  }

  async function remove() {
    if (!confirm('Delete this review?')) return
    setBusy(true)
    await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' })
    setBusy(false)
    router.refresh()
  }

  return (
    <span style={{ whiteSpace: 'nowrap' }}>
      {!isApproved ? (
        <button onClick={() => setApproved(true)} disabled={busy} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#1e7e34', fontWeight: 'bold', fontSize: 13, marginRight: 12 }}>Approve</button>
      ) : (
        <button onClick={() => setApproved(false)} disabled={busy} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#8a6d1f', fontWeight: 'bold', fontSize: 13, marginRight: 12 }}>Unapprove</button>
      )}
      <button onClick={remove} disabled={busy} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#b3261e', fontWeight: 'bold', fontSize: 13 }}>Delete</button>
    </span>
  )
}
