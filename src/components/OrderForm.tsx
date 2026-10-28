import { useEffect, useMemo, useState } from 'react'
import { PaperAirplaneIcon, CheckCircleIcon } from '@heroicons/react/24/solid'
import LoadoutPanel from './LoadoutPanel'
import {
  ADDONS,
  COMMISSION_TYPES,
  COMMERCIAL_MULTIPLIER,
  EXTRA_CHARACTER_RATE,
  RUSH_MULTIPLIER,
  addonRange,
  estimateRange,
  formatPrice,
  formatRange,
  type Currency,
} from '../data/commission'
import { ARTIST_NAME } from '../config'
import { useLang } from '../i18n'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const SOCIAL_PLATFORMS = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'x', label: 'X (Twitter)' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'discord', label: 'Discord' },
  { id: 'whatsapp', label: 'WhatsApp' },
] as const

type SocialPlatformId = (typeof SOCIAL_PLATFORMS)[number]['id']
type SendState = 'idle' | 'sending' | 'sent' | 'error'

export default function OrderForm({ dark = false }: { dark?: boolean }) {
  const { t } = useLang()
  const labelCls = `mb-2.5 block text-xs font-semibold  uppercase ${
    dark ? 'text-paper/45' : 'text-ink/45'
  }`
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [socialPlatform, setSocialPlatform] = useState<SocialPlatformId>('instagram')
  const [socialUsername, setSocialUsername] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [currency, setCurrency] = useState<Currency>('IDR')
  const [typeId, setTypeId] = useState(COMMISSION_TYPES[0].id)
  const [extraChars, setExtraChars] = useState(0)
  const [addons, setAddons] = useState<Set<string>>(new Set())
  const [commercial, setCommercial] = useState(false)
  const [rush, setRush] = useState(false)
  const [brief, setBrief] = useState('')
  const [sendState, setSendState] = useState<SendState>('idle')

  const type = COMMISSION_TYPES.find((ty) => ty.id === typeId) ?? COMMISSION_TYPES[0]
  const typeLabel = t.types[type.id]?.label ?? type.label
  const addonLabel = (id: string, fallback: string) => t.addons[id]?.label ?? fallback
  const platformLabel =
    SOCIAL_PLATFORMS.find((p) => p.id === socialPlatform)?.label ?? socialPlatform
  const base = currency === 'IDR' ? type.idr : type.usd

  const toggleAddon = (id: string) =>
    setAddons((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const estimate = useMemo(
    () => estimateRange(base, extraChars, addons, currency, commercial, rush),
    [base, extraChars, addons, currency, commercial, rush],
  )

  const selectedAddons = ADDONS.filter((a) => addons.has(a.id))

  const orderMessage = useMemo(() => {
    const m = t.form.msg
    const lines = [
      m.greeting(ARTIST_NAME),
      '',
      `${m.name}: ${name || '-'}`,
      `${m.email}: ${email || '-'}`,
      `${m.social}: ${platformLabel} · ${socialUsername || '-'}`,
      `${m.currency}: ${currency}`,
      `${m.type}: ${typeLabel} - ${m.base} ${formatPrice(base, currency)}`,
      `${m.characters}: ${1 + extraChars}${extraChars ? m.extraChars(extraChars, EXTRA_CHARACTER_RATE * 100) : ''}`,
      `${m.addons}: ${selectedAddons.length ? selectedAddons.map((a) => `${addonLabel(a.id, a.label)} (${formatRange(addonRange(a, currency), currency)})`).join(', ') : m.none}`,
      `${m.commercial}: ${commercial ? `${m.yes} (x${COMMERCIAL_MULTIPLIER})` : m.no}`,
      `${m.rush}: ${rush ? `${m.yes} (+${(RUSH_MULTIPLIER - 1) * 100}%)` : m.no}`,
      `${m.estimate}: ${formatRange(estimate, currency)} (${m.estimateNote})`,
      '',
      m.briefLabel,
      brief || '-',
    ]
    return lines.join('\n')
  }, [name, email, platformLabel, socialUsername, currency, typeLabel, base, extraChars, selectedAddons, commercial, rush, estimate, brief, t])

  const emailValid = EMAIL_RE.test(email.trim())
  const ready =
    name.trim().length > 0 &&
    emailValid &&
    socialUsername.trim().length > 0 &&
    brief.trim().length > 0

  // editing the order after a successful send re-arms the button
  useEffect(() => {
    if (sendState === 'sent') setSendState('idle')
    // sendState is intentionally only read, not a trigger - orderMessage is the signal
  }, [orderMessage])

  const submit = async () => {
    if (!ready || sendState === 'sending') return
    setSendState('sending')
    try {
      const res = await fetch('/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          social: { platform: socialPlatform, username: socialUsername },
          message: orderMessage,
          website: honeypot,
        }),
      })
      setSendState(res.ok ? 'sent' : 'error')
    } catch {
      setSendState('error')
    }
  }

  return (
    <div className="flex flex-col gap-10">
      {/* ─── inventory loadout: main item + equipment ─── */}
      <LoadoutPanel
        typeId={typeId}
        onTypeChange={setTypeId}
        addons={addons}
        onToggleAddon={toggleAddon}
        extraChars={extraChars}
        onExtraCharsChange={setExtraChars}
        commercial={commercial}
        onCommercialChange={setCommercial}
        rush={rush}
        onRushChange={setRush}
        currency={currency}
        onCurrencyChange={setCurrency}
        estimate={estimate}
      />

      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        {/* ─── form fields ─── */}
        <div className="flex flex-col gap-8">
          {/* name */}
          <div>
            <label htmlFor="of-name" className={labelCls}>
              {t.form.yourName} <span className="text-ink/30">*</span>
            </label>
            <input
              id="of-name"
              className="field"
              placeholder={t.form.namePh}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* contact: email + social */}
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <label htmlFor="of-email" className={labelCls}>
                {t.form.email} <span className="text-ink/30">*</span>
              </label>
              <input
                id="of-email"
                type="email"
                className="field"
                placeholder={t.form.emailPh}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {email.trim().length > 0 && !emailValid && (
                <p className="mt-2 text-xs text-red-500/80">{t.form.emailInvalid}</p>
              )}
            </div>
            <div>
              <label htmlFor="of-social" className={labelCls}>
                {t.form.social} <span className="text-ink/30">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  aria-label={t.form.socialPlatform}
                  className="field w-auto shrink-0 cursor-pointer"
                  value={socialPlatform}
                  onChange={(e) => setSocialPlatform(e.target.value as SocialPlatformId)}
                >
                  {SOCIAL_PLATFORMS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <input
                  id="of-social"
                  className="field min-w-0"
                  placeholder={t.form.socialPh}
                  value={socialUsername}
                  onChange={(e) => setSocialUsername(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* brief */}
          <div>
            <label htmlFor="of-brief" className={labelCls}>
              {t.form.brief} <span className="text-ink/30">*</span>
            </label>
            <textarea
              id="of-brief"
              rows={5}
              className="field resize-y"
              placeholder={t.form.briefPh}
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
            />
            <p className={`mt-2 text-xs ${dark ? 'text-paper/45' : 'text-ink/45'}`}>
              {t.form.briefHint}
            </p>
          </div>

          {/* honeypot - hidden from humans, bots fill it and get silently dropped */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="pointer-events-none absolute -left-[9999px] h-px w-px opacity-0"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        {/* ─── estimate panel ─── */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
            <div className="border-b border-ink/10 px-6 py-4">
              <h3 className="text-xs font-semibold  text-ink/45 uppercase">
                {t.form.yourOrder}
              </h3>
            </div>
            <div className="flex flex-col gap-3.5 p-6 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-ink/50">{t.form.type}</span>
                <span className="text-right font-semibold">{typeLabel}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-ink/50">{t.form.basePrice}</span>
                <span className="font-semibold">{formatPrice(base, currency)}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-ink/50">{t.form.characters}</span>
                <span className="font-semibold">
                  {1 + extraChars}
                  {extraChars > 0 && ` (+${formatPrice(base * EXTRA_CHARACTER_RATE * extraChars, currency)})`}
                </span>
              </div>
              {selectedAddons.map((a) => (
                <div key={a.id} className="flex justify-between gap-3">
                  <span className="text-ink/50">{addonLabel(a.id, a.label)}</span>
                  <span className="text-right font-semibold">
                    +{formatRange(addonRange(a, currency), currency)}
                  </span>
                </div>
              ))}
              {commercial && (
                <div className="flex justify-between gap-3">
                  <span className="text-ink/50">{t.form.commercial}</span>
                  <span className="font-semibold">x{COMMERCIAL_MULTIPLIER}</span>
                </div>
              )}
              {rush && (
                <div className="flex justify-between gap-3">
                  <span className="text-ink/50">{t.form.rush}</span>
                  <span className="font-semibold">+{(RUSH_MULTIPLIER - 1) * 100}%</span>
                </div>
              )}

              <div className="mt-2 -mx-6 border-t border-ink/10 px-6 pt-5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-xs font-semibold  text-ink/45 uppercase">
                    {t.form.estimate}
                  </span>
                  <span className="text-right font-poppins text-2xl font-extrabold">
                    {formatRange(estimate, currency)}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-ink/45">
                  {t.form.estimateNote}
                </p>
              </div>

              <button
                type="button"
                onClick={submit}
                aria-disabled={!ready || sendState === 'sending'}
                className={`btn-dark mt-3 w-full px-6 py-3.5 text-sm  uppercase ${
                  ready && sendState !== 'sending' ? '' : 'cursor-not-allowed opacity-35'
                }`}
              >
                <PaperAirplaneIcon className="h-4 w-4" />
                {sendState === 'sending' ? t.form.sending : t.form.send}
              </button>

              {sendState === 'sent' && (
                <div className="flex items-start gap-2.5 rounded-xl border border-ink/10 bg-ink/[0.03] px-4 py-3">
                  <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-ink" />
                  <div>
                    <p className="text-xs font-semibold">{t.form.sentTitle}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink/55">
                      {t.form.sentSub}
                    </p>
                  </div>
                </div>
              )}
              {sendState === 'error' && (
                <p className="text-center text-xs text-red-500/80">
                  {t.form.sendError}
                </p>
              )}
              {!ready && sendState !== 'sent' && (
                <p className="text-center text-xs text-ink/45">
                  {t.form.fillRequired}
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
