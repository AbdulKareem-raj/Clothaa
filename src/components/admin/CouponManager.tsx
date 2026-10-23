'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Coupon {
  id: string
  code: string
  type: 'PERCENT' | 'FIXED'
  value: number
  minOrderCents: number | null
  maxUses: number | null
  usedCount: number
  expiresAt: string | null
  isActive: boolean
}

export default function CouponManager({ initial }: { initial: Coupon[] }) {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [type, setType] = useState<'PERCENT' | 'FIXED'>('PERCENT')
  const [value, setValue] = useState(10)
  const [minOrder, setMinOrder] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function add() {
    setError('')
    if (!code.trim()) return
    setBusy(true)
    const res = await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        type,
        value: Number(value),
        minOrderCents: minOrder ? Math.round(Number(minOrder) * 100) : null,
        expiresAt: expiresAt || null,
      }),
    })
    const data = await res.json()
    setBusy(false)
    if (!res.ok) { setError(data.error || 'Failed'); return }
    setCode(''); setValue(10); setMinOrder(''); setExpiresAt('')
    router.refresh()
  }

  async function remove(id: string) {
    if (!confirm('Delete this coupon?')) return
    await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  async function toggle(id: string, isActive: boolean) {
    await fetch(`/api/admin/coupons/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    })
    router.refresh()
  }

  return (
    <div>
      <div className="admin-card">
        <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 'normal', fontSize: 18, marginTop: 0 }}>Create coupon</h2>
        {error && <div className="auth-error">{error}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <label className="admin-field"><span>Code</span>
            <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="WELCOME10" />
          </label>
          <label className="admin-field"><span>Type</span>
            <select value={type} onChange={(e) => setType(e.target.value as 'PERCENT' | 'FIXED')}>
              <option value="PERCENT">Percent (%)</option>
              <option value="FIXED">Fixed ($)</option>
            </select>
          </label>
          <label className="admin-field"><span>{type === 'PERCENT' ? 'Percent off' : 'Amount off ($)'}</span>
            <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} />
          </label>
          <label className="admin-field"><span>Min order ($, optional)</span>
            <input type="number" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} />
          </label>
          <label className="admin-field"><span>Expires (optional)</span>
            <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
          </label>
        </div>
        <button className="button dark" onClick={add} disabled={busy}>{busy ? 'Creating…' : 'Create coupon'}</button>
      </div>

      {initial.length === 0 ? (
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>No coupons yet.</p>
      ) : (
        <table className="admin-table">
          <thead><tr><th>Code</th><th>Discount</th><th>Min order</th><th>Used</th><th>Expires</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {initial.map((c) => (
              <tr key={c.id}>
                <td style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{c.code}</td>
                <td>{c.type === 'PERCENT' ? `${c.value}%` : `$${c.value}`}</td>
                <td>{c.minOrderCents ? `$${(c.minOrderCents / 100).toFixed(2)}` : '—'}</td>
                <td>{c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ''}</td>
                <td>{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : '—'}</td>
                <td>
                  <button onClick={() => toggle(c.id, c.isActive)} className="badge-pill" style={{ border: 'none', cursor: 'pointer', background: c.isActive ? '#e6f4ea' : '#f1f1f1', color: c.isActive ? '#1e7e34' : '#888' }}>
                    {c.isActive ? 'Active' : 'Off'}
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
