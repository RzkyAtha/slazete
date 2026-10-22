import { useEffect, useRef } from 'react'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import MangaPanel from '../components/MangaPanel'
import PriceTable from '../components/PriceTable'
import TermsSection from '../components/TermsSection'
import OrderForm from '../components/OrderForm'
import SocialLinks from '../components/SocialLinks'

export default function Home() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const guyRef = useRef<HTMLImageElement>(null)
  const girlRef = useRef<HTMLImageElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Doodle parallax + reveal, driven by a rAF lerp loop and IntersectionObserver
  // instead of a JS animation library. Progress math matches the old offsets:
  // 0 when the section top is at the viewport bottom, 1 when it reaches 35% vh.
  useEffect(() => {
    const guy = guyRef.current
    const girl = girlRef.current
    const section = sectionRef.current
    const content = contentRef.current
    if (!guy || !girl || !section || !content) return

    let cur = 0
    let tgt = 0
    let raf = 0

    const apply = (p: number) => {
      const x = ((1 - p) * 15).toFixed(3)
      guy.style.transform = `translate3d(${x}vw, 0, 0)`
      girl.style.transform = `translate3d(-${x}vw, 0, 0)`
      const op = (0.4 - p * 0.2).toFixed(3)
      guy.style.opacity = op
      girl.style.opacity = op
    }

    const loop = () => {
      cur += (tgt - cur) * 0.12
      if (Math.abs(tgt - cur) < 0.001) cur = tgt
      apply(cur)
      raf = cur === tgt ? 0 : requestAnimationFrame(loop)
    }

    const measure = () => {
      const vh = window.innerHeight
      const top = section.getBoundingClientRect().top
      tgt = Math.min(1, Math.max(0, (vh - top) / (vh * 0.65)))
      if (!raf) raf = requestAnimationFrame(loop)
      // back at the very top: keep everything hidden
      if (window.scrollY <= 0) content.classList.remove('reveal-in')
    }

    measure()
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          // only reveal once the user has actually scrolled away from the hero
          if (e.isIntersecting && window.scrollY > 0) content.classList.add('reveal-in')
          else if (!e.isIntersecting && e.boundingClientRect.top > 0)
            content.classList.remove('reveal-in')
        }
      },
      { rootMargin: '0px 0px -40% 0px' },
    )
    io.observe(content)

    return () => {
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
      io.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      {/* ─── HERO ─── */}
      <section id="hero" className="relative overflow-hidden bg-white pt-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pt-16 pb-6 sm:px-6 sm:pt-12 sm:pb-5">
          <img
            src="/slazete_logo_nobg.webp"
            alt="slazete - art commission"
            className="w-full max-w-xs sm:max-w-sm"
          />

          <div className="mt-10 flex items-center justify-center gap-3">
            <a
              href="#order-form"
              className="btn-dark px-7 py-3 font-poppins text-base font-bold shadow-[0_18px_35px_-10px_rgba(10,10,10,0.5)] transition-shadow duration-200 hover:shadow-[0_24px_45px_-10px_rgba(10,10,10,0.55)] sm:px-9 sm:py-3.5 sm:text-xl"
            >
              Order
            </a>
            <a
              href="#prices"
              className="btn-outline border-ink/20 px-7 py-3 font-poppins text-base font-bold shadow-[0_18px_35px_-12px_rgba(10,10,10,0.22)] transition-shadow duration-200 hover:shadow-[0_24px_45px_-12px_rgba(10,10,10,0.3)] sm:px-9 sm:py-3.5 sm:text-xl"
            >
              Price list
            </a>
          </div>

          <div className="mt-4">
            <SocialLinks />
          </div>
        </div>

        <div className="border-t border-ink/10 py-4">
          <div className="flex justify-center gap-10 text-[11px] font-semibold tracking-[0.3em] text-ink/40 uppercase sm:gap-16">
            <span>headshot</span>
            <span>half body</span>
            <span>full body</span>
            <span className="hidden sm:inline">oc · fanart · duo</span>
          </div>
        </div>
      </section>

      {/* ─── ORDER (dark panel w/ doodles + torn edge) ─── */}
      <div ref={sectionRef} className="relative overflow-hidden bg-[#111111] py-20 sm:py-28">
        <img
          ref={guyRef}
          src="/doodle1.webp"
          alt=""
          aria-hidden="true"
          decoding="async"
          style={{ transform: 'translate3d(15vw, 0, 0)', opacity: 0.4 }}
          className="pointer-events-none absolute -top-20 -left-56 w-[24rem] will-change-transform sm:-top-32 sm:-left-96 sm:w-[46rem] lg:w-[62rem]"
        />
        <img
          ref={girlRef}
          src="/doodle2.webp"
          alt=""
          aria-hidden="true"
          decoding="async"
          style={{ transform: 'translate3d(-15vw, 0, 0)', opacity: 0.4 }}
          className="pointer-events-none absolute -top-20 -right-56 w-[24rem] will-change-transform sm:-top-32 sm:-right-96 sm:w-[46rem] lg:w-[62rem]"
        />

        {/* white torn paper edge covering the doodle tops */}
        <svg
          viewBox="0 0 1200 110"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 w-full text-white sm:h-24"
        >
          <path
            fill="currentColor"
            d="M0 0 L1200 0 L1200 12 L1115 22 L1050 20 L985 32 L920 30 L855 44 L790 42 L725 50 L660 60 L600 82 L565 52 L520 58 L460 40 L395 44 L330 28 L265 30 L200 18 L130 22 L70 6 L0 14 Z"
          />
        </svg>

        <div ref={contentRef} className="reveal relative z-10 flex flex-col gap-24">
          <MangaPanel dark center title="Price list" titleImage="/pricelist.webp" id="prices" className="scroll-mt-20">
            <p className="mx-auto -mt-4 mb-10 max-w-xl text-center text-paper/60">
              check the price list, read the terms, then fill the form - your
              order goes straight to my DMs with a ready-made brief.
            </p>
            <PriceTable />
          </MangaPanel>

          <MangaPanel dark center title="Terms of service" titleImage="/TOS.webp" id="terms" className="scroll-mt-20">
            <TermsSection />
          </MangaPanel>

          <MangaPanel dark center title="Order form" id="order-form" className="scroll-mt-20">
            <p className="mx-auto -mt-4 mb-10 max-w-xl text-center text-paper/60">
              fill this in and hit send - pick instagram or tiktok, and your
              order brief is copied ready to paste in the DM.
            </p>
            <OrderForm dark />
          </MangaPanel>
        </div>
      </div>

      {/* ─── CTA banner ─── */}
      <section className="border-t border-paper/10 bg-ink py-20 text-center text-paper">
        <p className="text-xs font-semibold tracking-[0.35em] text-paper/40 uppercase">
          limited slots per batch
        </p>
        <h2 className="mt-3 font-display text-4xl tracking-wide uppercase sm:text-5xl">
          Got a character in mind?
        </h2>
        <a
          href="#order-form"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-paper px-8 py-3 text-sm font-semibold tracking-widest text-ink uppercase transition-colors hover:bg-paper/85"
        >
          Check prices & order
          <ArrowRightIcon className="h-4 w-4" />
        </a>
      </section>
    </>
  )
}
