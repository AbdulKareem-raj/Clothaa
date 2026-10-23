'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function WishlistRemoveButton({ productId }: { productId: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function remove() {
    setBusy(true)
    await fetch(`/api/wishlist?productId=${productId}`, { method: 'DELETE' })
    setBusy(false)
    router.refresh()
  }

  return (
    <button onClick={remove} disabled={busy} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#b3261e', fontWeight: 'bold', fontSize: 12 }}>
      {busy ? '…' : 'Remove'}
    </button>
  )
}
