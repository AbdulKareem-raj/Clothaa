'use client'

import { useState } from 'react'
import { Product, formatPrice } from '@/data/products'
import { useCart } from './CartProvider'
import { useToast } from './Toast'
import { trackAddToCart } from '@/lib/analytics'
import { logActivity } from '@/lib/activity'

export default function AddToCartButton({ product }: { product: Product }) {
  const [size, setSize] = useState('M')
  const { addItem } = useCart()
  const { showToast } = useToast()

  function handleAdd() {
    addItem(product.id, size)
    trackAddToCart({ id: product.id, name: product.name, price: product.price, size, qty: 1 })
    logActivity('add_to_cart', { productId: product.id, name: product.name, size, price: product.price })
    showToast('Added to bag')
  }

  return (
    <>
      <label htmlFor="size">Choose size</label>
      <select id="size" value={size} onChange={(e) => setSize(e.target.value)}>
        {product.sizes.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <button className="button dark" onClick={handleAdd}>
        Add to bag — {formatPrice(product.price)}
      </button>
    </>
  )
}
