import type { VercelRequest, VercelResponse } from '@vercel/node'
import nodemailer from 'nodemailer'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  )

const str = (v: unknown, max: number) =>
  typeof v === 'string' && v.trim().length > 0 && v.length <= max ? v.trim() : null

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed' })
  }

  const { name, email, social, message, website } = req.body ?? {}

  // honeypot - real users never fill this; pretend success so bots move on
  if (typeof website === 'string' && website.length > 0) {
    return res.status(200).json({ ok: true })
  }

  const cleanName = str(name, 120)
  const cleanEmail = str(email, 200)
  const cleanSocial = str(social, 160)
  const cleanMessage = str(message, 10_000)

  if (
    !cleanName ||
    !cleanEmail ||
    !EMAIL_RE.test(cleanEmail) ||
    !cleanSocial ||
    !cleanMessage
  ) {
    return res.status(400).json({ error: 'invalid' })
  }

  const { GMAIL_USER, GMAIL_APP_PASSWORD, ORDER_TO_EMAIL } = process.env
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !ORDER_TO_EMAIL) {
    return res.status(500).json({ error: 'not_configured' })
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
    })

    await transporter.sendMail({
      from: `slazete orders <${GMAIL_USER}>`,
      to: ORDER_TO_EMAIL,
      replyTo: cleanEmail,
      subject: `New commission order — ${cleanName}`,
      text: cleanMessage,
      html: `<div style="font-family:ui-monospace,Menlo,Consolas,monospace;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(cleanMessage)}</div>`,
    })

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('sendMail failed:', err)
    return res.status(502).json({ error: 'send_failed' })
  }
}
