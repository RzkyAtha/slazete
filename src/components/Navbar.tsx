import { useEffect, useState } from 'react'
import { useLang } from '../i18n'
import type { Lang } from '../data/i18n'

const LANGS: Lang[] = ['en', 'id']

export default function Navbar() {
  const { lang, setLang, t } = useLang()
  const [pastHero, setPastHero] = useState(true)

  // logo only appears after scrolling past the hero
  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) {
      setPastHero(true)
      return
    }
    const onScroll = () => setPastHero(window.scrollY > hero.offsetTop + hero.offsetHeight - 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="#hero" className="flex items-center" aria-label="slazete home">
            <span
              className={`overflow-hidden transition-all duration-300 ease-out ${
                pastHero
                  ? 'mr-2.5 max-w-24 translate-x-0 opacity-100'
                  : 'mr-0 max-w-0 -translate-x-4 opacity-0'
              }`}
            >
              <img
                src="/slazete_logo_nobg.webp"
                alt=""
                className="h-9 w-auto object-contain"
              />
            </span>
            <span className="font-poppins text-2xl font-extrabold tracking-tight text-ink lowercase">
              slazete
            </span>
          </a>

          {/* language toggle */}
          <div
            role="radiogroup"
            aria-label={t.nav.switchLang}
            className="relative flex w-fit rounded-full border border-ink/15"
          >
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-ink transition-transform duration-200 ease-out"
              style={{ transform: `translateX(${lang === 'en' ? 0 : 100}%)` }}
            />
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`relative z-10 w-11 cursor-pointer rounded-full py-1.5 text-xs font-bold uppercase transition-colors duration-200 ${
                  lang === l ? 'text-paper' : 'text-ink/50 hover:text-ink'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  )
}
