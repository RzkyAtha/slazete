import { TERMS } from '../data/commission'

const GROUPS: { title: string; items: string[] }[] = [
  { title: 'General', items: TERMS.general },
  { title: 'Commission', items: TERMS.commission },
  { title: 'Payment', items: TERMS.payment },
]

export default function TermsSection() {
  return (
    <div className="grid gap-5">
      {GROUPS.map((g) => (
        <div key={g.title} className="flex flex-col rounded-2xl border border-ink/10 bg-white p-6">
          <h3 className="text-xs font-semibold tracking-[0.25em] text-ink uppercase">
            {g.title}
          </h3>
          <ul className="mt-5 flex flex-col gap-3.5 text-sm leading-relaxed text-ink/75">
            {g.items.map((item, i) => (
              <li key={item} className="flex gap-3">
                <span className="w-5 flex-shrink-0 font-display text-xs text-ink/30">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
