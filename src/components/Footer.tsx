import { Link } from 'react-router-dom'
import { ARTIST_NAME, SOCIALS } from '../config'

export default function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-14 sm:flex-row sm:justify-between sm:px-6">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <img src="/slazete_logo_white.png" alt="slazete" className="h-10 w-auto object-contain" />
          <p className="text-xs tracking-[0.3em] text-paper/40 uppercase">
            art commissions by {ARTIST_NAME}
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 sm:items-end">
          <Link
            to="/order"
            className="rounded-xl bg-paper px-7 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-paper/85"
          >
            Start a commission
          </Link>
          <div className="flex gap-5 text-sm text-paper/50">
            {SOCIALS.length > 0 ? (
              SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-4 hover:text-paper hover:underline"
                >
                  {s.label}
                </a>
              ))
            ) : (
              <span>DM open · via WhatsApp</span>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-paper/10 py-5 text-center text-xs tracking-widest text-paper/35 uppercase">
        © {new Date().getFullYear()} {ARTIST_NAME} — all artworks are the artist's property
      </div>
    </footer>
  )
}
