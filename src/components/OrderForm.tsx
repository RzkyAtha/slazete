import { useMemo, useState } from 'react'
import {
  PaperAirplaneIcon,
  XMarkIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/solid'
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
import { ARTIST_NAME, INSTAGRAM_DM_URL, TIKTOK_PROFILE_URL } from '../config'
import { useLang } from '../i18n'

export default function OrderForm({ dark = false }: { dark?: boolean }) {
  const { t } = useLang()
  const labelCls = `mb-2.5 block text-xs font-semibold  uppercase ${
    dark ? 'text-paper/45' : 'text-ink/45'
  }`
  const [name, setName] = useState('')
  const [currency, setCurrency] = useState<Currency>('IDR')
  const [typeId, setTypeId] = useState(COMMISSION_TYPES[0].id)
  const [extraChars, setExtraChars] = useState(0)
  const [addons, setAddons] = useState<Set<string>>(new Set())
  const [commercial, setCommercial] = useState(false)
  const [rush, setRush] = useState(false)
  const [brief, setBrief] = useState('')

  const type = COMMISSION_TYPES.find((ty) => ty.id === typeId) ?? COMMISSION_TYPES[0]
  const typeLabel = t.types[type.id]?.label ?? type.label
  const addonLabel = (id: string, fallback: string) => t.addons[id]?.label ?? fallback
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
  }, [name, currency, typeLabel, base, extraChars, selectedAddons, commercial, rush, estimate, brief, t])

  const ready = name.trim().length > 0 && brief.trim().length > 0
  const [dmOpen, setDmOpen] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  // no prefill API for IG/TikTok DMs - copy the brief, then open the DM/profile
  const sendVia = async (platform: 'instagram' | 'tiktok') => {
    try {
      await navigator.clipboard.writeText(orderMessage)
      setCopied(platform)
    } catch {
      // clipboard blocked - still open the target so they can type manually
    }
    window.open(platform === 'instagram' ? INSTAGRAM_DM_URL : TIKTOK_PROFILE_URL, '_blank')
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
                onClick={() => ready && setDmOpen(true)}
                aria-disabled={!ready}
                className={`btn-dark mt-3 w-full px-6 py-3.5 text-sm  uppercase ${
                  ready ? '' : 'cursor-not-allowed opacity-35'
                }`}
              >
                <PaperAirplaneIcon className="h-4 w-4" />
                {t.form.send}
              </button>
              {!ready && (
                <p className="text-center text-xs text-ink/45">
                  {t.form.fillRequired}
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* ─── DM picker popup ─── */}
      {dmOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/70 p-4"
          onClick={() => {
            setDmOpen(false)
            setCopied(null)
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.form.chooseSend}
            className="w-full max-w-sm rounded-2xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-poppins text-2xl font-extrabold tracking-tight uppercase">{t.form.dmTitle}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-ink/55">
                  {t.form.dmSub}
                </p>
              </div>
              <button
                type="button"
                aria-label={t.form.close}
                onClick={() => {
                  setDmOpen(false)
                  setCopied(null)
                }}
                className="cursor-pointer rounded-full p-1.5 text-ink/40 transition-colors hover:bg-ink/5 hover:text-ink"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 flex flex-col gap-2.5">
              {(
                [
                  { id: 'instagram', label: 'Instagram DM', href: INSTAGRAM_DM_URL },
                  { id: 'tiktok', label: 'TikTok DM', href: TIKTOK_PROFILE_URL },
                ] as const
              ).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => sendVia(p.id)}
                  className="flex cursor-pointer items-center justify-between rounded-xl border border-ink/15 px-5 py-3.5 text-sm font-semibold transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                >
                  <span>{p.label}</span>
                  {copied === p.id ? (
                    <span className="flex items-center gap-1.5 text-xs font-medium">
                      <ClipboardDocumentCheckIcon className="h-4 w-4" />
                      {t.form.copied}
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-ink/40">{t.form.copyOpen}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
