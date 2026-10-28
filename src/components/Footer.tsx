import { ARTIST_NAME, INSTAGRAM_DM_URL, TIKTOK_PROFILE_URL } from '../config'
import { useLang } from '../i18n'
import SocialLinks from './SocialLinks'

export default function Footer() {
  const { t } = useLang()

  const linkGroups = [
    {
      heading: t.footer.explore,
      links: [
        { label: t.footer.home, href: '#hero' },
        { label: t.footer.prices, href: '#prices' },
        { label: t.footer.terms, href: '#terms' },
        { label: t.footer.orderForm, href: '#order-form' },
        { label: t.footer.contact, href: '#contact' },
      ],
    },
    {
      heading: t.footer.commission,
      links: [
        { label: t.footer.start, href: '#order-form' },
        { label: t.footer.igDm, href: INSTAGRAM_DM_URL, external: true },
        { label: t.footer.tiktok, href: TIKTOK_PROFILE_URL, external: true },
      ],
    },
  ]

  return (
    <footer className="border-t border-paper/10 bg-[#161616] text-paper">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2">
          {linkGroups.map((g) => (
            <div key={g.heading}>
              <p className="text-xs font-medium text-paper/40">{g.heading}</p>
              <ul className="mt-5 flex flex-col gap-4">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                      className="text-sm font-medium text-paper/85 transition-colors hover:text-paper"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <SocialLinks dark />
        </div>

        <p className="mt-12 text-xs font-semibold text-paper/70">
          {t.footer.rights(new Date().getFullYear(), ARTIST_NAME)}
        </p>
        <p className="mt-4 max-w-xl text-xs leading-relaxed text-paper/35">
          {t.footer.note(ARTIST_NAME)}
        </p>
        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-paper/35">
          {t.footer.powered}
          <img
            src="/logo_kinarya.webp"
            alt="Kinaryaloka"
            className="h-3.5 w-3.5 rounded-sm object-contain"
          />
          Kinaryaloka
        </p>
      </div>
    </footer>
  )
}
