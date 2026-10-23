import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminGuard'
import { slugify } from '@/lib/slug'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({
  name: z.string().min(2),
  sku: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().min(1),
  price: z.number().nonnegative(),
  comparePrice: z.number().nonnegative().optional().nullable(),
  category: z.string().min(1),
  badge: z.string().optional().nullable(),
  sizes: z.array(z.string()).default([]),
  stock: z.number().int().nonnegative().default(0),
  images: z.array(z.string()).default([]),
  videos: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  metaTitle: z.string().optional().nullable(),
  metaDesc: z.string().optional().nullable(),
})

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { deny } = await requireAdmin()
  if (deny) return deny

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true },
  })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { deny } = await requireAdmin()
  if (deny) return deny

  const parsed = schema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }
  const d = parsed.data

  const category = await prisma.category.upsert({
    where: { name: d.category },
    update: {},
    create: { name: d.category, slug: slugify(d.category) },
  })

  try {
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: d.name,
        sku: d.sku,
        slug: d.slug ? slugify(d.slug) : slugify(d.name),
        description: d.description,
        priceCents: Math.round(d.price * 100),
        comparePriceCents: d.comparePrice ? Math.round(d.comparePrice * 100) : null,
        badge: d.badge || null,
        sizes: d.sizes,
        stock: d.stock,
        images: d.images,
        videos: d.videos,
        isActive: d.isActive,
        isFeatured: d.isFeatured,
        metaTitle: d.metaTitle || null,
        metaDesc: d.metaDesc || null,
        categoryId: category.id,
      },
    })
    return NextResponse.json(product)
  } catch {
    return NextResponse.json({ error: 'Could not update product' }, { status: 400 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { deny } = await requireAdmin()
  if (deny) return deny

  try {
    await prisma.product.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Cannot delete — product may be linked to existing orders. Deactivate it instead.' },
      { status: 400 }
    )
  }
}
