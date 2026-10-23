import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminGuard'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  const { deny } = await requireAdmin()
  if (deny) return deny
  const msg = await prisma.contactMessage.update({
    where: { id: params.id },
    data: { isRead: true },
  })
  return NextResponse.json(msg)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { deny } = await requireAdmin()
  if (deny) return deny
  await prisma.contactMessage.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
