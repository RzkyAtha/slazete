import { useState } from 'react'
import type { ComponentType, SVGProps } from 'react'
import { useLang } from '../i18n'
import {
  CheckIcon,
  ExclamationTriangleIcon,
  FireIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid'
import {
  ADDONS,
  COMMISSION_TYPES,
  COMMERCIAL_MULTIPLIER,
  CURRENCY,
  EXTRA_CHARACTER_RATE,
  MAX_CHARACTERS,
  PRICE_MODIFIERS,
  RUSH_MULTIPLIER,
  WILL_DRAW,
  addonRange,
  formatPrice,
  formatRange,
  type Currency,
} from '../data/commission'

// ─── shared styles ────────────────────────────────────────────────

const chipOutline =
  'rounded-full border border-ink/15 bg-ink/[0.03] px-3.5 py-1.5 text-xs font-medium text-ink/55'
const chipSolid =
  'flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-xs font-bold  text-paper uppercase'

type IconCmp = ComponentType<SVGProps<SVGSVGElement>>

const WILL_DRAW_ICONS: Record<string, IconCmp> = {
  gore: ExclamationTriangleIcon,
  nsfw: FireIcon,
}

// ─── currency toggle ──────────────────────────────────────────────

function CurrencyToggle({
  currency,
  onChange,
}: {
  currency: Currency
  onChange: (c: Currency) => void
}) {
  return (
    <div className="relative flex rounded-full border border-ink/10 bg-ink/5 p-1">
      <span
        aria-hidden="true"
        className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-ink transition-transform duration-200 ease-out"
        style={{ transform: `translateX(${currency === 'IDR' ? 0 : 100}%)` }}
      />
      {CURRENCY.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className={`relative z-10 cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold transition-colors duration-200 ${
            currency === c ? 'text-paper' : 'text-ink/50 hover:text-ink'
          }`}
        >
          {c === 'IDR' ? 'IDR (Rp)' : 'USD ($)'}
        </button>
      ))}
    </div>
  )
}

// ─── sections ─────────────────────────────────────────────────────

function HeaderCard({
  currency,
  onCurrency,
}: {
  currency: Currency
  onCurrency: (c: Currency) => void
}) {
  return (
    <div className="relative flex flex-col items-center gap-4 p-6 sm:flex-row sm:justify-center sm:p-8">
      <img src="/PL.webp" alt="Price List" decoding="async" className="h-14 w-auto" />
      <div className="sm:absolute sm:right-8">
        <CurrencyToggle currency={currency} onChange={onCurrency} />
      </div>
    </div>
  )
}

function TierCards({ currency }: { currency: Currency }) {
  const { t: i18n } = useLang()
  return (
    <div className="grid grid-cols-3 divide-x divide-ink/10">
      {COMMISSION_TYPES.map((t) => (
        <div key={t.id} className="p-2.5 sm:p-4">
          {t.image && (
            <span className="mb-2 block h-28 sm:mb-3 sm:h-52">
              <img
                src={t.image}
                alt={t.label}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="h-full w-full object-contain object-center"
              />
            </span>
          )}
          <span className="block text-xs font-semibold sm:text-sm">{i18n.types[t.id]?.label ?? t.label}</span>
          <span className="mt-1 block font-poppins text-lg font-extrabold sm:mt-1.5 sm:text-2xl">
            {formatPrice(currency === 'IDR' ? t.idr : t.usd, currency)}
          </span>
        </div>
      ))}
    </div>
  )
}

function DrawRules() {
  const { t } = useLang()
  return (
    <div className="grid sm:grid-cols-2 sm:divide-x sm:divide-ink/10">
      {/* will draw */}
      <div className="p-6 max-sm:border-b max-sm:border-ink/10">
        <h3 className="flex items-center gap-2.5">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500/15 text-emerald-600">
            <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
          <span className="text-xs font-bold  text-ink/80 uppercase">{t.price.willDraw}</span>
        </h3>
        <div className="relative mt-5 flex flex-wrap gap-2">
          {WILL_DRAW.map((w) => {
            const Icon = WILL_DRAW_ICONS[w.label.toLowerCase()]
            return w.highlight ? (
              <span key={w.label} className={chipSolid}>
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {w.label}
              </span>
            ) : (
              <span key={w.label} className={chipOutline}>
                {w.label}
              </span>
            )
          })}
        </div>
      </div>

      {/* won't draw */}
      <div className="p-6">
        <h3 className="flex items-center gap-2.5">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-rose-500/15 text-rose-600">
            <XMarkIcon className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
          <span className="text-xs font-bold  text-ink/80 uppercase">
            {t.price.wontDraw}
          </span>
        </h3>
        <div className="relative mt-5 flex flex-wrap gap-2">
          {t.price.wontItems.map((w) => (
            <span key={w} className={`${chipOutline} text-ink/45`}>
              {w}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function ExtraCharacterRule() {
  const { t } = useLang()
  return (
    <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
      <span className="grid h-12 w-14 shrink-0 place-items-center rounded-xl bg-ink font-poppins text-sm font-extrabold text-paper">
        +{EXTRA_CHARACTER_RATE * 100}%
      </span>
      <div className="flex-1">
        <h3 className="text-sm font-bold text-ink">{t.price.extraCharTitle}</h3>
        <p className="mt-1 text-xs leading-relaxed text-ink/50">
          {t.price.extraCharDesc(EXTRA_CHARACTER_RATE * 100, MAX_CHARACTERS)}
        </p>
      </div>
      <span className={`${chipOutline} w-fit shrink-0`}>{t.price.extraCharChip(MAX_CHARACTERS)}</span>
    </div>
  )
}

function ExtrasGrid({ currency }: { currency: Currency }) {
  const { t } = useLang()
  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-ink">{t.price.extrasTitle}</h3>
          <p className="mt-0.5 text-xs text-ink/45">
            {t.price.extrasSub}
          </p>
        </div>
        <span className="hidden text-[10px] font-bold  text-ink/30 sm:block">
          {t.price.options.toUpperCase()}
        </span>
      </div>

      <div className="mt-6 grid gap-x-10 gap-y-5 sm:grid-cols-2">
        {ADDONS.map((a) => (
          <div key={a.id} className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-ink">{t.addons[a.id]?.label ?? a.label}</h4>
              <p className="mt-0.5 text-xs leading-relaxed text-ink/45">
                {t.addons[a.id]?.desc ?? a.description}
              </p>
            </div>
            <p className="shrink-0 text-sm font-bold whitespace-nowrap text-ink">
              {formatRange(addonRange(a, currency), currency)}
            </p>
          </div>
        ))}
        {PRICE_MODIFIERS.map((m) => {
          const mt = t.modifiers[m.id]
          return (
            <div key={m.id} className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-ink">{mt.label}</h4>
                <p className="mt-0.5 text-xs leading-relaxed text-ink/45">{mt.desc}</p>
              </div>
              <p className="shrink-0 text-sm font-bold whitespace-nowrap text-ink">
                {m.id === 'commercial'
                  ? mt.display(COMMERCIAL_MULTIPLIER)
                  : mt.display((RUSH_MULTIPLIER - 1) * 100)}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── section ──────────────────────────────────────────────────────

export default function PriceList() {
  const [currency, setCurrency] = useState<Currency>('IDR')

  return (
    <div className="divide-y divide-ink/10 overflow-hidden rounded-2xl border border-ink/10 bg-white">
      <HeaderCard currency={currency} onCurrency={setCurrency} />
      <TierCards currency={currency} />
      <DrawRules />
      <ExtraCharacterRule />
      <ExtrasGrid currency={currency} />
    </div>
  )
}
