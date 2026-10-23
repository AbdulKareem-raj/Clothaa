import Link from 'next/link'
import Image from 'next/image'
import { BLOG_POSTS } from '@/data/blogPosts'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Journal | Northline',
  description: 'Style guides, jacket care tips and the stories behind the brand.',
}

const CATEGORIES = ['All', ...Array.from(new Set(BLOG_POSTS.map((p) => p.category)))]

export default function BlogPage() {
  const [featured, ...rest] = BLOG_POSTS

  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">THE NORTHLINE JOURNAL</p>
        <h1>Stories & Style</h1>
        <p>Guides, care tips and the culture of jackets.</p>
      </section>

      <main className="wrap section">

        {/* Featured post */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 60, alignItems: 'center' }}>
          <Link href={`/blog/${featured.slug}`} style={{ display: 'block', position: 'relative', aspectRatio: '16/10', overflow: 'hidden', background: '#eee' }}>
            <Image
              src={featured.coverImage}
              alt={featured.title}
              fill
              style={{ objectFit: 'cover', transition: '.3s' }}
              priority
            />
            <span style={{ position: 'absolute', top: 14, left: 14, background: '#c6a66c', color: '#111', fontSize: 9, fontWeight: 'bold', letterSpacing: '.1em', padding: '5px 10px' }}>
              FEATURED
            </span>
          </Link>
          <div>
            <p style={{ fontSize: 10, color: '#98743d', letterSpacing: '.1em', fontWeight: 'bold', marginBottom: 8 }}>
              {featured.category.toUpperCase()} · {featured.readTime} MIN READ
            </p>
            <h2 style={{ fontFamily: 'Georgia', fontWeight: 'normal', fontSize: 30, lineHeight: 1.2, margin: '0 0 16px' }}>
              <Link href={`/blog/${featured.slug}`} style={{ color: '#191c1b' }}>{featured.title}</Link>
            </h2>
            <p style={{ fontSize: 13, color: '#5f655f', lineHeight: 1.9, marginBottom: 20 }}>
              {featured.excerpt}
            </p>
            <Link href={`/blog/${featured.slug}`} style={{ fontSize: 11, fontWeight: 'bold', color: '#191c1b', letterSpacing: '.08em', borderBottom: '1px solid #191c1b', paddingBottom: 2 }}>
              READ ARTICLE ↗
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #e2dfd7', marginBottom: 48 }} />

        {/* Rest of posts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32 }}>
          {rest.map((post) => (
            <article key={post.slug}>
              <Link href={`/blog/${post.slug}`} style={{ display: 'block', position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: '#eee', marginBottom: 16 }}>
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  style={{ objectFit: 'cover', transition: '.3s' }}
                />
              </Link>
              <p style={{ fontSize: 9, color: '#98743d', letterSpacing: '.12em', fontWeight: 'bold', marginBottom: 8 }}>
                {post.category.toUpperCase()} · {post.readTime} MIN READ
              </p>
              <h3 style={{ fontFamily: 'Georgia', fontWeight: 'normal', fontSize: 20, lineHeight: 1.3, margin: '0 0 10px' }}>
                <Link href={`/blog/${post.slug}`} style={{ color: '#191c1b' }}>{post.title}</Link>
              </h3>
              <p style={{ fontSize: 12, color: '#5f655f', lineHeight: 1.8, marginBottom: 12 }}>
                {post.excerpt.slice(0, 100)}…
              </p>
              <Link href={`/blog/${post.slug}`} style={{ fontSize: 11, fontWeight: 'bold', color: '#191c1b', letterSpacing: '.06em', borderBottom: '1px solid #191c1b', paddingBottom: 1 }}>
                READ MORE ↗
              </Link>
            </article>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div style={{ marginTop: 64, background: '#efede6', padding: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <p className="eyebrow dark">NEVER MISS A POST</p>
            <h3 style={{ fontFamily: 'Georgia', fontWeight: 'normal', fontSize: 26, margin: '6px 0 8px' }}>
              Get the journal in your inbox.
            </h3>
            <p style={{ fontSize: 13, color: '#737873', margin: 0 }}>
              New articles, style guides and early access to new arrivals.
            </p>
          </div>
          <Link href="/#newsletter" className="button dark">Subscribe →</Link>
        </div>
      </main>
    </>
  )
}
