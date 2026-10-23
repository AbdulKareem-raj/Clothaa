import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookie Policy | Northline',
  description: 'How Northline uses cookies and how you can control them.',
}

const LAST_UPDATED = 'October 22, 2026'

const COOKIE_TYPES = [
  {
    type: 'Essential',
    canDisable: false,
    color: '#191c1b',
    description: 'These cookies are required for the website to work. They cannot be disabled.',
    examples: [
      { name: 'northline-cart',    purpose: 'Stores your shopping cart contents',    duration: 'Session' },
      { name: 'next-auth.session', purpose: 'Keeps you logged in',                  duration: '30 days' },
      { name: '__csrf',            purpose: 'Prevents cross-site request forgery',   duration: 'Session' },
    ],
  },
  {
    type: 'Analytics',
    canDisable: true,
    color: '#c6a66c',
    description: 'Help us understand how visitors use the site so we can improve it.',
    examples: [
      { name: 'mp_*',    purpose: 'Mixpanel — anonymous usage analytics', duration: '1 year'  },
      { name: '_ga',     purpose: 'Google Analytics — page views',         duration: '2 years' },
      { name: '_ga_*',   purpose: 'Google Analytics — session data',       duration: '2 years' },
    ],
  },
  {
    type: 'Preferences',
    canDisable: true,
    color: '#737873',
    description: 'Remember your settings to give you a better experience.',
    examples: [
      { name: 'nl-currency', purpose: 'Remembers your selected currency',     duration: '1 year'  },
      { name: 'nl-theme',    purpose: 'Remembers dark/light mode preference', duration: '1 year'  },
    ],
  },
]

export default function CookiesPage() {
  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">LEGAL</p>
        <h1>Cookie Policy</h1>
        <p>Last updated: {LAST_UPDATED}</p>
      </section>

      <main className="wrap prose" style={{ paddingTop: 60, paddingBottom: 80 }}>

        <p style={{ fontSize: 14, color: '#5f655f', lineHeight: 1.9, padding: '16px 20px', background: '#efede6', borderLeft: '3px solid #c6a66c', marginBottom: 36 }}>
          This Cookie Policy explains what cookies are, which ones we use on northline.com, and how you can control them.
        </p>

        <h2>What are cookies?</h2>
        <p>Cookies are small text files saved to your device when you visit a website. They help sites remember information about your visit — like what&apos;s in your cart — so you don&apos;t have to re-enter it each time.</p>

        <h2>Cookies we use</h2>

        {COOKIE_TYPES.map((group) => (
          <div key={group.type} style={{ marginBottom: 32, border: '1px solid #e2dfd7', borderRadius: 2, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ background: group.color, padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: 'white', margin: 0, fontSize: 15, fontFamily: 'Arial' }}>
                {group.type} Cookies
              </h3>
              <span style={{
                fontSize: 10, letterSpacing: '.08em', fontWeight: 'bold',
                background: group.canDisable ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.15)',
                color: 'white', padding: '4px 10px',
              }}>
                {group.canDisable ? 'CAN BE DISABLED' : 'ALWAYS ON'}
              </span>
            </div>

            {/* Description */}
            <div style={{ padding: '14px 20px', background: '#faf9f6', borderBottom: '1px solid #e2dfd7' }}>
              <p style={{ fontSize: 13, color: '#5f655f', margin: 0 }}>{group.description}</p>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#efede6' }}>
                    <th style={{ padding: '10px 20px', textAlign: 'left', fontWeight: 'bold', fontSize: 10, letterSpacing: '.08em', color: '#737873' }}>COOKIE NAME</th>
                    <th style={{ padding: '10px 20px', textAlign: 'left', fontWeight: 'bold', fontSize: 10, letterSpacing: '.08em', color: '#737873' }}>PURPOSE</th>
                    <th style={{ padding: '10px 20px', textAlign: 'left', fontWeight: 'bold', fontSize: 10, letterSpacing: '.08em', color: '#737873' }}>DURATION</th>
                  </tr>
                </thead>
                <tbody>
                  {group.examples.map((ex, i) => (
                    <tr key={ex.name} style={{ background: i % 2 === 0 ? 'white' : '#faf9f6' }}>
                      <td style={{ padding: '10px 20px', fontFamily: 'monospace', color: '#191c1b' }}>{ex.name}</td>
                      <td style={{ padding: '10px 20px', color: '#5f655f' }}>{ex.purpose}</td>
                      <td style={{ padding: '10px 20px', color: '#5f655f' }}>{ex.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        <h2>How to control cookies</h2>
        <p>You can control and delete cookies through your browser settings. Please note that disabling analytics or preference cookies will not affect your ability to shop, but may affect your experience.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, margin: '16px 0 32px' }}>
          {[
            { browser: 'Chrome',  url: 'https://support.google.com/chrome/answer/95647' },
            { browser: 'Firefox', url: 'https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer' },
            { browser: 'Safari',  url: 'https://support.apple.com/guide/safari/manage-cookies-sfri11471' },
            { browser: 'Edge',    url: 'https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge' },
          ].map((b) => (
            <a key={b.browser} href={b.url} target="_blank" rel="noopener noreferrer"
               style={{ padding: '12px 16px', border: '1px solid #e2dfd7', fontSize: 12, color: '#191c1b', display: 'flex', justifyContent: 'space-between' }}>
              {b.browser} settings <span>↗</span>
            </a>
          ))}
        </div>

        <h2>Third-party cookies</h2>
        <p>Some cookies are set by third-party services we use. These services have their own privacy and cookie policies:</p>
        <ul style={{ fontSize: 13, color: '#5f655f', lineHeight: 2 }}>
          <li>Mixpanel — <a href="https://mixpanel.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#c6a66c' }}>mixpanel.com/privacy</a></li>
          <li>Stripe — <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#c6a66c' }}>stripe.com/privacy</a></li>
          <li>Google Analytics — <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#c6a66c' }}>policies.google.com/privacy</a></li>
        </ul>

        <h2>Changes to this policy</h2>
        <p>We may update this Cookie Policy from time to time. The &quot;last updated&quot; date at the top of this page will reflect any changes.</p>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #e2dfd7', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link href="/privacy" style={{ fontSize: 12, padding: '8px 14px', border: '1px solid #e2dfd7', color: '#191c1b' }}>Privacy Policy →</Link>
          <Link href="/returns"  style={{ fontSize: 12, padding: '8px 14px', border: '1px solid #e2dfd7', color: '#191c1b' }}>Return Policy →</Link>
        </div>
      </main>
    </>
  )
}
