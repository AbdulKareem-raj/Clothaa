'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfileForm({ name, phone, email }: { name: string; phone: string; email: string }) {
  const router = useRouter()
  const [n, setN] = useState(name)
  const [p, setP] = useState(phone)
  const [msg, setMsg] = useState('')
  const [saving, setSaving] = useState(false)

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    const res = await fetch('/api/account/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: n, phone: p }),
    })
    setSaving(false)
    setMsg(res.ok ? 'Profile updated.' : 'Update failed.')
    if (res.ok) router.refresh()
  }

  return (
    <form onSubmit={save} className="admin-card" style={{ maxWidth: 460 }}>
      <label className="admin-field"><span>Email (cannot be changed)</span>
        <input value={email} disabled style={{ opacity: 0.6 }} />
      </label>
      <label className="admin-field"><span>Full name</span>
        <input value={n} onChange={(e) => setN(e.target.value)} required />
      </label>
      <label className="admin-field"><span>Phone</span>
        <input value={p} onChange={(e) => setP(e.target.value)} />
      </label>
      <button className="button dark" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save profile'}</button>
      {msg && <p style={{ fontSize: 12, color: '#1e7e34', marginTop: 10 }}>{msg}</p>}
    </form>
  )
}
