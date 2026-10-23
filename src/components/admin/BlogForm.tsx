'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import CloudinaryUpload from '@/components/CloudinaryUpload'

export interface BlogFormValues {
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  category: string
  readTime: number
  tags: string[]
  isPublished: boolean
}

const EMPTY: BlogFormValues = {
  title: '', slug: '', excerpt: '', content: '', coverImage: '',
  category: 'Style Guide', readTime: 5, tags: [], isPublished: false,
}

export default function BlogForm({ initial, mode }: { initial?: BlogFormValues; mode: 'create' | 'edit' }) {
  const router = useRouter()
  const [v, setV] = useState<BlogFormValues>(initial ?? EMPTY)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function set<K extends keyof BlogFormValues>(key: K, value: BlogFormValues[K]) {
    setV((p) => ({ ...p, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    const url = mode === 'create' ? '/api/admin/blog' : `/api/admin/blog/${v.id}`
    const method = mode === 'create' ? 'POST' : 'PATCH'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: v.title,
        slug: v.slug || undefined,
        excerpt: v.excerpt,
        content: v.content,
        coverImage: v.coverImage || null,
        category: v.category,
        readTime: Number(v.readTime),
        tags: v.tags,
        isPublished: v.isPublished,
      }),
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) { setError(data.error || 'Save failed'); return }
    router.push('/admin/blog')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="admin-card" style={{ maxWidth: 780 }}>
      {error && <div className="auth-error">{error}</div>}

      <label className="admin-field"><span>Title</span>
        <input value={v.title} onChange={(e) => set('title', e.target.value)} required />
      </label>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <label className="admin-field"><span>Category</span>
          <input value={v.category} onChange={(e) => set('category', e.target.value)} />
        </label>
        <label className="admin-field"><span>Read time (min)</span>
          <input type="number" value={v.readTime} onChange={(e) => set('readTime', Number(e.target.value))} />
        </label>
      </div>

      <label className="admin-field"><span>Excerpt</span>
        <textarea rows={2} value={v.excerpt} onChange={(e) => set('excerpt', e.target.value)} required />
      </label>

      <label className="admin-field"><span>Content (HTML allowed)</span>
        <textarea rows={12} value={v.content} onChange={(e) => set('content', e.target.value)} required style={{ fontFamily: 'monospace', fontSize: 13 }} />
      </label>

      <label className="admin-field"><span>Tags (comma separated)</span>
        <input value={v.tags.join(', ')} onChange={(e) => set('tags', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} />
      </label>

      <div className="admin-field">
        <span>Cover image</span>
        {v.coverImage && (
          <div style={{ position: 'relative', width: 180, height: 110, marginBottom: 10 }}>
            <Image src={v.coverImage} alt="" fill style={{ objectFit: 'cover' }} />
            <button type="button" onClick={() => set('coverImage', '')} style={{ position: 'absolute', top: -8, right: -8, background: '#b3261e', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer' }}>×</button>
          </div>
        )}
        <CloudinaryUpload type="image" label="Upload cover (Cloudinary)" onUpload={(url) => set('coverImage', url)} />
      </div>

      <label style={{ fontSize: 13, display: 'block', margin: '8px 0 18px' }}>
        <input type="checkbox" checked={v.isPublished} onChange={(e) => set('isPublished', e.target.checked)} /> Published
      </label>

      <button className="button dark" type="submit" disabled={saving}>
        {saving ? 'Saving…' : mode === 'create' ? 'Create post' : 'Save changes'}
      </button>
    </form>
  )
}
