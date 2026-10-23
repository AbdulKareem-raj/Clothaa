import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminGuard'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({
  code: z.string().min(2),
  type: z.enum(['PERCENT', 'FIXED']),
  value: z.number().int().positive(),
  minOrderCents: z.number().int().nonnegative().optional().nullable(),
  maxUses: z.number().int().positive().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
})

export async function GET() {
  const { deny } = await requireAdmin()
  if (deny) return deny
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(coupons)
}

export async function POST(request: Request) {
  const { deny } = await requireAdmin()
  if (deny) return deny
  const parsed = schema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })
  const d = parsed.data
  try {
    const coupon = await prisma.coupon.create({
      data: {
        code: d.code.toUpperCase(),
        type: d.type,
        value: d.value,
        minOrderCents: d.minOrderCents ?? null,
        maxUses: d.maxUses ?? null,
        expiresAt: d.expiresAt ? new Date(d.expiresAt) : null,
        isActive: d.isActive,
      },
    })
    return NextResponse.json(coupon, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 })
  }
}
