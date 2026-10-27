import { useLayoutEffect, useRef, useState, type ComponentType, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import {
  ArrowPathIcon,
  ChevronDownIcon,
  EyeSlashIcon,
  MinusIcon,
  PhotoIcon,
  PlusIcon,
  Square3Stack3DIcon,
  UserPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid'
import {
  ADDONS,
  COMMISSION_TYPES,
  CURRENCY,
  COMMERCIAL_MULTIPLIER,
  EXTRA_CHARACTER_RATE,
  MAX_CHARACTERS,
  RUSH_MULTIPLIER,
  addonRange,
  formatPrice,
  formatRange,
  type Currency,
  type PriceRange,
} from '../data/commission'
import { useLang } from '../i18n'

type IconComponent = ComponentType<{ className?: string }>

function PawIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <ellipse cx="5.5" cy="9.5" rx="1.7" ry="2.2" />
      <ellipse cx="9.8" cy="6.5" rx="1.7" ry="2.2" />
      <ellipse cx="14.2" cy="6.5" rx="1.7" ry="2.2" />
      <ellipse cx="18.5" cy="9.5" rx="1.7" ry="2.2" />
      <path d="M12 12c-2.9 0-5.6 2.5-5.6 4.9 0 1.8 1.4 2.9 3.1 2.9.9 0 1.6-.4 2.5-.4s1.6.4 2.5.4c1.7 0 3.1-1.1 3.1-2.9 0-2.4-2.7-4.9-5.6-4.9z" />
    </svg>
  )
}

function GemIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M7.2 3.5h9.6l3.7 5.2L12 20.5 3.5 8.7 7.2 3.5z" />
    </svg>
  )
}

const ADDON_ICONS: Record<string, IconComponent> = {
  background: PhotoIcon,
  animal: PawIcon,
  accessories: GemIcon,
  private: EyeSlashIcon,
  psd: Square3Stack3DIcon,
  revision: ArrowPathIcon,
}

// preset spots around the preview image, visited in order as items get equipped
const CHIP_POSITIONS = [
  'top-[16%] right-4 sm:right-6',
  'top-[40%] left-4 sm:left-6',
  'bottom-[28%] right-4 sm:right-6',
  'bottom-[10%] left-4 sm:left-6',
  'bottom-[10%] right-4 sm:right-6',
]
const MAX_FLOATING_CHIPS = CHIP_POSITIONS.length - 1

interface LoadoutPanelProps {
  typeId: string
  onTypeChange: (id: string) => void
  addons: ReadonlySet<string>
  onToggleAddon: (id: string) => void
  extraChars: number
  onExtraCharsChange: (n: number) => void
  commercial: boolean
  onCommercialChange: (v: boolean) => void
  rush: boolean
  onRushChange: (v: boolean) => void
  currency: Currency
  onCurrencyChange: (c: Currency) => void
  estimate: PriceRange
}

function EquipCard({
  active,
  icon,
  label,
  price,
  onToggle,
  children,
}: {
  active: boolean
  icon: ReactNode
  label: string
  price: string
  onToggle: () => void
  children?: ReactNode
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border transition-colors ${
        active ? 'border-ink bg-ink/[0.03]' : 'border-ink/15 bg-white hover:border-ink/40'
      }`}
    >
      <button
        type="button"
        aria-pressed={active}
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center gap-3 p-2.5 text-left"
      >
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors ${
            active ? 'bg-ink text-paper' : 'bg-ink/[0.06] text-ink/45'
          }`}
        >
          {icon}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-semibold">{label}</span>
        <span className="shrink-0 text-right text-[11px] font-semibold whitespace-nowrap text-ink/55">
          {price}
        </span>
      </button>
      {children}
    </div>
  )
}

export default function LoadoutPanel({
  typeId,
  onTypeChange,
  addons,
  onToggleAddon,
  extraChars,
  onExtraCharsChange,
  commercial,
  onCommercialChange,
  rush,
  onRushChange,
  currency,
  onCurrencyChange,
  estimate,
}: LoadoutPanelProps) {
  const { t } = useLang()
  const type = COMMISSION_TYPES.find((t) => t.id === typeId) ?? COMMISSION_TYPES[0]
  const tt = t.types[type.id]
  const base = currency === 'IDR' ? type.idr : type.usd
  const selectedAddons = ADDONS.filter((a) => addons.has(a.id))

  // slide direction + imperative animation restart (runs pre-paint so the
  // first frame already shows the item mid-slide)
  const prevTypeId = useRef(typeId)
  const slideDir = useRef<'r' | 'l'>('r')
  if (prevTypeId.current !== typeId) {
    const prevIdx = COMMISSION_TYPES.findIndex((t) => t.id === prevTypeId.current)
    const nextIdx = COMMISSION_TYPES.findIndex((t) => t.id === typeId)
    slideDir.current = nextIdx > prevIdx ? 'r' : 'l'
    prevTypeId.current = typeId
  }

  const stageRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const el = stageRef.current
    if (!el) return
    el.classList.remove('loadout-slide-r', 'loadout-slide-l')
    void el.offsetWidth // force reflow so the animation restarts
    el.classList.add(`loadout-slide-${slideDir.current}`)
  }, [typeId])

  const chips: string[] = [
    ...selectedAddons.map((a) => t.addons[a.id]?.label ?? a.label),
    ...(extraChars > 0 ? [t.loadout.extraCharChip(extraChars)] : []),
    ...(commercial ? [t.loadout.commercial] : []),
    ...(rush ? [t.loadout.rush] : []),
  ]

  const setChars = (n: number) =>
    onExtraCharsChange(Math.max(0, Math.min(MAX_CHARACTERS - 1, n)))

  const stepperBtn =
    'flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border border-ink/15 transition-colors hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink'

  const [equipOpen, setEquipOpen] = useState(false)
  const equippedCount =
    addons.size + (extraChars > 0 ? 1 : 0) + (commercial ? 1 : 0) + (rush ? 1 : 0)

  const equipmentList = (
    <>
      {ADDONS.map((a) => {
        const Icon = ADDON_ICONS[a.id] ?? PlusIcon
        return (
          <EquipCard
            key={a.id}
            active={addons.has(a.id)}
            icon={<Icon className="h-5 w-5" />}
            label={t.addons[a.id]?.label ?? a.label}
            price={`+${formatRange(addonRange(a, currency), currency)}`}
            onToggle={() => onToggleAddon(a.id)}
          />
        )
      })}

      <EquipCard
        active={extraChars > 0}
        icon={<UserPlusIcon className="h-5 w-5" />}
        label={t.loadout.extraChar}
        price={t.loadout.perChar(EXTRA_CHARACTER_RATE * 100)}
        onToggle={() => setChars(extraChars > 0 ? 0 : 1)}
      >
        <div className="flex items-center justify-between border-t border-ink/10 px-3 py-2">
          <span className="text-[10px] font-bold  text-ink/40 uppercase">
            {t.loadout.onCanvas(1 + extraChars, MAX_CHARACTERS)}
          </span>
          <span className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label={t.loadout.aria.removeChar}
              disabled={extraChars <= 0}
              onClick={() => setChars(extraChars - 1)}
              className={stepperBtn}
            >
              <MinusIcon className="h-3 w-3" />
            </button>
            <span className="min-w-5 text-center font-poppins text-base font-extrabold">
              {1 + extraChars}
            </span>
            <button
              type="button"
              aria-label={t.loadout.aria.addChar}
              disabled={extraChars >= MAX_CHARACTERS - 1}
              onClick={() => setChars(extraChars + 1)}
              className={stepperBtn}
            >
              <PlusIcon className="h-3 w-3" />
            </button>
          </span>
        </div>
      </EquipCard>
    </>
  )

  // buffs live outside the add-ons list entirely: below the trigger on
  // mobile, below the equipment column on desktop
  const buffChecks = (
    <>
      {(
        [
          [
            commercial,
            onCommercialChange,
            t.loadout.commercial,
            t.loadout.commercialNote(COMMERCIAL_MULTIPLIER),
          ],
          [
            rush,
            onRushChange,
            t.loadout.rush,
            t.loadout.rushNote((RUSH_MULTIPLIER - 1) * 100),
          ],
        ] as const
      ).map(([active, onChange, label, note]) => (
        <label
          key={label}
          className="block w-full cursor-pointer rounded-xl border border-ink/15 bg-white p-2.5 transition-colors hover:border-ink/40"
        >
          <span className="flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => onChange(e.target.checked)}
              className="h-4 w-4 shrink-0 cursor-pointer accent-ink"
            />
            <span className="text-[13px] leading-tight font-semibold">{label}</span>
          </span>
          <span className="mt-1.5 block pl-[26px] text-[11px] leading-snug text-ink/50">
            {note}
          </span>
        </label>
      ))}
    </>
  )

  return (
    <div className="rounded-2xl bg-white p-5 text-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] sm:p-7">
      {/* ─── header: currency + item slots ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div
          role="radiogroup"
          aria-label={t.loadout.aria.currency}
          className="relative flex w-fit rounded-full border border-ink/15"
        >
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-ink transition-transform duration-200 ease-out"
            style={{ transform: `translateX(${currency === 'IDR' ? 0 : 100}%)` }}
          />
          {CURRENCY.map((c) => (
            <label
              key={c}
              className={`relative z-10 flex cursor-pointer items-center rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-200 ${
                currency === c ? 'text-paper' : 'text-ink/50 hover:text-ink'
              }`}
            >
              <input
                type="radio"
                name="currency"
                className="sr-only"
                checked={currency === c}
                onChange={() => onCurrencyChange(c)}
              />
              {c}
            </label>
          ))}
        </div>
        <div role="radiogroup" aria-label={t.loadout.aria.type} className="flex gap-2">
          {COMMISSION_TYPES.map((ty) => (
            <button
              key={ty.id}
              type="button"
              role="radio"
              aria-checked={typeId === ty.id}
              title={t.types[ty.id]?.label ?? ty.label}
              onClick={() => onTypeChange(ty.id)}
              className={`relative w-14 cursor-pointer rounded-xl border p-1.5 transition-colors sm:w-16 ${
                typeId === ty.id ? 'border-ink bg-ink' : 'border-ink/15 hover:border-ink/40'
              }`}
            >
              {ty.image ? (
                <img
                  src={ty.image}
                  alt={t.types[ty.id]?.label ?? ty.label}
                  draggable={false}
                  decoding="async"
                  className={`h-12 w-full object-contain sm:h-14 ${typeId === ty.id ? 'invert' : ''}`}
                />
              ) : (
                <span
                  className={`flex h-12 items-center justify-center text-[10px] font-bold sm:h-14 ${
                    typeId === ty.id ? 'text-paper' : ''
                  }`}
                >
                  {t.types[ty.id]?.label ?? ty.label}
                </span>
              )}
              {typeId === ty.id && (
                <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 rounded-full bg-ink ring-2 ring-white" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ─── body: details / visual / equipment ─── */}
      <div className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-[1fr_1.25fr_1fr] lg:gap-8">
        {/* left: item details */}
        <div className="order-2 flex flex-col lg:order-1">
          <h3 className="font-poppins text-3xl font-extrabold tracking-tight uppercase lg:text-2xl">{tt?.label ?? type.label}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink/55">{tt?.desc ?? type.description}</p>

          {type.stats && (
            <div className="mt-5 flex flex-col gap-3.5">
              {type.stats.map((s, i) => (
                <div key={s.label}>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[10px] font-bold  text-ink/45 uppercase">
                      {t.statLabels[s.label] ?? s.label}
                    </span>
                    <span className="text-xs font-bold">{tt?.statDisplays[i] || s.display || s.value}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink/10">
                    <div
                      className="h-full rounded-full bg-ink transition-[width] duration-500 ease-out"
                      style={{ width: `${s.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {(tt?.features ?? type.features) && (
            <ul className="mt-5 flex flex-col gap-2">
              {(tt?.features ?? type.features)!.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[13px] leading-snug text-ink/70">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                  {f}
                </li>
              ))}
            </ul>
          )}

          <p className="mt-auto pt-6 font-poppins text-2xl font-extrabold">{formatPrice(base, currency)}</p>

          {/* desktop: buff checkboxes under the price */}
          <div className="mt-4 hidden gap-2 lg:grid">
            {buffChecks}
          </div>
        </div>

        {/* center: visual + floating equipped chips */}
        <div className="lines relative order-1 col-span-2 flex min-h-72 items-center justify-center overflow-hidden rounded-2xl border border-ink/10 p-6 lg:order-2 lg:col-span-1">
          <div ref={stageRef} className="flex w-full justify-center">
            <img
              src={type.image}
              alt={tt?.label ?? type.label}
              draggable={false}
              className="max-h-72 w-full object-contain lg:max-h-80"
            />
          </div>
          {chips.slice(0, MAX_FLOATING_CHIPS).map((label, i) => (
            <span
              key={label}
              className={`chip-in absolute z-10 flex items-center gap-1 rounded-lg border border-dashed border-ink/35 bg-white px-2.5 py-1.5 text-[11px] font-semibold whitespace-nowrap shadow-[0_8px_20px_-8px_rgba(10,10,10,0.4)] ${CHIP_POSITIONS[i]}`}
            >
              <PlusIcon className="h-3 w-3" />
              {label}
            </span>
          ))}
          {chips.length > MAX_FLOATING_CHIPS && (
            <span
              className={`chip-in absolute z-10 flex items-center gap-1 rounded-lg border border-dashed border-ink/35 bg-white px-2.5 py-1.5 text-[11px] font-semibold whitespace-nowrap ${CHIP_POSITIONS[MAX_FLOATING_CHIPS]}`}
            >
              {t.loadout.moreChips(chips.length - MAX_FLOATING_CHIPS)}
            </span>
          )}
        </div>

        {/* right: equipment */}
        <div className="order-3">
          <p className="text-[11px] font-bold  text-ink/40 uppercase">{t.loadout.addons}</p>

          {/* mobile: dropdown-style trigger opens the equipment popup */}
          <button
            type="button"
            onClick={() => setEquipOpen(true)}
            className="mt-3 flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-ink/15 bg-white p-3 text-left transition-colors hover:border-ink/40 lg:hidden"
          >
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">
                {equippedCount > 0 ? t.loadout.equippedCount(equippedCount) : t.loadout.selectAddons}
              </span>
              <span className="mt-0.5 block text-[9px] font-bold  text-ink/40 uppercase">
                {t.loadout.tapManage}
              </span>
            </span>
            <ChevronDownIcon className="h-4 w-4 shrink-0 text-ink/40" />
          </button>

          {/* mobile: buffs sit outside the popup, always visible */}
          <div className="mt-3 grid gap-2 lg:hidden">
            {buffChecks}
          </div>

          {/* desktop: full equipment column */}
          <div className="mt-3 hidden gap-2 lg:grid lg:content-start">
            {equipmentList}
          </div>
        </div>
      </div>

      {/* ─── bottom: always equipped bar ─── */}
      <div className="mt-7 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-xl border border-ink/10 bg-paper px-4 py-3.5 sm:px-5">
        <div className="flex items-center gap-4">
          <span className="hidden text-[10px] font-bold  text-ink/35 uppercase sm:inline">
            {t.loadout.alwaysEquipped}
          </span>
          <span className="flex items-center gap-2.5">
            <span className="rounded-md bg-ink px-2 py-1 text-[9px] font-bold  text-paper uppercase">
              {t.loadout.equipped}
            </span>
            <span className="text-sm font-semibold">{tt?.label ?? type.label}</span>
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-[10px] font-bold  text-ink/35 uppercase">
            {t.loadout.estimate}
          </span>
          <span className="font-poppins text-xl font-extrabold">{formatRange(estimate, currency)}</span>
        </div>
      </div>

      {/* ─── equipment popup (mobile) ─── */}
      {equipOpen &&
        createPortal(
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/70 p-4"
          onClick={() => setEquipOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.loadout.popupTitle}
            className="flex max-h-[90dvh] w-full max-w-sm flex-col rounded-2xl bg-white p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="font-poppins text-xl font-extrabold tracking-tight uppercase">
                  {t.loadout.popupTitle}
                </h4>
                <p className="mt-1 text-xs text-ink/55">
                  {t.loadout.popupSub}
                </p>
              </div>
              <button
                type="button"
                aria-label={t.loadout.aria.close}
                onClick={() => setEquipOpen(false)}
                className="cursor-pointer rounded-full p-1.5 text-ink/40 transition-colors hover:bg-ink/5 hover:text-ink"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="inv-scroll mt-4 grid min-h-0 flex-1 content-start gap-2 overflow-y-auto pr-1">
              {equipmentList}
            </div>
            <button
              type="button"
              onClick={() => setEquipOpen(false)}
              className="btn-dark mt-4 w-full px-6 py-3 text-sm  uppercase"
            >
              {t.loadout.done}
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
