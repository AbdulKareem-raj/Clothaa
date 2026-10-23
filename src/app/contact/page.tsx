'use client'

import { useState } from 'react'
import { useToast } from '@/components/Toast'
import type { Metadata } from 'next'

export default function ContactPage() {
  const { showToast } = useToast()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      showToast(res.ok ? 'Message sent! We\'ll be in touch.' : data.error || 'Something went wrong.')
      if (res.ok) setForm({ name: '', email: '', message: '' })
    } catch {
      showToast('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">CUSTOMER CARE</p>
        <h1>Let&apos;s talk.</h1>
        <p>Questions about sizing, delivery or an order?</p>
      </section>

      <main className="wrap prose contact-layout">
        <div>
          <h2>Contact details</h2>
          <p>
            Email: <a href="mailto:hello@example.com">hello@example.com</a>
          </p>
          <p>Replace this example email with your business contact.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input
              name="name"
              required
              value={form.name}
              onChange={handleChange}
            />
          </label>
          <label>
            Email
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </label>
          <label>
            Message
            <textarea
              name="message"
              rows={5}
              required
              value={form.message}
              onChange={handleChange}
            />
          </label>
          <button className="button dark" disabled={loading}>
            {loading ? 'Sending…' : 'Send message ↗'}
          </button>
          <small>Your message is sent directly to our inbox.</small>
        </form>
      </main>
    </>
  )
}
