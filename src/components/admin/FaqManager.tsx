'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Faq {
  id: string
  question: string
  answer: string
  category: string
  sortOrder: number
  isActive: boolean
}

export default function FaqManager({ initial }: { initial: Faq[] }) {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [a, setA] = useState('')
  const [cat, setCat] = useState('General')
  const [busy, setBusy] = useState(false)

  async function add() {
    if (!q.trim() || !a.trim()) return
    setBusy(true)
    await fetch('/api/admin/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: q, answer: a, category: cat }),
    })
    setBusy(false)
    setQ(''); setA('')
    router.refresh()
  }

  async function remove(id: string) {
    if (!confirm('Delete this FAQ?')) return
    await fetch(`/api/admin/faqs/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  async function toggle(id: string, isActive: boolean) {
    await fetch(`/api/admin/faqs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    })
    router.refresh()
  }

  return (
    <div>
      <div className="admin-card">
        <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 'normal', fontSize: 18, marginTop: 0 }}>Add FAQ</h2>
        <label className="admin-field"><span>Question</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <label className="admin-field"><span>Answer</span>
          <textarea rows={3} value={a} onChange={(e) => setA(e.target.value)} />
        </label>
        <label className="admin-field"><span>Category</span>
          <input value={cat} onChange={(e) => setCat(e.target.value)} placeholder="Orders, Shipping, Returns…" />
        </label>
        <button className="button dark" onClick={add} disabled={busy}>{busy ? 'Adding…' : 'Add FAQ'}</button>
      </div>

      {initial.length === 0 ? (
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>No FAQs yet.</p>
      ) : (
        <table className="admin-table">
          <thead><tr><th>Question</th><th>Category</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {initial.map((f) => (
              <tr key={f.id}>
                <td>{f.question}</td>
                <td>{f.category}</td>
                <td>
                  <button onClick={() => toggle(f.id, f.isActive)} className="badge-pill" style={{ border: 'none', cursor: 'pointer', background: f.isActive ? '#e6f4ea' : '#f1f1f1', color: f.isActive ? '#1e7e34' : '#888' }}>
                    {f.isActive ? 'Active' : 'Hidden'}
                  </button>
                </td>
                <td><button onClick={() => remove(f.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#b3261e', fontWeight: 'bold', fontSize: 13 }}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
