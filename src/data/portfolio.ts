export interface PortfolioItem {
  id: string
  title: string
  /** small corner tag, e.g. "New!" or "SFW" — optional */
  tag?: string
  /** price-style badge, e.g. "90K" — optional */
  badge?: string
  /**
   * Image path under /public, e.g. "/portfolio/sample-1.png".
   * Leave undefined to show the "illustration soon!" placeholder.
   */
  image?: string
  /** caption shown under the title */
  subtitle?: string
}

// ─── Artist: replace these with real works ─────────────────────────
// Drop images into /public/portfolio/ and set `image` + real titles.
export const PORTFOLIO: PortfolioItem[] = [
  {
    id: 'p1',
    title: 'Sample Work 01',
    tag: 'New!',
    badge: 'FB',
    subtitle: 'full body · detailed bg',
  },
  {
    id: 'p2',
    title: 'Sample Work 02',
    tag: 'Popular',
    badge: 'HB',
    subtitle: 'half body · character art',
  },
  {
    id: 'p3',
    title: 'Sample Work 03',
    badge: 'HS',
    subtitle: 'headshot · bust up',
  },
  {
    id: 'p4',
    title: 'Sample Work 04',
    badge: 'DUO',
    subtitle: '2 characters · couple',
  },
  {
    id: 'p5',
    title: 'Sample Work 05',
    tag: 'Latest',
    badge: 'FB',
    subtitle: 'full body · simple bg',
  },
]
