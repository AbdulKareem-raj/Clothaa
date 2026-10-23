import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminGuard'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({
  question: z.string().min(3),
  answer: z.string().min(3),
  category: z.string().min(1).default('General'),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
})

export async function GET() {
  const { deny } = await requireAdmin()
  if (deny) return deny
  const faqs = await prisma.fAQ.findMany({ orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }] })
  return NextResponse.json(faqs)
}

export async function POST(request: Request) {
  const { deny } = await requireAdmin()
  if (deny) return deny
  const parsed = schema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })
  const faq = await prisma.fAQ.create({ data: parsed.data })
  return NextResponse.json(faq, { status: 201 })
}
