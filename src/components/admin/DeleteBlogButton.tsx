'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteBlogButton({ id }: { id: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function remove() {
    if (!confirm('Delete this post?')) return
    setBusy(true)
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
    setBusy(false)
    router.refresh()
  }

  return (
    <button onClick={remove} disabled={busy} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#b3261e', fontWeight: 'bold', fontSize: 13 }}>
      {busy ? '…' : 'Delete'}
    </button>
  )
}
