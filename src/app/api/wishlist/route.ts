import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const items = await prisma.wishlist.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(items)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const parsed = z.object({ productId: z.string().min(1) }).safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  try {
    await prisma.wishlist.upsert({
      where: { userId_productId: { userId: session.user.id, productId: parsed.data.productId } },
      update: {},
      create: { userId: session.user.id, productId: parsed.data.productId },
    })
  } catch {
    return NextResponse.json({ error: 'Product not found' }, { status: 400 })
  }
  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const productId = new URL(request.url).searchParams.get('productId')
  if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 })

  await prisma.wishlist.deleteMany({ where: { userId: session.user.id, productId } })
  return NextResponse.json({ success: true })
}
