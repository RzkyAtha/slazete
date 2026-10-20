import {
  ADDONS,
  COMMISSION_TYPES,
  EXTRA_CHARACTER_RATE,
  WILL_DRAW,
  WONT_DRAW,
  formatRange,
} from '../data/commission'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function PriceTable() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      {/* base price table */}
      <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-ink/10 text-[11px] font-semibold tracking-[0.25em] text-ink/45 uppercase">
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">IDR</th>
              <th className="px-6 py-4">USD</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {COMMISSION_TYPES.map((t) => (
              <tr key={t.id} className="transition-colors hover:bg-neutral-50">
                <td className="px-6 py-5 font-semibold">{t.label}</td>
                <td className="px-6 py-5 font-display text-xl">{t.idr}K</td>
                <td className="px-6 py-5 font-display text-xl">${t.usd}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="halftone border-t border-ink/10 px-6 py-3.5 text-xs font-semibold tracking-wide text-ink/60">
          + additional character : +{EXTRA_CHARACTER_RATE * 100}% base price each (max 5 per canvas)
        </div>
      </div>

      {/* will / won't draw */}
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-ink/10 bg-white p-6">
          <h3 className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-ink/45 uppercase">
            <CheckIcon className="h-4 w-4 text-ink" strokeWidth={2.5} />
            will draw
          </h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {WILL_DRAW.map((w) => (
              <span
                key={w}
                className="rounded-full bg-ink px-3.5 py-1.5 text-xs font-semibold tracking-widest text-paper uppercase"
              >
                {w}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-6">
          <h3 className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-ink/45 uppercase">
            <XMarkIcon className="h-4 w-4 text-ink" strokeWidth={2.5} />
            won't draw
          </h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {WONT_DRAW.map((w) => (
              <span
                key={w}
                className="rounded-full border border-ink/20 px-3.5 py-1.5 text-xs font-semibold tracking-widest text-ink/45 uppercase line-through decoration-ink/30"
              >
                {w}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* extras */}
      <div className="rounded-2xl border border-ink/10 bg-white p-6 sm:p-8 lg:col-span-2">
        <h3 className="text-xs font-semibold tracking-[0.25em] text-ink/45 uppercase">Extras</h3>
        <ul className="mt-5 grid gap-x-12 sm:grid-cols-2">
          {ADDONS.map((a) => (
            <li
              key={a.id}
              className="flex items-baseline justify-between gap-4 border-b border-ink/10 py-3 text-sm last:border-0 sm:last:border-b"
            >
              <span>
                {a.label}
                {a.hint && <span className="ml-1.5 text-ink/40">({a.hint})</span>}
              </span>
              <span className="font-semibold whitespace-nowrap">
                {formatRange({ min: a.idr ?? a.idrMin ?? 0, max: a.idr ?? a.idrMax ?? 0 }, 'IDR')}
                <span className="mx-1.5 text-ink/30">/</span>
                {formatRange({ min: a.usd ?? a.usdMin ?? 0, max: a.usd ?? a.usdMax ?? 0 }, 'USD')}
              </span>
            </li>
          ))}
          <li className="flex items-baseline justify-between gap-4 border-b border-ink/10 py-3 text-sm sm:border-0">
            <span>Commercial purpose (merch, books, etc)</span>
            <span className="font-semibold whitespace-nowrap">2× final price</span>
          </li>
          <li className="flex items-baseline justify-between gap-4 py-3 text-sm">
            <span>Rush order (as fast as 2 days)</span>
            <span className="font-semibold whitespace-nowrap">+50% final price</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
