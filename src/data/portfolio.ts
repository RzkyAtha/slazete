export interface PortfolioItem {
  id: string
  title: string
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
    subtitle: 'full body · detailed bg',
    image: '/sample%202.png',
  },
  {
    id: 'p2',
    title: 'Sample Work 02',
    subtitle: 'half body · character art',
    image: '/sample%204.png',
  },
  {
    id: 'p3',
    title: 'Sample Work 03',
    subtitle: 'headshot · bust up',
    image: '/sample%203.png',
  },
  {
    id: 'p4',
    title: 'Sample Work 04',
    subtitle: '2 characters · couple',
    image: '/sample%201.png',
  },
  {
    id: 'p5',
    title: 'Sample Work 05',
    subtitle: 'full body · simple bg',
    image: '/sample%205.png',
  },
]
