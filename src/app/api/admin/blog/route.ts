import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminGuard'
import { slugify } from '@/lib/slug'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({
  title: z.string().min(3),
  slug: z.string().optional(),
  excerpt: z.string().min(3),
  content: z.string().min(3),
  coverImage: z.string().optional().nullable(),
  category: z.string().min(1).default('General'),
  readTime: z.number().int().positive().default(5),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
  metaTitle: z.string().optional().nullable(),
  metaDesc: z.string().optional().nullable(),
})

export async function GET() {
  const { deny } = await requireAdmin()
  if (deny) return deny
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(posts)
}

export async function POST(request: Request) {
  const { deny } = await requireAdmin()
  if (deny) return deny
  const parsed = schema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })
  const d = parsed.data
  try {
    const post = await prisma.blogPost.create({
      data: {
        title: d.title,
        slug: d.slug ? slugify(d.slug) : slugify(d.title),
        excerpt: d.excerpt,
        content: d.content,
        coverImage: d.coverImage || null,
        category: d.category,
        readTime: d.readTime,
        tags: d.tags,
        isPublished: d.isPublished,
        publishedAt: d.isPublished ? new Date() : null,
        metaTitle: d.metaTitle || null,
        metaDesc: d.metaDesc || null,
      },
    })
    return NextResponse.json(post, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
  }
}
