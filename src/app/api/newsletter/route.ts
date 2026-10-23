import { NextResponse } from 'next/server'
import { sendNewsletterWelcome } from '@/lib/email'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const { email } = await request.json()

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  // Persist subscriber (best-effort; ignore duplicates and missing DB).
  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { isActive: true },
      create: { email, source: 'website' },
    })
  } catch (err) {
    console.error('[Newsletter] DB save skipped:', err)
  }

  try {
    await sendNewsletterWelcome(email)
  } catch (err) {
    console.error('[Newsletter] Email send failed:', err)
    // Email fail ho toh bhi subscriber ko success dikhao
  }

  return NextResponse.json({ success: true, message: 'Subscribed successfully' })
}
