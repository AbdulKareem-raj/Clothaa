import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminGuard'
import { slugify } from '@/lib/slug'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { deny } = await requireAdmin()
  if (deny) return deny
  const parsed = schema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  const d = parsed.data

  try {
    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        ...(d.name && { name: d.name, slug: slugify(d.name) }),
        ...(d.description !== undefined && { description: d.description || null }),
        ...(d.imageUrl !== undefined && { imageUrl: d.imageUrl || null }),
        ...(d.sortOrder !== undefined && { sortOrder: d.sortOrder }),
        ...(d.isActive !== undefined && { isActive: d.isActive }),
      },
    })
    return NextResponse.json(category)
  } catch {
    return NextResponse.json({ error: 'Could not update category' }, { status: 400 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { deny } = await requireAdmin()
  if (deny) return deny

  const count = await prisma.product.count({ where: { categoryId: params.id } })
  if (count > 0) {
    return NextResponse.json(
      { error: `Cannot delete — ${count} product(s) use this category. Reassign them first.` },
      { status: 400 }
    )
  }

  await prisma.category.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
