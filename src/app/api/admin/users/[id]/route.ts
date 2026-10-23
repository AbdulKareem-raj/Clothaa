import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminGuard'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({
  isActive: z.boolean().optional(),
  role: z.enum(['USER', 'ADMIN']).optional(),
})

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { session, deny } = await requireAdmin()
  if (deny) return deny

  const parsed = schema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  // Prevent an admin from locking/demoting their own account.
  if (params.id === session.user.id) {
    return NextResponse.json({ error: 'You cannot modify your own account here.' }, { status: 400 })
  }

  const user = await prisma.user.update({
    where: { id: params.id },
    data: parsed.data,
    select: { id: true, isActive: true, role: true },
  })
  return NextResponse.json(user)
}
