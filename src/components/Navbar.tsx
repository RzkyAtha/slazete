import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/order', label: 'Order' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [pastHero, setPastHero] = useState(true)
  const { pathname } = useLocation()

  // logo only appears after scrolling past the hero (pages without a hero: always)
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
  }, [pathname])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center" aria-label="slazete home">
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
          </Link>

          <button
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-ink text-paper transition-colors duration-150 hover:bg-ink/80"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* dropdown panel - black container */}
      <div
        className={`absolute inset-x-0 top-full overflow-hidden bg-ink transition-all duration-300 ${
          open ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="halftone-white mx-auto flex max-w-6xl flex-col px-6 py-6">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`border-b border-paper/10 py-4 font-display text-2xl tracking-wide uppercase transition-colors last:border-0 ${
                pathname === l.to ? 'text-paper' : 'text-paper/40 hover:text-paper'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/order"
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex w-fit items-center rounded-xl bg-paper px-6 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-paper/85"
          >
            Commission Me
          </Link>
        </div>
      </div>
    </header>
  )
}
