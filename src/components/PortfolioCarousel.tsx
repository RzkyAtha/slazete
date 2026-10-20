import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  PaintBrushIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { PORTFOLIO, type PortfolioItem } from '../data/portfolio'

const n = PORTFOLIO.length

// spring-like curve approximating the old framer spring (stiffness 260, damping 28)
const CARD_EASE = 'cubic-bezier(0.34, 1.25, 0.64, 1)'
const CARD_TRANSITION = `transform 560ms ${CARD_EASE}, opacity 380ms ease, visibility 560ms`

function CardImage({ item }: { item: PortfolioItem }) {
  if (item.image) {
    return (
      <img
        src={item.image}
        alt={item.title}
        className="h-full w-full object-cover"
        draggable={false}
        decoding="async"
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

function PortfolioCard({
  item,
  active,
  onView,
}: {
  item: PortfolioItem
  active: boolean
  onView: () => void
}) {
  return (
    <div
      className={`relative flex h-[23rem] w-56 flex-col rounded-2xl border bg-white p-3 select-none sm:h-[25rem] sm:w-72 ${
        active ? 'border-ink/15 shadow-[0_24px_50px_-20px_rgba(10,10,10,0.35)]' : 'border-ink/10 shadow-[0_16px_35px_-18px_rgba(10,10,10,0.25)]'
      }`}
    >
      <div className="h-52 overflow-hidden rounded-xl sm:h-56">
        <CardImage item={item} />
      </div>

      <div className="px-2 pt-4">
        <h3 className="text-base font-bold tracking-tight text-ink">{item.title}</h3>
        {item.subtitle && <p className="mt-0.5 text-xs text-ink/45">{item.subtitle}</p>}
      </div>

      <div className="mt-auto px-2 pb-1.5">
        <button
          type="button"
          disabled={!active || !item.image}
          onClick={(e) => {
            e.stopPropagation()
            onView()
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className={`flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-[11px] font-semibold tracking-widest uppercase transition-colors ${
            active
              ? 'cursor-pointer bg-ink text-paper hover:bg-ink/85'
              : 'bg-ink/10 text-ink/40'
          }`}
        >
          <EyeIcon className="h-3.5 w-3.5" />
          View work
        </button>
      </div>
    </div>
  )
}

export default function PortfolioCarousel({ dark = false }: { dark?: boolean }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [lightbox, setLightbox] = useState<PortfolioItem | null>(null)
  const [closing, setClosing] = useState(false)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 640,
  )
  const reducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const drag = useRef<{
    pointerId: number
    startX: number
    dx: number
    el: HTMLDivElement
  } | null>(null)
  const suppressClick = useRef(false)

  const paginate = useCallback((dir: number) => setIndex((i) => (i + dir + n) % n), [])

  const goTo = useCallback((target: number) => setIndex(target), [])

  const closeLightbox = useCallback(() => {
    setClosing(true)
    window.setTimeout(() => {
      setLightbox(null)
      setClosing(false)
    }, 170)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (paused || lightbox || reducedMotion.current || n <= 1) return
    const t = setInterval(() => paginate(1), 5000)
    return () => clearInterval(t)
  }, [paused, lightbox, paginate])

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeLightbox()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, closeLightbox])

  // relative offset of each item from the active index, in [-2, 2]
  const offset = (i: number) => {
    let d = i - index
    if (d > n / 2) d -= n
    if (d < -n / 2) d += n
    return d
  }

  const onDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    drag.current = { pointerId: e.pointerId, startX: e.clientX, dx: 0, el }
    el.style.transition = 'none'
    el.setPointerCapture(e.pointerId)
  }

  const onDragMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d || e.pointerId !== d.pointerId) return
    d.dx = e.clientX - d.startX
    if (Math.abs(d.dx) > 8) suppressClick.current = true
    d.el.style.transform = `translateX(${d.dx * 0.6}px)`
  }

  const onDragEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d || e.pointerId !== d.pointerId) return
    drag.current = null
    d.el.style.transition = ''
    d.el.style.transform = 'translateX(0px)'
    if (d.dx < -80) paginate(1)
    else if (d.dx > 80) paginate(-1)
  }

  const spread = isMobile ? 38 : 66
  const tilt = isMobile ? 7 : 10
  const drop = isMobile ? 18 : 26

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative flex h-[27rem] items-center justify-center overflow-hidden sm:h-[29rem]">
        {PORTFOLIO.map((item, i) => {
          const off = offset(i)
          const isCenter = off === 0
          const hidden = Math.abs(off) > 1
          const transform = hidden
            ? `translateX(${Math.sign(off) * 120}%) rotate(${Math.sign(off) * tilt}deg) scale(0.85)`
            : `translateX(${off * spread}%) rotate(${off * tilt}deg) scale(${isCenter ? 1 : 0.88}) translateY(${isCenter ? 0 : drop}px)`
          return (
            <div
              key={item.id}
              className="absolute will-change-transform"
              style={{
                transform,
                opacity: hidden ? 0 : 1,
                zIndex: isCenter ? 30 : 20 - Math.abs(off),
                visibility: hidden ? 'hidden' : 'visible',
                pointerEvents: hidden ? 'none' : 'auto',
                transition: CARD_TRANSITION,
                cursor: isCenter ? 'grab' : 'pointer',
              }}
              onClick={() => {
                if (suppressClick.current) {
                  suppressClick.current = false
                  return
                }
                if (!isCenter) goTo(i)
              }}
            >
              <div
                className={`h-full transition-transform duration-200 ease-out ${
                  isCenter ? 'touch-pan-y active:cursor-grabbing' : ''
                }`}
                onPointerDown={isCenter ? onDragStart : undefined}
                onPointerMove={isCenter ? onDragMove : undefined}
                onPointerUp={isCenter ? onDragEnd : undefined}
                onPointerCancel={isCenter ? onDragEnd : undefined}
              >
                <PortfolioCard
                  item={item}
                  active={isCenter}
                  onView={() => setLightbox(item)}
                />
              </div>
            </div>
          )
        })}
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

      {/* lightbox */}
      {lightbox && (
        <div
          className={`lightbox-backdrop fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm ${
            closing ? 'lightbox-closing' : ''
          }`}
          onClick={closeLightbox}
        >
          <figure
            className="lightbox-figure relative flex max-h-full flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.image}
              alt={lightbox.title}
              className="max-h-[80vh] max-w-full rounded-lg object-contain shadow-2xl"
              draggable={false}
              decoding="async"
            />
            <figcaption className="text-xs tracking-widest text-paper/70 uppercase">
              {lightbox.title}
              {lightbox.subtitle ? ` - ${lightbox.subtitle}` : ''}
            </figcaption>
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Close preview"
              className="absolute -top-3 -right-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-paper text-ink shadow-lg transition-transform hover:scale-110"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </figure>
        </div>
      )}
    </div>
  )
}
