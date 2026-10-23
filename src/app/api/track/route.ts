import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({
  event: z.string().min(1).max(60),
  data: z.record(z.unknown()).optional(),
  sessionId: z.string().max(80).optional(),
})

// POST /api/track — self-hosted activity log (guests + logged-in users).
export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return new NextResponse(null, { status: 204 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) return new NextResponse(null, { status: 204 })

  const { event, data, sessionId } = parsed.data

  const session = await auth().catch(() => null)
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    null
  const userAgent = request.headers.get('user-agent') || null

  try {
    await prisma.userActivity.create({
      data: {
        event,
        data: (data ?? {}) as object,
        userId: session?.user?.id ?? null,
        sessionId: sessionId ?? null,
        ip,
        userAgent,
      },
    })
  } catch {
    // No DB yet — tracking is a safe no-op.
  }

  return new NextResponse(null, { status: 204 })
}
