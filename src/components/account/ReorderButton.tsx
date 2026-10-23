'use client'

import { useRouter } from 'next/navigation'
import { useCart } from '@/components/CartProvider'
import { useToast } from '@/components/Toast'

interface Item {
  productId: string
  size: string
  qty: number
}

export default function ReorderButton({
  items,
  className = 'button light',
  label = 'Re-order',
}: {
  items: Item[]
  className?: string
  label?: string
}) {
  const router = useRouter()
  const { addItem } = useCart()
  const { showToast } = useToast()

  function reorder() {
    let added = 0
    for (const it of items) {
      for (let i = 0; i < it.qty; i++) {
        addItem(it.productId, it.size)
        added++
      }
    }
    showToast(`${added} item${added === 1 ? '' : 's'} added to bag`)
    router.push('/cart')
  }

  return (
    <button
      onClick={reorder}
      className={className}
      style={className.includes('light') ? { border: '1px solid var(--line)' } : undefined}
    >
      {label}
    </button>
  )
}
