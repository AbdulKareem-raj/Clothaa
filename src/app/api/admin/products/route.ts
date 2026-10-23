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

export async function GET() {
  const { deny } = await requireAdmin()
  if (deny) return deny

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  })
  return NextResponse.json(products)
}

export async function POST(request: Request) {
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
    const product = await prisma.product.create({
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
    return NextResponse.json(product, { status: 201 })
  } catch (err) {
    const message =
      err && typeof err === 'object' && 'code' in err && err.code === 'P2002'
        ? 'SKU or slug already exists'
        : 'Could not create product'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
