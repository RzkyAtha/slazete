# Email-based order submission — design

## Goal

Replace the DM-based order flow (Instagram/TikTok copy-and-paste) with direct email
delivery: orders are sent from `slazete.orders@gmail.com` to `slazete@gmail.com`
through a Vercel serverless function, with credentials in Vercel env vars.

## Decisions (confirmed with user)

- Send flow: **email only** — the DM picker popup is removed entirely.
- New required fields: **client email** and **client social media** (both wajib).
- Social media field format: **platform dropdown + username input**.
- Platform options: Instagram, X, TikTok, Discord, WhatsApp.

## Architecture

```
OrderForm.tsx ──POST /api/send-order──> api/send-order.ts ──SMTP──> slazete@gmail.com
                {order details}        (nodemailer + Gmail)
```

- The site stays a Vite SPA; Vercel serves `api/*.ts` as serverless functions.
- The SPA rewrite in `vercel.json` does not conflict — Vercel matches `api/`
  functions before applying rewrites.
- `api/` is outside tsconfig's `include`, so `tsc -b` is unaffected.

## Serverless function: `api/send-order.ts`

- `POST` only; rejects other methods with 405.
- Validates payload server-side: `name`, `email` (format), `social.platform`
  (whitelist), `social.username`, `brief`, plus pass-through order detail fields
  (`currency`, `typeLabel`, `base`, `characters`, `extraChars`, `addons`,
  `commercial`, `rush`, `estimateText`).
- Honeypot field `website`: if filled, returns `{ ok: true }` without sending
  (silent drop for bots).
- Builds plain-text + HTML email bodies containing the full order summary.
- Sends via nodemailer Gmail SMTP:
  - `from`: `GMAIL_USER` (slazete.orders@gmail.com)
  - `to`: `ORDER_TO_EMAIL` (slazete@gmail.com)
  - `replyTo`: client email — artist replies go straight to the client.
  - `subject`: `New commission order — <name>`
- Returns `{ ok: true }` on success; `{ error: 'invalid' | 'send_failed' }`
  with appropriate status codes on failure.
- Fails fast with 500 if env vars are missing.

## Env vars (Vercel project settings, server-side only — no VITE_ prefix)

| Var | Value |
|---|---|
| `GMAIL_USER` | `slazete.orders@gmail.com` |
| `GMAIL_APP_PASSWORD` | 16-char Gmail App Password |
| `ORDER_TO_EMAIL` | `slazete@gmail.com` |

`.env.example` documents these for local dev (`vercel dev`).

## Form changes (`src/components/OrderForm.tsx`)

- New state: `email`, `socialPlatform`, `socialUsername`, `sendState`
  (`idle | sending | sent | error`).
- New fields rendered between name and brief:
  - `Email` — `type="email"` input, required.
  - `Social media` — `<select>` for platform + text input for `@username`, required.
- `ready` now requires name + valid email + platform + username + brief.
- The order message gains `Email:` and `Social:` lines (also sent to the API).
- DM picker popup, `sendVia`, clipboard code, and `copied`/`dmOpen` state removed.
- Send button becomes a real submit: POSTs JSON to `/api/send-order`;
  shows spinner/"sending", success confirmation, or error message with retry.

## i18n (`src/data/i18n.ts`)

- Remove: `dmTitle`, `dmSub`, `copied`, `copyOpen`, `chooseSend`.
- Add: `email`, `emailPh`, `social`, `socialPlatform` options label,
  `socialPh`, `sending`, `sentTitle`, `sentSub`, `sendError`, `tryAgain`.
- Update `sections.orderSub` (no longer mentions Instagram/TikTok).
- `msg` gains `email` and `social` labels.

## Deps

- `nodemailer` (runtime)
- `@types/nodemailer`, `@vercel/node` (dev)

## Manual setup (user, after deploy)

1. Google account `slazete.orders@gmail.com`: enable 2FA, create App Password.
2. Vercel → project → Environment Variables: set the three vars above.
3. Local testing uses `vercel dev` (plain `vite dev` won't run `api/`).

## Out of scope

- File/image attachments, rate limiting beyond honeypot, storing orders in a DB.
