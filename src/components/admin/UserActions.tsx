'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function UserActions({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function toggle() {
    setBusy(true)
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    })
    const data = await res.json()
    setBusy(false)
    if (!res.ok) {
      alert(data.error || 'Update failed')
      return
    }
    router.refresh()
  }

  return (
    <button onClick={toggle} disabled={busy} style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: 13, color: isActive ? '#b3261e' : '#1e7e34' }}>
      {busy ? '…' : isActive ? 'Deactivate' : 'Activate'}
    </button>
  )
}
