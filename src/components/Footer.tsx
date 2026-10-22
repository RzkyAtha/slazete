import { ARTIST_NAME } from '../config'

export default function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-14 sm:flex-row sm:justify-between sm:px-6">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <img src="/slazete_logo_white.webp" alt="slazete" className="h-10 w-auto object-contain" />
          <p className="text-xs tracking-[0.3em] text-paper/40 uppercase">
            Official art commission page of {ARTIST_NAME}
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 sm:items-end">
          <a
            href="#order-form"
            className="rounded-xl bg-paper px-7 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-paper/85"
          >
            Start a commission
          </a>
        </div>
      </div>
      <div className="border-t border-paper/10 py-5 text-center text-xs tracking-widest text-paper/35 uppercase">
        © {new Date().getFullYear()} {ARTIST_NAME}. All rights reserved. All artworks are the
        property of the artist.
      </div>
      <div className="border-t border-paper/10 py-4 text-center">
        <p className="inline-flex items-center gap-2 text-[11px] tracking-widest text-paper/30 uppercase">
          Powered by
          <img
            src="/logo_kinarya.webp"
            alt="Kinaryaloka"
            className="h-4 w-4 rounded-sm object-contain"
          />
          Kinaryaloka
        </p>
      </div>
    </footer>
  )
}
