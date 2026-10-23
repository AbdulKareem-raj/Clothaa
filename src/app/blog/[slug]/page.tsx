import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { BLOG_POSTS, getBlogPost } from '@/data/blogPosts'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogPost(params.slug)
  if (!post) return {}
  return {
    title: `${post.title} | Northline Journal`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
      type: 'article',
      publishedTime: post.publishedAt,
    },
  }
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPost(params.slug)
  if (!post) notFound()

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt,
    author: { '@type': 'Organization', name: 'Northline' },
    publisher: { '@type': 'Organization', name: 'Northline' },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section style={{ position: 'relative', height: 440, overflow: 'hidden', background: '#111' }}>
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          style={{ objectFit: 'cover', opacity: 0.65 }}
          priority
        />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: '40px 5%',
          background: 'linear-gradient(to top, rgba(0,0,0,.7) 0%, transparent 60%)',
        }}>
          <p style={{ color: '#c6a66c', fontSize: 10, fontWeight: 'bold', letterSpacing: '.12em', margin: '0 0 12px' }}>
            {post.category.toUpperCase()} · {post.readTime} MIN READ
          </p>
          <h1 style={{ color: 'white', fontFamily: 'Georgia', fontWeight: 'normal', fontSize: 'clamp(24px,4vw,42px)', lineHeight: 1.2, maxWidth: 700, margin: '0 0 16px' }}>
            {post.title}
          </h1>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 13, margin: 0 }}>
            {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Article body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr min(680px,100%) 1fr', padding: '60px 20px 80px' }}>
        <article
          style={{ gridColumn: 2, fontFamily: 'Georgia, serif', fontSize: 17, lineHeight: 1.85, color: '#2a2e2a' }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {/* Tags */}
      <div className="wrap" style={{ paddingBottom: 40, borderBottom: '1px solid #e2dfd7' }}>
        <p style={{ fontSize: 10, fontWeight: 'bold', letterSpacing: '.1em', color: '#737873', marginBottom: 10 }}>TAGS</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {post.tags.map((tag) => (
            <span key={tag} style={{ fontSize: 11, padding: '5px 12px', border: '1px solid #e2dfd7', color: '#5f655f', letterSpacing: '.04em' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="wrap section">
          <p className="eyebrow dark">MORE FROM THE JOURNAL</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 32, marginTop: 24 }}>
            {related.map((p) => (
              <article key={p.slug}>
                <Link href={`/blog/${p.slug}`} style={{ display: 'block', position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: '#eee', marginBottom: 16 }}>
                  <Image src={p.coverImage} alt={p.title} fill style={{ objectFit: 'cover' }} />
                </Link>
                <p style={{ fontSize: 9, color: '#98743d', letterSpacing: '.12em', fontWeight: 'bold', marginBottom: 8 }}>
                  {p.category.toUpperCase()} · {p.readTime} MIN READ
                </p>
                <h3 style={{ fontFamily: 'Georgia', fontWeight: 'normal', fontSize: 20, margin: '0 0 10px', lineHeight: 1.3 }}>
                  <Link href={`/blog/${p.slug}`} style={{ color: '#191c1b' }}>{p.title}</Link>
                </h3>
                <Link href={`/blog/${p.slug}`} style={{ fontSize: 11, fontWeight: 'bold', color: '#191c1b', letterSpacing: '.06em', borderBottom: '1px solid #191c1b', paddingBottom: 1 }}>
                  READ ↗
                </Link>
              </article>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link href="/blog" className="button dark">View all articles →</Link>
          </div>
        </section>
      )}
    </>
  )
}
