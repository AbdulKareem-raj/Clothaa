import { NextResponse } from 'next/server'
import { sendContactConfirmation } from '@/lib/email'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const { name, email, message } = await request.json()

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }

  if (!email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  // Persist to DB (best-effort — storefront still works if DB isn't configured).
  try {
    await prisma.contactMessage.create({ data: { name, email, message } })
  } catch (err) {
    console.error('[Contact] DB save skipped:', err)
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // 1. Admin ko notification bhejo
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: `New Contact Message from ${name}`,
      html: `
        <h3>New message from website</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    })

    // 2. Customer ko confirmation bhejo
    await sendContactConfirmation(email, name)
  } catch (err) {
    console.error('[Contact] Email send failed:', err)
  }

  return NextResponse.json({ success: true, message: 'Message received' })
}
