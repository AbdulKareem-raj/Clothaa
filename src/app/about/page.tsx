import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Story | Northline',
  description: 'Northline was built for people who wear their jackets, not just own them. Learn about our brand, values and approach.',
}

const VALUES = [
  {
    icon: '✦',
    title: 'Considered Design',
    body: 'Every jacket starts with a question: will you still love this in five years? We design for longevity, not trend cycles.',
  },
  {
    icon: '◎',
    title: 'Honest Materials',
    body: 'We list exactly what goes into every jacket — fabric, lining, hardware. No vague descriptions, no surprises.',
  },
  {
    icon: '↗',
    title: 'Real Support',
    body: 'Questions before you buy, help if something goes wrong. We pick up the phone and reply to emails — same day.',
  },
]

const TEAM = [
  {
    name: 'Sarah K.',
    role: 'Founder & Creative Director',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=85',
  },
  {
    name: 'Marcus T.',
    role: 'Head of Product',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=85',
  },
  {
    name: 'Aisha R.',
    role: 'Customer Experience',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=85',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="page-hero" style={{ padding: '80px 20px' }}>
        <p className="eyebrow">OUR STORY</p>
        <h1 style={{ maxWidth: 600, margin: '10px auto 16px' }}>
          Built for people who actually wear their jackets.
        </h1>
        <p style={{ maxWidth: 480, margin: '0 auto', color: '#ddd', lineHeight: 1.7 }}>
          Northline started with one idea: that a great jacket should feel like a second skin — not a purchase you second-guess.
        </p>
      </section>

      {/* Story section */}
      <section className="wrap section" style={{ maxWidth: 860 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div style={{ position: 'relative', aspectRatio: '4/5', borderRadius: 2, overflow: 'hidden', background: '#eee' }}>
            <Image
              src="https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=85"
              alt="Northline jacket"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div>
            <p className="eyebrow dark">HOW IT STARTED</p>
            <h2 style={{ fontFamily: 'Georgia', fontWeight: 'normal', fontSize: 34, margin: '10px 0 20px', lineHeight: 1.2 }}>
              A frustration became a brand.
            </h2>
            <p style={{ color: '#5f655f', fontSize: 14, lineHeight: 1.9, marginBottom: 16 }}>
              Our founder spent years returning jackets that looked great online but felt cheap in person. Too stiff. Wrong weight. Buttons that fell off after two wears. She decided to fix it.
            </p>
            <p style={{ color: '#5f655f', fontSize: 14, lineHeight: 1.9 }}>
              Northline launched with eight jackets — each one worn, washed and worn again before it made the cut. That standard hasn't changed.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ background: '#efede6', padding: '60px 0' }}>
        <div className="wrap">
          <p className="eyebrow dark" style={{ textAlign: 'center' }}>WHAT WE STAND FOR</p>
          <h2 style={{ fontFamily: 'Georgia', fontWeight: 'normal', fontSize: 38, textAlign: 'center', margin: '10px 0 40px' }}>
            Our values
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {VALUES.map((v) => (
              <div key={v.title} style={{ background: 'white', padding: 28 }}>
                <span style={{ fontSize: 22, color: '#c6a66c' }}>{v.icon}</span>
                <h3 style={{ fontFamily: 'Georgia', fontWeight: 'normal', fontSize: 20, margin: '12px 0 10px' }}>
                  {v.title}
                </h3>
                <p style={{ fontSize: 13, color: '#5f655f', lineHeight: 1.8, margin: 0 }}>
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="wrap section">
        <p className="eyebrow dark" style={{ textAlign: 'center' }}>THE PEOPLE BEHIND IT</p>
        <h2 style={{ fontFamily: 'Georgia', fontWeight: 'normal', fontSize: 38, textAlign: 'center', margin: '10px 0 40px' }}>
          Meet the team
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
          {TEAM.map((member) => (
            <div key={member.name} style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', width: 120, height: 120, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 16px', background: '#eee' }}>
                <Image src={member.image} alt={member.name} fill style={{ objectFit: 'cover' }} />
              </div>
              <h3 style={{ fontFamily: 'Georgia', fontWeight: 'normal', fontSize: 18, margin: '0 0 4px' }}>
                {member.name}
              </h3>
              <p style={{ fontSize: 11, color: '#98743d', letterSpacing: '.08em', textTransform: 'uppercase', margin: 0 }}>
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="story">
        <p className="eyebrow">WEAR WHAT MOVES YOU</p>
        <h2>
          Ready to find<br />
          <em>your jacket?</em>
        </h2>
        <p>Eight styles. One standard. Your layer.</p>
        <Link className="button gold" href="/shop">Shop the collection ↗</Link>
      </section>
    </>
  )
}
