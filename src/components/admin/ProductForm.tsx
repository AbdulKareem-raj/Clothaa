'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import CloudinaryUpload from '@/components/CloudinaryUpload'

export interface ProductFormValues {
  id?: string
  name: string
  sku: string
  slug: string
  description: string
  price: number
  comparePrice: number | null
  category: string
  badge: string
  sizes: string[]
  stock: number
  images: string[]
  videos: string[]
  isActive: boolean
  isFeatured: boolean
}

const EMPTY: ProductFormValues = {
  name: '', sku: '', slug: '', description: '', price: 0, comparePrice: null,
  category: 'Leather', badge: '', sizes: ['S', 'M', 'L', 'XL'], stock: 0,
  images: [], videos: [], isActive: true, isFeatured: false,
}

export default function ProductForm({ initial, mode }: { initial?: ProductFormValues; mode: 'create' | 'edit' }) {
  const router = useRouter()
  const [v, setV] = useState<ProductFormValues>(initial ?? EMPTY)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function set<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setV((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const url = mode === 'create' ? '/api/admin/products' : `/api/admin/products/${v.id}`
    const method = mode === 'create' ? 'POST' : 'PATCH'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: v.name,
        sku: v.sku,
        slug: v.slug || undefined,
        description: v.description,
        price: Number(v.price),
        comparePrice: v.comparePrice ? Number(v.comparePrice) : null,
        category: v.category,
        badge: v.badge || null,
        sizes: v.sizes,
        stock: Number(v.stock),
        images: v.images,
        videos: v.videos,
        isActive: v.isActive,
        isFeatured: v.isFeatured,
      }),
    })

    const data = await res.json()
    setSaving(false)
    if (!res.ok) {
      setError(data.error || 'Save failed')
      return
    }
    router.push('/admin/products')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="admin-card" style={{ maxWidth: 720 }}>
      {error && <div className="auth-error">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <label className="admin-field"><span>Name</span>
          <input value={v.name} onChange={(e) => set('name', e.target.value)} required />
        </label>
        <label className="admin-field"><span>SKU</span>
          <input value={v.sku} onChange={(e) => set('sku', e.target.value)} required />
        </label>
        <label className="admin-field"><span>Category</span>
          <input value={v.category} onChange={(e) => set('category', e.target.value)} required />
        </label>
        <label className="admin-field"><span>Badge (optional)</span>
          <input value={v.badge} onChange={(e) => set('badge', e.target.value)} placeholder="New, Bestseller…" />
        </label>
        <label className="admin-field"><span>Price ($)</span>
          <input type="number" step="0.01" value={v.price} onChange={(e) => set('price', Number(e.target.value))} required />
        </label>
        <label className="admin-field"><span>Compare-at price ($, optional)</span>
          <input type="number" step="0.01" value={v.comparePrice ?? ''} onChange={(e) => set('comparePrice', e.target.value ? Number(e.target.value) : null)} />
        </label>
        <label className="admin-field"><span>Stock</span>
          <input type="number" value={v.stock} onChange={(e) => set('stock', Number(e.target.value))} required />
        </label>
        <label className="admin-field"><span>Sizes (comma separated)</span>
          <input value={v.sizes.join(', ')} onChange={(e) => set('sizes', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} />
        </label>
      </div>

      <label className="admin-field"><span>Description</span>
        <textarea rows={4} value={v.description} onChange={(e) => set('description', e.target.value)} required />
      </label>

      {/* Images */}
      <div className="admin-field">
        <span>Images</span>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
          {v.images.map((url, i) => (
            <div key={url} style={{ position: 'relative', width: 80, height: 100 }}>
              <Image src={url} alt="" fill style={{ objectFit: 'cover' }} />
              <button type="button" onClick={() => set('images', v.images.filter((_, idx) => idx !== i))}
                style={{ position: 'absolute', top: -8, right: -8, background: '#b3261e', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', fontSize: 12 }}>×</button>
            </div>
          ))}
        </div>
        <CloudinaryUpload type="image" label="Add image (Cloudinary)" onUpload={(url) => set('images', [...v.images, url])} />
      </div>

      {/* Videos */}
      <div className="admin-field">
        <span>Videos</span>
        {v.videos.map((url, i) => (
          <p key={url} style={{ fontSize: 12 }}>
            {url} <button type="button" onClick={() => set('videos', v.videos.filter((_, idx) => idx !== i))} style={{ color: '#b3261e', border: 'none', background: 'none', cursor: 'pointer' }}>remove</button>
          </p>
        ))}
        <CloudinaryUpload type="video" label="Add video (Cloudinary)" onUpload={(url) => set('videos', [...v.videos, url])} />
      </div>

      <div style={{ display: 'flex', gap: 24, margin: '8px 0 18px' }}>
        <label style={{ fontSize: 13 }}>
          <input type="checkbox" checked={v.isActive} onChange={(e) => set('isActive', e.target.checked)} /> Active
        </label>
        <label style={{ fontSize: 13 }}>
          <input type="checkbox" checked={v.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} /> Featured
        </label>
      </div>

      <button className="button dark" type="submit" disabled={saving}>
        {saving ? 'Saving…' : mode === 'create' ? 'Create product' : 'Save changes'}
      </button>
    </form>
  )
}
