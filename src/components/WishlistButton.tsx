'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useToast } from '@/components/Toast'
import { trackWishlistAdd } from '@/lib/analytics'

export default function WishlistButton({ productId, productName }: { productId: string; productName: string }) {
  const router = useRouter()
  const { data: session } = useSession()
  const { showToast } = useToast()
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)

  async function add() {
    if (!session) {
      router.push('/login?redirect=/account/wishlist')
      return
    }
    setBusy(true)
    const res = await fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    })
    setBusy(false)
    if (res.ok) {
      setSaved(true)
      trackWishlistAdd(productId, productName)
      showToast('Saved to wishlist ♥')
    } else {
      showToast('Could not save. Try again.')
    }
  }

  return (
    <button
      type="button"
      onClick={add}
      disabled={busy || saved}
      className="button light"
      style={{ border: '1px solid var(--line)', marginLeft: 8 }}
    >
      {saved ? '♥ Saved' : '♡ Wishlist'}
    </button>
  )
}
