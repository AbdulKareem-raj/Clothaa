import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminGuard'
import { slugify } from '@/lib/slug'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
})

export async function GET() {
  const { deny } = await requireAdmin()
  if (deny) return deny
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { products: true } } },
  })
  return NextResponse.json(categories)
}

export async function POST(request: Request) {
  const { deny } = await requireAdmin()
  if (deny) return deny
  const parsed = schema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })
  const d = parsed.data
  try {
    const category = await prisma.category.create({
      data: {
        name: d.name,
        slug: slugify(d.name),
        description: d.description || null,
        imageUrl: d.imageUrl || null,
        sortOrder: d.sortOrder,
        isActive: d.isActive,
      },
    })
    return NextResponse.json(category, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Category name or slug already exists' }, { status: 400 })
  }
}
