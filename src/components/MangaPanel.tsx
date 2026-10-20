import type { ReactNode } from 'react'

interface Props {
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
        <h2
          className={`font-display text-4xl tracking-wide uppercase sm:text-5xl ${
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
