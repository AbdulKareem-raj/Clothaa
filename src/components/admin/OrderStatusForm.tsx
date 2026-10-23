'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']
const PAYMENT_STATUSES = ['UNPAID', 'PAID', 'REFUNDED']

export default function OrderStatusForm({
  orderId,
  initialStatus,
  initialPaymentStatus,
  initialTracking,
}: {
  orderId: string
  initialStatus: string
  initialPaymentStatus: string
  initialTracking: string
}) {
  const router = useRouter()
  const [status, setStatus] = useState(initialStatus)
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus)
  const [trackingNumber, setTrackingNumber] = useState(initialTracking)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  async function save() {
    setSaving(true)
    setMsg('')
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, paymentStatus, trackingNumber }),
    })
    setSaving(false)
    if (!res.ok) {
      setMsg('Update failed')
      return
    }
    setMsg(status === 'SHIPPED' && trackingNumber ? 'Saved — shipping email sent.' : 'Saved.')
    router.refresh()
  }

  return (
    <div className="admin-card">
      <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 'normal', fontSize: 18, marginTop: 0 }}>Update order</h2>

      <label className="admin-field"><span>Order status</span>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>

      <label className="admin-field"><span>Payment status</span>
        <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
          {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>

      <label className="admin-field"><span>Tracking number</span>
        <input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="Set when shipping" />
      </label>

      <button className="button dark" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
      {msg && <p style={{ fontSize: 12, color: '#1e7e34', marginTop: 10 }}>{msg}</p>}
      <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>
        Setting status to <strong>SHIPPED</strong> with a tracking number emails the customer automatically.
      </p>
    </div>
  )
}
