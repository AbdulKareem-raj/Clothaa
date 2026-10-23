import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Returns & Exchanges | Northline',
  description: 'Easy 30-day returns and exchanges on all Northline jackets. Free return shipping on eligible orders.',
}

const STEPS = [
  {
    step: '01',
    title: 'Start your return',
    body: 'Email us at hello@example.com with your order number and reason for return. We\'ll confirm eligibility within 24 hours.',
  },
  {
    step: '02',
    title: 'Pack it up',
    body: 'Place the item in its original packaging (or any secure box). Include your order number inside the parcel.',
  },
  {
    step: '03',
    title: 'Ship it back',
    body: 'We\'ll email you a prepaid return label. Drop the parcel at any post office or collection point.',
  },
  {
    step: '04',
    title: 'Refund or exchange',
    body: 'Once we receive and inspect the item (1–2 business days), your refund or exchange is processed within 3–5 business days.',
  },
]

const FAQS = [
  {
    q: 'How long do I have to return an item?',
    a: '30 days from the date of delivery. Items must be unworn, unwashed and in original condition with all tags attached.',
  },
  {
    q: 'Is return shipping free?',
    a: 'Yes — we provide a prepaid return label for all eligible returns within our 30-day window.',
  },
  {
    q: 'Can I exchange for a different size?',
    a: 'Yes. Mention the size you want when you contact us. Subject to stock availability. If the new size is unavailable, we\'ll issue a full refund.',
  },
  {
    q: 'What items cannot be returned?',
    a: 'Items that have been worn, washed, damaged by the customer, or are missing original tags. Sale items marked "Final Sale" are also non-returnable.',
  },
  {
    q: 'When will I receive my refund?',
    a: 'Refunds are processed within 3–5 business days of receiving your return. It may take an additional 2–5 days to appear on your statement depending on your bank.',
  },
  {
    q: 'My item arrived damaged. What do I do?',
    a: 'Email us within 48 hours of delivery with photos of the damage. We\'ll arrange a replacement or full refund immediately — no return shipping needed.',
  },
]

export default function ReturnsPage() {
  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">CUSTOMER CARE</p>
        <h1>Returns & Exchanges</h1>
        <p>30-day hassle-free returns. Free return shipping.</p>
      </section>

      {/* Policy highlights */}
      <section style={{ background: '#efede6', padding: '36px 0' }}>
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {[
              { icon: '↩', label: '30-Day Returns',       sub: 'From delivery date'       },
              { icon: '✈', label: 'Free Return Shipping',  sub: 'Prepaid label provided'   },
              { icon: '⟳', label: 'Easy Exchanges',        sub: 'Size swaps welcome'        },
              { icon: '⚡', label: 'Fast Refunds',          sub: '3–5 business days'        },
            ].map((item) => (
              <div key={item.label} style={{ textAlign: 'center', padding: '20px 12px', background: 'white' }}>
                <div style={{ fontSize: 24, color: '#c6a66c', marginBottom: 10 }}>{item.icon}</div>
                <p style={{ fontWeight: 'bold', fontSize: 13, margin: '0 0 4px' }}>{item.label}</p>
                <p style={{ fontSize: 11, color: '#737873', margin: 0 }}>{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="wrap section">
        <p className="eyebrow dark" style={{ textAlign: 'center' }}>THE PROCESS</p>
        <h2 style={{ fontFamily: 'Georgia', fontWeight: 'normal', fontSize: 36, textAlign: 'center', margin: '10px 0 48px' }}>
          How returns work
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0, position: 'relative' }}>
          {/* Connecting line */}
          <div style={{ position: 'absolute', top: 28, left: '12.5%', right: '12.5%', height: 1, background: '#e2dfd7', zIndex: 0 }} />

          {STEPS.map((s) => (
            <div key={s.step} style={{ textAlign: 'center', padding: '0 20px', position: 'relative', zIndex: 1 }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%', background: '#191c1b',
                color: '#c6a66c', fontSize: 12, fontWeight: 'bold', letterSpacing: '.05em',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                {s.step}
              </div>
              <h3 style={{ fontFamily: 'Georgia', fontWeight: 'normal', fontSize: 17, margin: '0 0 10px' }}>
                {s.title}
              </h3>
              <p style={{ fontSize: 12, color: '#737873', lineHeight: 1.7, margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link href="/contact" className="button dark">Start a return ↗</Link>
        </div>
      </section>

      {/* Policy details */}
      <section style={{ background: '#faf9f6', padding: '60px 0' }}>
        <div className="wrap" style={{ maxWidth: 720 }}>
          <h2 style={{ fontFamily: 'Georgia', fontWeight: 'normal', fontSize: 32, marginBottom: 32 }}>
            Return conditions
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
            <div style={{ padding: '20px', background: 'white', borderTop: '3px solid #4caf50' }}>
              <p style={{ fontWeight: 'bold', fontSize: 13, color: '#4caf50', margin: '0 0 12px', letterSpacing: '.05em' }}>
                ✓ ELIGIBLE FOR RETURN
              </p>
              <ul style={{ fontSize: 13, color: '#5f655f', lineHeight: 2, margin: 0, paddingLeft: 16 }}>
                <li>Unworn and unwashed</li>
                <li>Original tags attached</li>
                <li>Within 30 days of delivery</li>
                <li>In original or equivalent packaging</li>
              </ul>
            </div>
            <div style={{ padding: '20px', background: 'white', borderTop: '3px solid #e53935' }}>
              <p style={{ fontWeight: 'bold', fontSize: 13, color: '#e53935', margin: '0 0 12px', letterSpacing: '.05em' }}>
                ✗ NOT ELIGIBLE
              </p>
              <ul style={{ fontSize: 13, color: '#5f655f', lineHeight: 2, margin: 0, paddingLeft: 16 }}>
                <li>Worn or washed items</li>
                <li>Missing tags or packaging</li>
                <li>After 30 days from delivery</li>
                <li>Items marked "Final Sale"</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="wrap section" style={{ maxWidth: 720 }}>
        <h2 style={{ fontFamily: 'Georgia', fontWeight: 'normal', fontSize: 32, marginBottom: 32 }}>
          Common questions
        </h2>
        {FAQS.map((faq, i) => (
          <div key={i} style={{ borderBottom: '1px solid #e2dfd7', padding: '18px 0' }}>
            <p style={{ fontWeight: 'bold', fontSize: 14, margin: '0 0 8px', color: '#191c1b' }}>
              {faq.q}
            </p>
            <p style={{ fontSize: 13, color: '#5f655f', margin: 0, lineHeight: 1.8 }}>{faq.a}</p>
          </div>
        ))}
        <p style={{ fontSize: 13, color: '#737873', marginTop: 24 }}>
          Still have questions? <Link href="/contact" style={{ color: '#c6a66c', fontWeight: 'bold' }}>Contact us →</Link>
        </p>
      </section>
    </>
  )
}
