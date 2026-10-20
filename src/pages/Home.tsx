import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import MangaPanel from '../components/MangaPanel'
import PortfolioCarousel from '../components/PortfolioCarousel'

export default function Home() {
  const portfolioRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: portfolioRef,
    offset: ['start end', 'start 0.35'],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 20 })
  const guyX = useTransform(smooth, [0, 1], ['15vw', '0vw'])
  const girlX = useTransform(smooth, [0, 1], ['-15vw', '0vw'])
  const doodleOpacity = useTransform(smooth, [0, 1], [0.45, 0.15])

  return (
    <>
      {/* ─── HERO ─── */}
      <section id="hero" className="relative overflow-hidden bg-white pt-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pt-16 pb-10 sm:px-6 sm:pt-12 sm:pb-8">
          <img
            src="/slazete_logo_nobg.webp"
            alt="slazete — art commission"
            className="w-full max-w-xs sm:max-w-sm"
          />

          <div className="mt-10 flex items-center justify-center gap-3">
            <Link
              to="/order"
              className="btn-dark px-9 py-3.5 font-poppins text-xl font-bold shadow-[0_18px_35px_-10px_rgba(10,10,10,0.5)] transition-shadow duration-200 hover:shadow-[0_24px_45px_-10px_rgba(10,10,10,0.55)]"
            >
              Order
            </Link>
            <a
              href="#portfolio"
              className="btn-outline border-ink/20 px-9 py-3.5 font-poppins text-xl font-bold shadow-[0_18px_35px_-12px_rgba(10,10,10,0.22)] transition-shadow duration-200 hover:shadow-[0_24px_45px_-12px_rgba(10,10,10,0.3)]"
            >
              Portfolio
            </a>
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

      {/* ─── PORTFOLIO ─── */}
      <div ref={portfolioRef} className="halftone-white relative overflow-hidden bg-[#111111] py-20 sm:py-28">
        <motion.img
          src="/guy_doodle.webp"
          alt=""
          aria-hidden="true"
          style={{ x: guyX, opacity: doodleOpacity }}
          className="pointer-events-none absolute -top-6 -left-64 w-[30rem] sm:-top-32 sm:-left-96 sm:w-[46rem] lg:w-[62rem]"
        />
        <motion.img
          src="/girl_doodle.webp"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -top-6 -right-64 w-[30rem] sm:-top-32 sm:-right-96 sm:w-[46rem] lg:w-[62rem]"
          style={{ x: girlX, opacity: doodleOpacity }}
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
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <MangaPanel dark center chapter="01 — Gallery" title="Portfolio" id="portfolio">
            <p className="mx-auto -mt-4 mb-10 max-w-xl text-center text-paper">
              a rotating shelf of past commissions and samples — flip through the stack.
            </p>
            <PortfolioCarousel dark />
          </MangaPanel>
        </motion.div>
      </div>

      {/* ─── CTA banner ─── */}
      <section className="border-t border-paper/10 bg-ink py-20 text-center text-paper">
        <p className="text-xs font-semibold tracking-[0.35em] text-paper/40 uppercase">
          limited slots per batch
        </p>
        <h2 className="mt-3 font-display text-4xl tracking-wide uppercase sm:text-5xl">
          Got a character in mind?
        </h2>
        <Link
          to="/order"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-paper px-8 py-3 text-sm font-semibold tracking-widest text-ink uppercase transition-colors hover:bg-paper/85"
        >
          Check prices & order
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </section>
    </>
  )
}
