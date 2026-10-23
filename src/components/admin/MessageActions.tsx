'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function MessageActions({ id, isRead }: { id: string; isRead: boolean }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function mark() {
    setBusy(true)
    await fetch(`/api/admin/messages/${id}`, { method: 'PATCH' })
    setBusy(false)
    router.refresh()
  }

  async function remove() {
    if (!confirm('Delete this message?')) return
    setBusy(true)
    await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' })
    setBusy(false)
    router.refresh()
  }

  return (
    <span style={{ whiteSpace: 'nowrap' }}>
      {!isRead && (
        <button onClick={mark} disabled={busy} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--gold)', fontWeight: 'bold', fontSize: 13, marginRight: 12 }}>
          Mark read
        </button>
      )}
      <button onClick={remove} disabled={busy} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#b3261e', fontWeight: 'bold', fontSize: 13 }}>
        Delete
      </button>
    </span>
  )
}
