import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendNewsletterWelcome(toEmail: string) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: toEmail,
    subject: 'Welcome to Northline ✦',
    html: `
      <div style="max-width:600px;margin:30px auto;font-family:Arial,sans-serif">
        <div style="background:#151817;padding:24px 32px">
          <h1 style="color:#c6a66c;margin:0;font-size:22px;letter-spacing:.1em">NORTHLINE</h1>
        </div>
        <div style="padding:32px">
          <h2 style="margin-top:0">Aap subscribe ho gaye!</h2>
          <p style="color:#555">New arrivals, styling ideas aur special offers milenge aapko.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/shop"
             style="display:inline-block;background:#191c1b;color:white;padding:13px 20px;text-decoration:none;font-size:11px;font-weight:bold;letter-spacing:.1em;margin-top:12px">
            SHOP NOW ↗
          </a>
        </div>
        <div style="background:#151817;padding:14px 32px;text-align:center">
          <p style="color:#aaa;font-size:11px;margin:0">© ${new Date().getFullYear()} Northline</p>
        </div>
      </div>
    `,
  })
}

export async function sendContactConfirmation(toEmail: string, name: string) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: toEmail,
    subject: 'We received your message | Northline',
    html: `
      <div style="max-width:600px;margin:30px auto;font-family:Arial,sans-serif;padding:32px">
        <h2>Salam ${name}!</h2>
        <p style="color:#555">Aapka message receive ho gaya. Hum 24–48 ghante mein jawab denge.</p>
        <p style="color:#999;font-size:12px">— Northline Team</p>
      </div>
    `,
  })
}

export async function sendOrderConfirmation(data: {
  toEmail: string
  toName: string
  orderNumber: string
  total: number
  items?: { name: string; qty: number; size: string; priceCents: number }[]
}) {
  const itemsRows = (data.items ?? [])
    .map(
      (i) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:13px">${i.name} <span style="color:#999">(${i.size} × ${i.qty})</span></td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:13px;text-align:right">$${((i.priceCents * i.qty) / 100).toFixed(2)}</td>
        </tr>`
    )
    .join('')

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: data.toEmail,
    subject: `Order Confirmed — ${data.orderNumber} | Northline`,
    html: `
      <div style="max-width:600px;margin:30px auto;font-family:Arial,sans-serif">
        <div style="background:#151817;padding:24px 32px">
          <h1 style="color:#c6a66c;margin:0;font-size:22px;letter-spacing:.1em">NORTHLINE</h1>
        </div>
        <div style="padding:32px">
          <h2 style="margin-top:0">Order Confirmed ✓</h2>
          <p>Salam ${data.toName}, aapka order receive ho gaya. Shukriya!</p>
          <p style="background:#f7f6f2;padding:12px;font-size:13px">
            Order Number: <strong>${data.orderNumber}</strong>
          </p>
          ${itemsRows ? `<table style="width:100%;border-collapse:collapse;margin:12px 0">${itemsRows}</table>` : ''}
          <p style="font-size:14px;color:#111;text-align:right">
            Total: <strong>$${(data.total / 100).toFixed(2)}</strong>
          </p>
          <p style="font-size:12px;color:#999">
            Koi sawal ho toh: <a href="mailto:${process.env.SMTP_USER}" style="color:#c6a66c">${process.env.SMTP_USER}</a>
          </p>
        </div>
        <div style="background:#151817;padding:14px 32px;text-align:center">
          <p style="color:#aaa;font-size:11px;margin:0">© ${new Date().getFullYear()} Northline</p>
        </div>
      </div>
    `,
  })
}

export async function sendShippingUpdate(data: {
  toEmail: string
  toName: string
  orderNumber: string
  trackingNumber: string
}) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: data.toEmail,
    subject: `Your order ${data.orderNumber} has shipped | Northline`,
    html: `
      <div style="max-width:600px;margin:30px auto;font-family:Arial,sans-serif">
        <div style="background:#151817;padding:24px 32px">
          <h1 style="color:#c6a66c;margin:0;font-size:22px;letter-spacing:.1em">NORTHLINE</h1>
        </div>
        <div style="padding:32px">
          <h2 style="margin-top:0">Your order is on the way 🚚</h2>
          <p>Salam ${data.toName}, aapka order ship ho gaya hai!</p>
          <p style="background:#f7f6f2;padding:12px;font-size:13px">
            Order Number: <strong>${data.orderNumber}</strong><br/>
            Tracking Number: <strong>${data.trackingNumber}</strong>
          </p>
          <p style="font-size:12px;color:#999">Delivery ETA: 3–7 business days.</p>
        </div>
        <div style="background:#151817;padding:14px 32px;text-align:center">
          <p style="color:#aaa;font-size:11px;margin:0">© ${new Date().getFullYear()} Northline</p>
        </div>
      </div>
    `,
  })
}
