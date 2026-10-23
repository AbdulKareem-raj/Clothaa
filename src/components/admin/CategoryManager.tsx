'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  sortOrder: number
  isActive: boolean
  productCount: number
}

export default function CategoryManager({ initial }: { initial: Category[] }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [sortOrder, setSortOrder] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function add() {
    setError('')
    if (!name.trim()) return
    setBusy(true)
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, sortOrder: Number(sortOrder) }),
    })
    const data = await res.json()
    setBusy(false)
    if (!res.ok) { setError(data.error || 'Failed'); return }
    setName(''); setDescription(''); setSortOrder(0)
    router.refresh()
  }

  async function toggle(id: string, isActive: boolean) {
    await fetch(`/api/admin/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    })
    router.refresh()
  }

  async function remove(id: string) {
    if (!confirm('Delete this category?')) return
    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) { alert(data.error || 'Delete failed'); return }
    router.refresh()
  }

  return (
    <div>
      <div className="admin-card">
        <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 'normal', fontSize: 18, marginTop: 0 }}>Add category</h2>
        {error && <div className="auth-error">{error}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <label className="admin-field"><span>Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Leather, Varsity, Bomber…" />
          </label>
          <label className="admin-field"><span>Sort order</span>
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
          </label>
        </div>
        <label className="admin-field"><span>Description (optional)</span>
          <input value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <button className="button dark" onClick={add} disabled={busy}>{busy ? 'Adding…' : 'Add category'}</button>
      </div>

      {initial.length === 0 ? (
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>No categories yet.</p>
      ) : (
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Slug</th><th>Products</th><th>Order</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {initial.map((c) => (
              <tr key={c.id}>
                <td style={{ fontWeight: 'bold' }}>{c.name}</td>
                <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{c.slug}</td>
                <td>{c.productCount}</td>
                <td>{c.sortOrder}</td>
                <td>
                  <button onClick={() => toggle(c.id, c.isActive)} className="badge-pill" style={{ border: 'none', cursor: 'pointer', background: c.isActive ? '#e6f4ea' : '#f1f1f1', color: c.isActive ? '#1e7e34' : '#888' }}>
                    {c.isActive ? 'Active' : 'Hidden'}
                  </button>
                </td>
                <td><button onClick={() => remove(c.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#b3261e', fontWeight: 'bold', fontSize: 13 }}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
