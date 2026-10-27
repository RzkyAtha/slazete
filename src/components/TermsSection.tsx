import { useLang } from '../i18n'

export default function TermsSection() {
  const { t } = useLang()
  return (
    <div className="divide-y divide-ink/10 overflow-hidden rounded-2xl border border-ink/10 bg-white">
      <div className="flex justify-center p-6 sm:p-8">
        <img
          src="/TOS.webp"
          alt={t.sections.terms}
          decoding="async"
          className="h-24 w-auto sm:h-28"
        />
      </div>
      {t.terms.groups.map((g) => (
        <div key={g.title} className="p-6 sm:p-8">
          <h3 className="font-poppins text-xl font-extrabold tracking-tight uppercase text-ink sm:text-2xl">
            {g.title}
          </h3>
          <ul className="mt-6 flex flex-col gap-3.5 text-sm leading-relaxed text-ink/75">
            {g.items.map((item, i) => (
              <li key={item} className="flex gap-3">
                <span className="w-5 flex-shrink-0 font-poppins text-xs font-extrabold text-ink/30">
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
