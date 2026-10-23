'use client'

import { useState } from 'react'
import Link from 'next/link'

const CATEGORIES = ['All', 'Orders', 'Shipping', 'Returns', 'Products', 'Payment']

const FAQS = [
  // Orders
  { id: 1, cat: 'Orders',   q: 'How do I track my order?',                       a: 'Once your order ships, you\'ll receive an email with a tracking number. You can also view order status in your account under "My Orders".' },
  { id: 2, cat: 'Orders',   q: 'Can I change or cancel my order?',                a: 'You can cancel or modify your order within 1 hour of placing it. After that, it may already be in processing. Contact us immediately at hello@example.com.' },
  { id: 3, cat: 'Orders',   q: 'I placed an order but didn\'t get a confirmation email.',  a: 'Check your spam/junk folder. If it\'s not there, your order may not have gone through. Contact us with your name and email and we\'ll check.' },

  // Shipping
  { id: 4, cat: 'Shipping', q: 'How long does delivery take?',                   a: 'Standard delivery: 3–7 business days. Express delivery (where available): 1–2 business days. International orders: 7–14 business days.' },
  { id: 5, cat: 'Shipping', q: 'Do you offer free shipping?',                    a: 'Yes — free standard shipping on all orders over $150. Orders under $150 incur a flat $9.99 shipping fee.' },
  { id: 6, cat: 'Shipping', q: 'Do you ship internationally?',                   a: 'Yes, we ship to most countries. International shipping rates and times are calculated at checkout.' },
  { id: 7, cat: 'Shipping', q: 'My order says delivered but I haven\'t received it.', a: 'Check with neighbours and building management first. Then contact us within 48 hours and we\'ll investigate with the carrier.' },

  // Returns
  { id: 8,  cat: 'Returns', q: 'What is your return policy?',                    a: 'We accept returns within 30 days of delivery. Items must be unworn, unwashed, and have original tags attached. See our full Return Policy for details.' },
  { id: 9,  cat: 'Returns', q: 'How do I start a return?',                       a: 'Email hello@example.com with your order number. We\'ll send you a prepaid return label within 24 hours.' },
  { id: 10, cat: 'Returns', q: 'How long does a refund take?',                   a: 'Once we receive your return (1–2 days), refunds are processed within 3–5 business days. Allow 2–5 additional days for your bank to show it.' },
  { id: 11, cat: 'Returns', q: 'Can I exchange for a different size?',            a: 'Yes. Contact us within 30 days and we\'ll arrange an exchange, subject to availability.' },

  // Products
  { id: 12, cat: 'Products', q: 'How do I find my size?',                        a: 'Each product page has a size guide with chest, shoulder and length measurements. When in doubt, size up — our jackets are designed for a relaxed fit.' },
  { id: 13, cat: 'Products', q: 'How do I care for my jacket?',                  a: 'Leather jackets: wipe with a damp cloth, condition every 3–6 months. Varsity/Bomber jackets: machine wash cold, gentle cycle. Hang dry. See the care label for item-specific instructions.' },
  { id: 14, cat: 'Products', q: 'Are your jackets true to size?',                a: 'Our jackets run true to size with a relaxed fit. If you prefer a slimmer fit, we recommend sizing down.' },
  { id: 15, cat: 'Products', q: 'Will you restock sold-out items?',              a: 'Some items are limited edition and will not be restocked. Popular styles are usually restocked within 4–8 weeks. Sign up to the newsletter to be notified.' },

  // Payment
  { id: 16, cat: 'Payment', q: 'What payment methods do you accept?',            a: 'We accept all major credit and debit cards (Visa, Mastercard, Amex), Apple Pay, Google Pay, and Cash on Delivery (COD) in eligible areas.' },
  { id: 17, cat: 'Payment', q: 'Is it safe to pay on your website?',             a: 'Yes. All payments are processed by Stripe, which is PCI DSS Level 1 certified — the highest level of payment security. We never store your card details.' },
  { id: 18, cat: 'Payment', q: 'Can I pay on delivery (COD)?',                   a: 'Yes, Cash on Delivery is available in select areas. This option will appear at checkout if available for your location.' },
  { id: 19, cat: 'Payment', q: 'Do you offer instalment payments?',              a: 'We are working on adding Buy Now Pay Later options. Sign up to our newsletter to be notified when this launches.' },
]

export default function FaqPage() {
  const [activeCat, setActiveCat] = useState('All')
  const [openId, setOpenId] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  const filtered = FAQS.filter((f) => {
    const matchCat = activeCat === 'All' || f.cat === activeCat
    const matchSearch = search === '' ||
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="page-hero">
        <p className="eyebrow">HELP CENTER</p>
        <h1>Frequently Asked Questions</h1>
        <p>Quick answers to common questions.</p>
      </section>

      {/* Search */}
      <div style={{ background: '#efede6', padding: '28px 0' }}>
        <div className="wrap" style={{ maxWidth: 560 }}>
          <input
            type="search"
            placeholder="Search questions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '14px 18px', border: '1px solid #e2dfd7',
              fontSize: 14, background: 'white', outline: 'none',
            }}
          />
        </div>
      </div>

      <main className="wrap" style={{ paddingTop: 48, paddingBottom: 80, display: 'grid', gridTemplateColumns: '180px 1fr', gap: 48, alignItems: 'start' }}>

        {/* Category sidebar */}
        <aside style={{ position: 'sticky', top: 100 }}>
          <p style={{ fontSize: 10, letterSpacing: '.12em', fontWeight: 'bold', color: '#98743d', marginBottom: 10 }}>
            CATEGORIES
          </p>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '10px 12px', border: 'none', cursor: 'pointer',
                fontSize: 13, marginBottom: 2,
                background: activeCat === cat ? '#191c1b' : 'transparent',
                color: activeCat === cat ? 'white' : '#5f655f',
              }}
            >
              {cat}
              <span style={{ float: 'right', fontSize: 11, color: activeCat === cat ? '#c6a66c' : '#aaa' }}>
                {cat === 'All' ? FAQS.length : FAQS.filter((f) => f.cat === cat).length}
              </span>
            </button>
          ))}
        </aside>

        {/* FAQ list */}
        <div>
          {filtered.length === 0 ? (
            <div style={{ padding: '48px 0', textAlign: 'center', color: '#737873' }}>
              <p style={{ fontSize: 16 }}>No results found for &ldquo;{search}&rdquo;</p>
              <p style={{ fontSize: 13 }}>
                Still need help? <Link href="/contact" style={{ color: '#c6a66c', fontWeight: 'bold' }}>Contact us →</Link>
              </p>
            </div>
          ) : (
            <>
              <p style={{ fontSize: 11, color: '#737873', marginBottom: 20, letterSpacing: '.05em' }}>
                {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
              </p>
              {filtered.map((faq) => (
                <div key={faq.id} style={{ borderBottom: '1px solid #e2dfd7' }}>
                  <button
                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                    style={{
                      width: '100%', textAlign: 'left', padding: '18px 0',
                      background: 'none', border: 'none', cursor: 'pointer',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      gap: 16,
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 'bold', color: '#191c1b', flex: 1 }}>
                      {faq.q}
                    </span>
                    <span style={{
                      flexShrink: 0, width: 24, height: 24, border: '1px solid #e2dfd7',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, color: '#c6a66c', fontWeight: 'normal',
                    }}>
                      {openId === faq.id ? '−' : '+'}
                    </span>
                  </button>
                  {openId === faq.id && (
                    <p style={{ fontSize: 13, color: '#5f655f', lineHeight: 1.9, paddingBottom: 18, margin: 0 }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </>
          )}

          {/* Still need help */}
          <div style={{ marginTop: 48, padding: '28px', background: '#efede6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ fontWeight: 'bold', fontSize: 15, margin: '0 0 4px' }}>Couldn&apos;t find your answer?</p>
              <p style={{ fontSize: 13, color: '#737873', margin: 0 }}>Our team replies within 24 hours.</p>
            </div>
            <Link href="/contact" className="button dark">Contact us ↗</Link>
          </div>
        </div>
      </main>
    </>
  )
}
