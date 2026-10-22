import { useMemo, useState } from 'react'
import {
  MinusIcon,
  PlusIcon,
  PaperAirplaneIcon,
  XMarkIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline'
import {
  ADDONS,
  COMMISSION_TYPES,
  COMMERCIAL_MULTIPLIER,
  CURRENCY,
  EXTRA_CHARACTER_RATE,
  MAX_CHARACTERS,
  RUSH_MULTIPLIER,
  addonRange,
  formatPrice,
  formatRange,
  type Currency,
  type PriceRange,
} from '../data/commission'
import { ARTIST_NAME, INSTAGRAM_DM_URL, TIKTOK_PROFILE_URL } from '../config'

const optionCard = (active: boolean) =>
  `flex cursor-pointer items-start gap-3 rounded-xl border bg-white p-4 transition-colors ${
    active ? 'border-ink' : 'border-ink/15 hover:border-ink/40'
  }`

export default function OrderForm({ dark = false }: { dark?: boolean }) {
  const labelCls = `mb-2.5 block text-xs font-semibold tracking-[0.25em] uppercase ${
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

  const type = COMMISSION_TYPES.find((t) => t.id === typeId) ?? COMMISSION_TYPES[0]
  const base = currency === 'IDR' ? type.idr : type.usd

  const toggleAddon = (id: string) =>
    setAddons((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const estimate: PriceRange = useMemo(() => {
    let min = base
    let max = base
    const extra = base * EXTRA_CHARACTER_RATE * extraChars
    min += extra
    max += extra
    for (const a of ADDONS) {
      if (!addons.has(a.id)) continue
      const r = addonRange(a, currency)
      min += r.min
      max += r.max
    }
    const mult = (commercial ? COMMERCIAL_MULTIPLIER : 1) * (rush ? RUSH_MULTIPLIER : 1)
    return { min: min * mult, max: max * mult }
  }, [base, extraChars, addons, currency, commercial, rush])

  const selectedAddons = ADDONS.filter((a) => addons.has(a.id))

  const orderMessage = useMemo(() => {
    const lines = [
      `Hi ${ARTIST_NAME}! I'd like to order a commission.`,
      '',
      `Name: ${name || '-'}`,
      `Currency: ${currency}`,
      `Type: ${type.label} - base ${formatPrice(base, currency)}`,
      `Characters: ${1 + extraChars}${extraChars ? ` (${extraChars} extra, +${EXTRA_CHARACTER_RATE * 100}% each)` : ''}`,
      `Add-ons: ${selectedAddons.length ? selectedAddons.map((a) => `${a.label} (${formatRange(addonRange(a, currency), currency)})`).join(', ') : 'none'}`,
      `Commercial use: ${commercial ? `yes (x${COMMERCIAL_MULTIPLIER})` : 'no'}`,
      `Rush order: ${rush ? `yes (+${(RUSH_MULTIPLIER - 1) * 100}%)` : 'no'}`,
      `Estimate: ${formatRange(estimate, currency)} (final price set after sketch)`,
      '',
      'Brief / references:',
      brief || '-',
    ]
    return lines.join('\n')
  }, [name, currency, type, base, extraChars, selectedAddons, commercial, rush, estimate, brief])

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
    <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
      {/* ─── form fields ─── */}
      <div className="flex flex-col gap-8">
        {/* name */}
        <div>
          <label htmlFor="of-name" className={labelCls}>
            Your name <span className="text-ink/30">*</span>
          </label>
          <input
            id="of-name"
            className="field"
            placeholder="what should I call you?"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* currency */}
        <fieldset>
          <legend className={labelCls}>Currency</legend>
          <div className="relative flex w-fit rounded-full border border-paper/25">
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-white transition-transform duration-200 ease-out"
              style={{ transform: `translateX(${currency === 'IDR' ? 0 : 100}%)` }}
            />
            {CURRENCY.map((c) => (
              <label
                key={c}
                className={`relative z-10 flex cursor-pointer items-center gap-2.5 rounded-full px-6 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                  currency === c ? 'text-ink' : 'text-paper/60 hover:text-paper'
                }`}
              >
                <input
                  type="radio"
                  name="currency"
                  className="sr-only"
                  checked={currency === c}
                  onChange={() => setCurrency(c)}
                />
                {c}
              </label>
            ))}
          </div>
        </fieldset>

        {/* type */}
        <fieldset>
          <legend className={labelCls}>Commission type</legend>
          <div className="relative grid grid-cols-3 divide-x divide-ink/10 overflow-hidden rounded-lg border border-ink/15 bg-white">
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1/3 bg-ink transition-transform duration-200 ease-out"
              style={{
                transform: `translateX(${COMMISSION_TYPES.findIndex((t) => t.id === typeId) * 100}%)`,
              }}
            />
            {COMMISSION_TYPES.map((t) => (
              <label
                key={t.id}
                className={`relative z-10 cursor-pointer p-2.5 transition-colors duration-200 sm:p-4 ${
                  typeId === t.id ? 'text-paper' : 'hover:bg-ink/5'
                }`}
              >
                <input
                  type="radio"
                  name="ctype"
                  className="sr-only"
                  checked={typeId === t.id}
                  onChange={() => setTypeId(t.id)}
                />
                {t.image && (
                  <span className="mb-2 block h-28 sm:mb-3 sm:h-52">
                    <img
                      src={t.image}
                      alt=""
                      aria-hidden="true"
                      draggable={false}
                      decoding="async"
                      className={`h-full w-full object-contain object-center ${
                        typeId === t.id ? 'invert' : ''
                      }`}
                    />
                  </span>
                )}
                <span className="block text-xs font-semibold sm:text-sm">{t.label}</span>
                <span className="mt-1 block font-display text-lg sm:mt-1.5 sm:text-2xl">
                  {formatPrice(currency === 'IDR' ? t.idr : t.usd, currency)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* characters */}
        <fieldset>
          <legend className={labelCls}>
            Characters{' '}
            <span className={`normal-case ${dark ? 'text-paper/35' : 'text-ink/35'}`}>
              (max {MAX_CHARACTERS})
            </span>
          </legend>
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Remove character"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-ink/20 transition-colors hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
              onClick={() => setExtraChars((v) => Math.max(0, v - 1))}
              disabled={extraChars === 0}
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <span className="min-w-16 text-center font-display text-2xl">{1 + extraChars}</span>
            <button
              type="button"
              aria-label="Add character"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-ink/20 transition-colors hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
              onClick={() => setExtraChars((v) => Math.min(MAX_CHARACTERS - 1, v + 1))}
              disabled={extraChars >= MAX_CHARACTERS - 1}
            >
              <PlusIcon className="h-4 w-4" />
            </button>
            <span className={`text-sm ${dark ? 'text-paper/50' : 'text-ink/50'}`}>
              +{EXTRA_CHARACTER_RATE * 100}% base price per extra character
            </span>
          </div>
        </fieldset>

        {/* addons */}
        <fieldset>
          <legend className={labelCls}>Add-ons</legend>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {ADDONS.map((a) => (
              <label key={a.id} className={optionCard(addons.has(a.id))}>
                <input
                  type="checkbox"
                  className="ink-check mt-0.5"
                  checked={addons.has(a.id)}
                  onChange={() => toggleAddon(a.id)}
                />
                <span className="flex-1">
                  <span className="block text-sm font-semibold">{a.label}</span>
                  <span className="text-xs text-ink/50">
                    {formatRange(addonRange(a, currency), currency)}
                    {a.hint ? ` · ${a.hint}` : ''}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* options */}
        <fieldset>
          <legend className={labelCls}>Options</legend>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <label className={optionCard(commercial)}>
              <input
                type="checkbox"
                className="ink-check mt-0.5"
                checked={commercial}
                onChange={(e) => setCommercial(e.target.checked)}
              />
              <span>
                <span className="block text-sm font-semibold">Commercial use</span>
                <span className="text-xs text-ink/50">
                  merch, published books, etc - x{COMMERCIAL_MULTIPLIER} final price
                </span>
              </span>
            </label>
            <label className={optionCard(rush)}>
              <input
                type="checkbox"
                className="ink-check mt-0.5"
                checked={rush}
                onChange={(e) => setRush(e.target.checked)}
              />
              <span>
                <span className="block text-sm font-semibold">Rush order</span>
                <span className="text-xs text-ink/50">
                  as fast as 2 days - +{(RUSH_MULTIPLIER - 1) * 100}% final price
                </span>
              </span>
            </label>
          </div>
        </fieldset>

        {/* brief */}
        <div>
          <label htmlFor="of-brief" className={labelCls}>
            Brief & references <span className="text-ink/30">*</span>
          </label>
          <textarea
            id="of-brief"
            rows={5}
            className="field resize-y"
            placeholder={'describe your character, pose, expression, mood…\npaste reference links (google drive / pinterest) here'}
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
          />
          <p className={`mt-2 text-xs ${dark ? 'text-paper/45' : 'text-ink/45'}`}>
            a comprehensive brief is required - the clearer, the better the result.
          </p>
        </div>
      </div>

      {/* ─── estimate panel ─── */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
          <div className="border-b border-ink/10 px-6 py-4">
            <h3 className="text-xs font-semibold tracking-[0.25em] text-ink/45 uppercase">
              Your order
            </h3>
          </div>
          <div className="flex flex-col gap-3.5 p-6 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-ink/50">Type</span>
              <span className="text-right font-semibold">{type.label}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-ink/50">Base price</span>
              <span className="font-semibold">{formatPrice(base, currency)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-ink/50">Characters</span>
              <span className="font-semibold">
                {1 + extraChars}
                {extraChars > 0 && ` (+${formatPrice(base * EXTRA_CHARACTER_RATE * extraChars, currency)})`}
              </span>
            </div>
            {selectedAddons.map((a) => (
              <div key={a.id} className="flex justify-between gap-3">
                <span className="text-ink/50">{a.label}</span>
                <span className="text-right font-semibold">
                  +{formatRange(addonRange(a, currency), currency)}
                </span>
              </div>
            ))}
            {commercial && (
              <div className="flex justify-between gap-3">
                <span className="text-ink/50">Commercial use</span>
                <span className="font-semibold">x{COMMERCIAL_MULTIPLIER}</span>
              </div>
            )}
            {rush && (
              <div className="flex justify-between gap-3">
                <span className="text-ink/50">Rush order</span>
                <span className="font-semibold">+{(RUSH_MULTIPLIER - 1) * 100}%</span>
              </div>
            )}

            <div className="halftone mt-2 -mx-6 border-t border-ink/10 px-6 pt-5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-xs font-semibold tracking-[0.25em] text-ink/45 uppercase">
                  Estimate
                </span>
                <span className="text-right font-display text-2xl">
                  {formatRange(estimate, currency)}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-ink/45">
                final price is set after the sketch is agreed, along with the ETA.
              </p>
            </div>

            <button
              type="button"
              onClick={() => ready && setDmOpen(true)}
              aria-disabled={!ready}
              className={`btn-dark mt-3 w-full px-6 py-3.5 text-sm tracking-widest uppercase ${
                ready ? '' : 'cursor-not-allowed opacity-35'
              }`}
            >
              <PaperAirplaneIcon className="h-4 w-4" />
              Send order
            </button>
            {!ready && (
              <p className="text-center text-xs text-ink/45">
                fill in your name & brief to enable ordering
              </p>
            )}
          </div>
        </div>
      </aside>

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
            aria-label="Choose where to send your order"
            className="w-full max-w-sm rounded-2xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl tracking-wide uppercase">Send via DM</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-ink/55">
                  your order brief is copied automatically - just paste it into the chat.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
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
                      copied!
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-ink/40">copy & open</span>
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
