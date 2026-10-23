'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Product, formatPrice } from '@/data/products'
import { useCart } from './CartProvider'
import { useToast } from './Toast'

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { showToast } = useToast()

  function handleAdd() {
    addItem(product.id)
    showToast('Added to bag')
  }

  return (
    <article className="card">
      <Link className="card-image" href={`/shop/${product.id}`}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 650px) 50vw, 25vw"
          style={{ objectFit: 'cover' }}
        />
        {product.badge && <span className="badge">{product.badge}</span>}
      </Link>
      <div className="product-category">{product.category} / NORTHLINE</div>
      <h3>
        <Link href={`/shop/${product.id}`}>{product.name}</Link>
      </h3>
      <div className="price">
        {formatPrice(product.price)}
        {product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}
      </div>
      <button className="add" onClick={handleAdd}>
        Add to bag +
      </button>
    </article>
  )
}
