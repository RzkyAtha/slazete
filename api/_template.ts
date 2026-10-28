// shared email template - underscore prefix so Vercel ignores this file as a function
export const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  )

export function mailHtml(body: string): string {
  const year = new Date().getFullYear()
  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#f4f4f5">
  <div style="padding:28px 12px;font-family:'Poppins','Segoe UI',Arial,sans-serif">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e4e4e7;border-radius:14px;overflow:hidden">

      <!-- header: logo + wordmark, like the navbar -->
      <div style="padding:18px 26px;border-bottom:1px solid #f0f0f0">
        <img src="https://slazete.com/slazete_logo_nobg.webp" alt="slazete" height="30" style="height:30px;vertical-align:middle;margin-right:10px" />
        <span style="font-family:'Poppins','Segoe UI',Arial,sans-serif;font-size:24px;font-weight:800;letter-spacing:-0.5px;color:#0a0a0a;vertical-align:middle">slazete</span>
      </div>

      <!-- body -->
      <div style="padding:26px;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13.5px;line-height:1.7;color:#1a1a1a;white-space:pre-wrap">${escapeHtml(body)}</div>

      <!-- footer: dark, like the site footer -->
      <div style="background:#161616;padding:20px 26px">
        <p style="margin:0;font-size:11px;line-height:1.5;color:rgba(255,255,255,0.45)">Pesan ini dikirim otomatis oleh website - mohon tidak dibalas.<br />This is an automated message - please do not reply.</p>
        <p style="margin:14px 0 0;font-size:11px;font-weight:600;color:rgba(255,255,255,0.7)">&copy; ${year} slazete. All Rights Reserved.</p>
        <p style="margin:6px 0 0;font-size:11px;color:rgba(255,255,255,0.35)">Powered by <img src="https://slazete.com/logo_kinarya.webp" alt="" width="12" height="12" style="width:12px;height:12px;vertical-align:-2px;margin:0 2px" /> Kinaryaloka</p>
      </div>

    </div>
  </div>
</body>
</html>`
}
