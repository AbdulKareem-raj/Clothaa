import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminGuard'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({ isApproved: z.boolean() })

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { deny } = await requireAdmin()
  if (deny) return deny
  const parsed = schema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  const review = await prisma.review.update({
    where: { id: params.id },
    data: { isApproved: parsed.data.isApproved },
  })
  return NextResponse.json(review)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { deny } = await requireAdmin()
  if (deny) return deny
  await prisma.review.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
