'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function handleDelete() {
    if (!confirm('Delete this product? This cannot be undone.')) return
    setBusy(true)
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    const data = await res.json()
    setBusy(false)
    if (!res.ok) {
      alert(data.error || 'Delete failed')
      return
    }
    router.refresh()
  }

  return (
    <button onClick={handleDelete} disabled={busy} style={{ color: '#b3261e', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: 13 }}>
      {busy ? '…' : 'Delete'}
    </button>
  )
}
