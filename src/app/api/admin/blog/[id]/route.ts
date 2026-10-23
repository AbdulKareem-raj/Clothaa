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
  category: z.string().min(1),
  readTime: z.number().int().positive(),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean(),
  metaTitle: z.string().optional().nullable(),
  metaDesc: z.string().optional().nullable(),
})

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { deny } = await requireAdmin()
  if (deny) return deny
  const parsed = schema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })
  const d = parsed.data

  const existing = await prisma.blogPost.findUnique({ where: { id: params.id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const post = await prisma.blogPost.update({
    where: { id: params.id },
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
      // Set publishedAt the first time it goes live.
      publishedAt: d.isPublished ? existing.publishedAt ?? new Date() : existing.publishedAt,
      metaTitle: d.metaTitle || null,
      metaDesc: d.metaDesc || null,
    },
  })
  return NextResponse.json(post)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { deny } = await requireAdmin()
  if (deny) return deny
  await prisma.blogPost.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
