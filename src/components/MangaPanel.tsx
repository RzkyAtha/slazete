import type { ReactNode } from 'react'

interface Props {
  /** e.g. "01" */
  chapter?: string
  title: string
  children: ReactNode
  id?: string
  className?: string
  /** render header for dark backgrounds */
  dark?: boolean
  /** center the section header */
  center?: boolean
}

export default function MangaPanel({
  chapter,
  title,
  children,
  id,
  className = '',
  dark = false,
  center = false,
}: Props) {
  return (
    <section id={id} className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>
      <div className={`mb-10 ${center ? 'text-center' : ''}`}>
        {chapter && (
          <p className={`eyebrow ${dark ? '!text-paper' : ''}`}>{chapter}</p>
        )}
        <h2
          className={`mt-2 font-display text-4xl tracking-wide uppercase sm:text-5xl ${
            dark ? 'text-paper' : 'text-ink'
          }`}
        >
          {title}
        </h2>
        <div
          className={`mt-5 h-px w-full ${dark ? 'bg-paper/15' : 'bg-ink/10'} ${
            center ? 'mx-auto max-w-24' : ''
          }`}
        />
      </div>
      {children}
    </section>
  )
}
