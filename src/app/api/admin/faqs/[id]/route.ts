import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminGuard'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({
  question: z.string().min(3).optional(),
  answer: z.string().min(3).optional(),
  category: z.string().min(1).optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { deny } = await requireAdmin()
  if (deny) return deny
  const parsed = schema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  const faq = await prisma.fAQ.update({ where: { id: params.id }, data: parsed.data })
  return NextResponse.json(faq)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { deny } = await requireAdmin()
  if (deny) return deny
  await prisma.fAQ.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
