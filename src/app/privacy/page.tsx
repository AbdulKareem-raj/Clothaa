import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | Northline',
  description: 'How Northline collects, uses and protects your personal information.',
}

const LAST_UPDATED = 'October 22, 2026'

const SECTIONS = [
  { id: 'collect',   title: '1. Information We Collect' },
  { id: 'use',       title: '2. How We Use Your Information' },
  { id: 'share',     title: '3. Sharing Your Information' },
  { id: 'cookies',   title: '4. Cookies & Tracking' },
  { id: 'rights',    title: '5. Your Rights' },
  { id: 'security',  title: '6. Data Security' },
  { id: 'retention', title: '7. Data Retention' },
  { id: 'children',  title: '8. Children\'s Privacy' },
  { id: 'contact',   title: '9. Contact Us' },
]

export default function PrivacyPage() {
  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">LEGAL</p>
        <h1>Privacy Policy</h1>
        <p>Last updated: {LAST_UPDATED}</p>
      </section>

      <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 48, padding: '60px 0 80px', alignItems: 'start' }}>

        {/* Table of Contents — sticky sidebar */}
        <aside style={{ position: 'sticky', top: 100 }}>
          <p style={{ fontSize: 10, letterSpacing: '.12em', fontWeight: 'bold', color: '#98743d', marginBottom: 12 }}>
            ON THIS PAGE
          </p>
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} style={{
              display: 'block', fontSize: 12, color: '#5f655f',
              padding: '6px 0', borderBottom: '1px solid #e2dfd7',
              lineHeight: 1.4,
            }}>
              {s.title}
            </a>
          ))}
          <div style={{ marginTop: 24, padding: '16px', background: '#efede6' }}>
            <p style={{ fontSize: 11, color: '#737873', margin: '0 0 8px', lineHeight: 1.6 }}>
              Questions about your data?
            </p>
            <Link href="/contact" style={{ fontSize: 11, fontWeight: 'bold', color: '#191c1b' }}>
              Contact us →
            </Link>
          </div>
        </aside>

        {/* Content */}
        <article className="prose">
          <p style={{ fontSize: 14, color: '#5f655f', lineHeight: 1.9, marginBottom: 32, padding: '16px 20px', background: '#efede6', borderLeft: '3px solid #c6a66c' }}>
            This Privacy Policy explains how Northline ("we", "us", "our") collects, uses and protects your personal information when you visit our website or make a purchase.
          </p>

          <section id="collect">
            <h2>1. Information We Collect</h2>
            <h3 style={{ fontSize: 15, fontFamily: 'Arial', fontWeight: 'bold', margin: '16px 0 8px' }}>Information you give us</h3>
            <ul style={{ fontSize: 13, color: '#5f655f', lineHeight: 2 }}>
              <li>Name, email address, phone number</li>
              <li>Delivery address and billing information</li>
              <li>Payment details (processed securely — we do not store card numbers)</li>
              <li>Messages you send via our contact form</li>
              <li>Newsletter subscription preferences</li>
            </ul>
            <h3 style={{ fontSize: 15, fontFamily: 'Arial', fontWeight: 'bold', margin: '16px 0 8px' }}>Information collected automatically</h3>
            <ul style={{ fontSize: 13, color: '#5f655f', lineHeight: 2 }}>
              <li>Browser type, device type and operating system</li>
              <li>Pages visited, time spent and referring URLs</li>
              <li>IP address and approximate location (country/city level)</li>
              <li>Cookie identifiers (see our <Link href="/cookies" style={{ color: '#c6a66c' }}>Cookie Policy</Link>)</li>
            </ul>
          </section>

          <section id="use" style={{ marginTop: 36 }}>
            <h2>2. How We Use Your Information</h2>
            <ul style={{ fontSize: 13, color: '#5f655f', lineHeight: 2 }}>
              <li>To process and fulfil your orders</li>
              <li>To send order confirmations and shipping updates via email</li>
              <li>To respond to your enquiries and provide customer support</li>
              <li>To send our newsletter (only if you subscribed — unsubscribe any time)</li>
              <li>To improve our website, products and user experience</li>
              <li>To detect and prevent fraud</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section id="share" style={{ marginTop: 36 }}>
            <h2>3. Sharing Your Information</h2>
            <p>We do <strong>not</strong> sell your personal data. We may share it with:</p>
            <ul style={{ fontSize: 13, color: '#5f655f', lineHeight: 2 }}>
              <li><strong>Shipping carriers</strong> — to deliver your order (name and address only)</li>
              <li><strong>Payment processors</strong> — Stripe processes card payments securely</li>
              <li><strong>Email service</strong> — to send transactional emails</li>
              <li><strong>Analytics providers</strong> — anonymised usage data only</li>
              <li><strong>Legal authorities</strong> — only when required by law</li>
            </ul>
          </section>

          <section id="cookies" style={{ marginTop: 36 }}>
            <h2>4. Cookies & Tracking</h2>
            <p>We use cookies to keep your cart, remember preferences and analyse site usage. For full details, see our <Link href="/cookies" style={{ color: '#c6a66c' }}>Cookie Policy</Link>.</p>
          </section>

          <section id="rights" style={{ marginTop: 36 }}>
            <h2>5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul style={{ fontSize: 13, color: '#5f655f', lineHeight: 2 }}>
              <li><strong>Access</strong> — request a copy of the data we hold about you</li>
              <li><strong>Correction</strong> — ask us to update inaccurate information</li>
              <li><strong>Deletion</strong> — request we delete your personal data</li>
              <li><strong>Opt-out</strong> — unsubscribe from marketing emails at any time</li>
              <li><strong>Portability</strong> — receive your data in a portable format</li>
            </ul>
            <p>To exercise any of these rights, email us at <a href="mailto:hello@example.com" style={{ color: '#c6a66c' }}>hello@example.com</a>.</p>
          </section>

          <section id="security" style={{ marginTop: 36 }}>
            <h2>6. Data Security</h2>
            <p>We use HTTPS encryption on all pages. Passwords are hashed and never stored in plain text. Payment data is handled by Stripe, which is PCI DSS Level 1 certified. We review our security practices regularly.</p>
          </section>

          <section id="retention" style={{ marginTop: 36 }}>
            <h2>7. Data Retention</h2>
            <ul style={{ fontSize: 13, color: '#5f655f', lineHeight: 2 }}>
              <li>Order records — kept for 7 years (legal requirement)</li>
              <li>Account data — kept until you request deletion</li>
              <li>Newsletter subscriptions — until you unsubscribe</li>
              <li>Analytics data — aggregated and anonymised after 12 months</li>
            </ul>
          </section>

          <section id="children" style={{ marginTop: 36 }}>
            <h2>8. Children&apos;s Privacy</h2>
            <p>Our website is not directed at children under 16. We do not knowingly collect personal information from children. If you believe we have done so, please contact us immediately.</p>
          </section>

          <section id="contact" style={{ marginTop: 36 }}>
            <h2>9. Contact Us</h2>
            <p>For any privacy-related questions or requests:</p>
            <p style={{ fontSize: 13, color: '#5f655f', lineHeight: 2 }}>
              Email: <a href="mailto:hello@example.com" style={{ color: '#c6a66c' }}>hello@example.com</a><br />
              Or use our <Link href="/contact" style={{ color: '#c6a66c' }}>contact form</Link>.
            </p>
            <p>We will respond within 5 business days.</p>
          </section>

          {/* Related links */}
          <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #e2dfd7', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link href="/cookies" style={{ fontSize: 12, padding: '8px 14px', border: '1px solid #e2dfd7', color: '#191c1b' }}>Cookie Policy →</Link>
            <Link href="/returns" style={{ fontSize: 12, padding: '8px 14px', border: '1px solid #e2dfd7', color: '#191c1b' }}>Return Policy →</Link>
            <Link href="/contact" style={{ fontSize: 12, padding: '8px 14px', border: '1px solid #e2dfd7', color: '#191c1b' }}>Contact Us →</Link>
          </div>
        </article>
      </div>
    </>
  )
}
