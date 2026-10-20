import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PaintBrushIcon,
} from '@heroicons/react/24/outline'
import { PORTFOLIO, type PortfolioItem } from '../data/portfolio'

const n = PORTFOLIO.length

function CardImage({ item }: { item: PortfolioItem }) {
  if (item.image) {
    return (
      <img
        src={item.image}
        alt={item.title}
        className="h-full w-full object-cover"
        draggable={false}
      />
    )
  }
  return (
    <div className="halftone flex h-full w-full flex-col items-center justify-center gap-2.5 bg-neutral-100 text-ink/35">
      <PaintBrushIcon className="h-9 w-9" strokeWidth={1.2} />
      <span className="text-xs tracking-widest uppercase">illustration soon</span>
    </div>
  )
}

function PortfolioCard({ item, active }: { item: PortfolioItem; active: boolean }) {
  return (
    <div
      className={`relative flex h-[23rem] w-56 flex-col rounded-2xl border bg-white p-3 select-none sm:h-[25rem] sm:w-72 ${
        active ? 'border-ink/15 shadow-[0_24px_50px_-20px_rgba(10,10,10,0.35)]' : 'border-ink/10 shadow-[0_16px_35px_-18px_rgba(10,10,10,0.25)]'
      }`}
    >
      {item.tag && (
        <span className="absolute top-4 right-4 z-10 rounded-full bg-ink px-2.5 py-0.5 text-[10px] font-semibold tracking-widest text-paper uppercase">
          {item.tag}
        </span>
      )}

      <div className="h-52 overflow-hidden rounded-xl sm:h-56">
        <CardImage item={item} />
      </div>

      <div className="px-2 pt-4">
        <h3 className="text-base font-bold tracking-tight text-ink">{item.title}</h3>
        {item.subtitle && <p className="mt-0.5 text-xs text-ink/45">{item.subtitle}</p>}
      </div>

      <div className="mt-auto flex items-center justify-between px-2 pb-1.5">
        {item.badge ? (
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/25 font-display text-[10px] tracking-wide text-ink">
            {item.badge}
          </span>
        ) : (
          <span />
        )}
        <span
          className={`text-xs font-semibold tracking-widest uppercase transition-colors ${
            active ? 'text-ink' : 'text-ink/35'
          }`}
        >
          view work →
        </span>
      </div>
    </div>
  )
}

export default function PortfolioCarousel({ dark = false }: { dark?: boolean }) {
  const [[index, direction], setState] = useState<[number, number]>([0, 0])
  const [paused, setPaused] = useState(false)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 640,
  )
  const reducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  const paginate = useCallback((dir: number) => setState(([i]) => [(i + dir + n) % n, dir]), [])

  const goTo = useCallback(
    (target: number) => setState(([i]) => [target, target === i ? 0 : target > i ? 1 : -1]),
    [],
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (paused || reducedMotion.current || n <= 1) return
    const t = setInterval(() => paginate(1), 5000)
    return () => clearInterval(t)
  }, [paused, paginate])

  // relative offset of each item from the active index, in [-2, 2]
  const offset = (i: number) => {
    let d = i - index
    if (d > n / 2) d -= n
    if (d < -n / 2) d += n
    return d
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative flex h-[27rem] items-center justify-center overflow-hidden sm:h-[29rem]">
        <AnimatePresence initial={false} custom={direction}>
          {PORTFOLIO.map((item, i) => {
            const off = offset(i)
            if (Math.abs(off) > 1) return null
            const isCenter = off === 0
            return (
              <motion.div
                key={item.id}
                className="absolute"
                custom={direction}
                initial={{
                  x: direction >= 0 ? '120%' : '-120%',
                  rotate: direction >= 0 ? 10 : -10,
                  scale: 0.85,
                  opacity: 0,
                }}
                animate={{
                  x: `${off * (isMobile ? 38 : 66)}%`,
                  rotate: off * (isMobile ? 7 : 10),
                  scale: isCenter ? 1 : 0.88,
                  opacity: 1,
                  y: isCenter ? 0 : isMobile ? 18 : 26,
                  zIndex: isCenter ? 30 : 20 - Math.abs(off),
                }}
                exit={{
                  x: direction >= 0 ? '-120%' : '120%',
                  rotate: direction >= 0 ? -10 : 10,
                  scale: 0.85,
                  opacity: 0,
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                drag={isCenter ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) paginate(1)
                  else if (info.offset.x > 80) paginate(-1)
                }}
                onClick={() => !isCenter && goTo(i)}
                style={{ cursor: isCenter ? 'grab' : 'pointer' }}
              >
                <PortfolioCard item={item} active={isCenter} />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* controls */}
      <div className="mt-4 flex items-center justify-center gap-6">
        <button
          onClick={() => paginate(-1)}
          aria-label="Previous artwork"
          className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition-colors ${
            dark
              ? 'border-paper/25 text-paper hover:bg-paper hover:text-ink'
              : 'border-ink/20 text-ink hover:bg-ink hover:text-paper'
          }`}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <div className="flex gap-2">
          {PORTFOLIO.map((item, i) => (
            <button
              key={item.id}
              onClick={() => goTo(i)}
              aria-label={`Go to ${item.title}`}
              className={`h-1.5 cursor-pointer rounded-full transition-all duration-200 ${
                i === index
                  ? `w-6 ${dark ? 'bg-paper' : 'bg-ink'}`
                  : `w-1.5 ${dark ? 'bg-paper/25 hover:bg-paper/50' : 'bg-ink/20 hover:bg-ink/40'}`
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => paginate(1)}
          aria-label="Next artwork"
          className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition-colors ${
            dark
              ? 'border-paper/25 text-paper hover:bg-paper hover:text-ink'
              : 'border-ink/20 text-ink hover:bg-ink hover:text-paper'
          }`}
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
