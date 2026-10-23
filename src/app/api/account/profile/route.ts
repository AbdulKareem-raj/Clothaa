import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional().nullable(),
})

export async function PATCH(request: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const parsed = schema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name, phone: parsed.data.phone || null },
    select: { id: true, name: true, phone: true, email: true },
  })
  return NextResponse.json(user)
}
