export type Currency = 'IDR' | 'USD'

export const CURRENCY: Currency[] = ['IDR', 'USD']

/** IDR values are in thousands (K) - 150 = IDR 150.000. USD values are dollars. */
export interface ItemStat {
  label: string
  /** 0–100 bar fill */
  value: number
  /** optional text shown instead of the raw number, e.g. "~1–2 wks" */
  display?: string
}

export interface CommissionType {
  id: string
  label: string
  idr: number
  usd: number
  /** preview image path under /public */
  image?: string
  /** small corner badge, e.g. "Type A" / "Popular" */
  badge?: string
  /** one-line description shown on the tier card */
  description?: string
  /** inventory-style stat bars (difficulty / turnaround / coverage) */
  stats?: ItemStat[]
  /** bullet list of what the tier includes */
  features?: string[]
}

export const COMMISSION_TYPES: CommissionType[] = [
  {
    id: 'headshot',
    label: 'Headshot / Bust Up',
    idr: 150,
    usd: 50,
    image: '/HS.webp',
    badge: 'Type A',
    description: 'Head-to-chest focus with high expression detail.',
    stats: [
      { label: 'Difficulty', value: 35 },
      { label: 'Turnaround', value: 25, display: '~1–2 wks' },
      { label: 'Coverage', value: 30 },
    ],
    features: [
      'Head-to-chest framing',
      'High expression detail',
      'Best for icons & profile pics',
    ],
  },
  {
    id: 'halfbody',
    label: 'Half Body / Thighs Up',
    idr: 300,
    usd: 70,
    image: '/HB.webp',
    badge: 'Popular',
    description: 'Head to thighs/waist, perfect for dynamic poses.',
    stats: [
      { label: 'Difficulty', value: 60 },
      { label: 'Turnaround', value: 55, display: '~2–4 wks' },
      { label: 'Coverage', value: 65 },
    ],
    features: [
      'Head to thighs / waist',
      'Dynamic poses & hand gestures',
      'Props stay fully readable',
    ],
  },
  {
    id: 'fullbody',
    label: 'Full Body',
    idr: 500,
    usd: 90,
    image: '/FB.webp',
    badge: 'Type C',
    description: 'Full body complete with detailed outfit and pose.',
    stats: [
      { label: 'Difficulty', value: 85 },
      { label: 'Turnaround', value: 90, display: '~4–6 wks' },
      { label: 'Coverage', value: 100 },
    ],
    features: [
      'Complete outfit & anatomy detail',
      'Full pose composition',
      'Best for character sheets',
    ],
  },
]

export type AddonKind = 'fixed' | 'range'

export interface Addon {
  id: string
  label: string
  kind: AddonKind
  /** fixed price */
  idr?: number
  usd?: number
  /** range price */
  idrMin?: number
  idrMax?: number
  usdMin?: number
  usdMax?: number
  hint?: string
  /** one-line description shown on the extras card */
  description?: string
}

export const ADDONS: Addon[] = [
  {
    id: 'background',
    label: 'Background',
    kind: 'range',
    idrMin: 20,
    idrMax: 100,
    usdMin: 5,
    usdMax: 40,
    hint: 'simple → detailed',
    description: 'Complex background / scenery.',
  },
  {
    id: 'animal',
    label: 'Animal / Pet',
    kind: 'range',
    idrMin: 40,
    idrMax: 100,
    usdMin: 8,
    usdMax: 25,
    description: 'Pets or additional creatures.',
  },
  {
    id: 'accessories',
    label: 'Complex Accessories',
    kind: 'range',
    idrMin: 20,
    idrMax: 100,
    usdMin: 5,
    usdMax: 25,
    description: 'Detailed armor, intricate weapons, wings.',
  },
  {
    id: 'private',
    label: 'Private Commission',
    kind: 'fixed',
    idr: 50,
    usd: 20,
    hint: 'not posted publicly',
    description: 'Final artwork is not published publicly.',
  },
  {
    id: 'psd',
    label: 'PSD Raw File',
    kind: 'fixed',
    idr: 25,
    usd: 10,
    description: 'Raw file with separate layers.',
  },
  {
    id: 'revision',
    label: 'Extra Major Revision',
    kind: 'range',
    idrMin: 20,
    idrMax: 50,
    usdMin: 10,
    usdMax: 20,
    hint: '3 revisions already included',
    description: 'Major revision after the sketch is approved.',
  },
]

export const COMMERCIAL_MULTIPLIER = 2
export const RUSH_MULTIPLIER = 1.5

/** percentage/multiplier surcharges shown alongside add-ons in the extras grid */
export interface PriceModifier {
  id: 'commercial' | 'rush'
  label: string
  description: string
  /** currency-independent display string, e.g. "2× Final Price" */
  display: string
}

export const PRICE_MODIFIERS: PriceModifier[] = [
  {
    id: 'commercial',
    label: 'Commercial Purpose',
    description: 'Merch, book covers, VTuber, albums.',
    display: `${COMMERCIAL_MULTIPLIER}× Final Price`,
  },
  {
    id: 'rush',
    label: 'Rush Order',
    description: 'Fast turnaround (done in as fast as 2 days).',
    display: `+${(RUSH_MULTIPLIER - 1) * 100}% Final Price`,
  },
]

/** extra character = +80% of base price, max 5 characters total on one canvas */
export const EXTRA_CHARACTER_RATE = 0.8
export const MAX_CHARACTERS = 5

/** `highlight` items render as solid white chips, the rest as outline chips */
export interface DrawRule {
  label: string
  highlight?: boolean
}

export const WILL_DRAW: DrawRule[] = [
  { label: 'Gore', highlight: true },
  { label: 'NSFW', highlight: true },
]

export const WONT_DRAW: string[] = ['Mecha', 'Political', 'Weird Fetish Things']

export const TERMS = {
  general: [
    'No cancel or refund after payment',
    'No printing or selling my art without agreement',
    "For international price, I don't use actual conversion rate from IDR - I'm using standard USD commission price based on market",
  ],
  commission: [
    'Comprehensive brief and references are required',
    'Prices stated are base prices - final price will be decided after the sketch is dealt along with estimated completion time',
    'Prices listed are only for personal use - commercial purpose (merch, published books, etc): 2x final price',
    'Rush order is possible with rush fee (+50% final price). Rush orders can be done as early as 2 days (depends on project difficulty)',
    "Free revisions during sketch, 3 maximum revisions after I'm working on your sketch (minor revisions are allowed)",
    'Max. 5 characters in one canvas',
    'Order will be done in 1–6 weeks, depends on the complexity',
    "Artwork progress will be updated tentatively, but I'll make sure you are updated and involved thoroughly during the process",
    'Drawing will be sent through Google Drive link (pdf, jpg and png)',
  ],
  payment: [
    'Full upfront or 50/50 - final half of the payment must be paid maximum 2 days after final artworks are sent',
    'E-wallet, BCA (IDR) or PayPal (USD)',
  ],
}

// ─── price helpers ─────────────────────────────────────────────────

export interface PriceRange {
  min: number
  max: number
}

export function addonRange(addon: Addon, currency: Currency): PriceRange {
  if (addon.kind === 'fixed') {
    const v = currency === 'IDR' ? (addon.idr ?? 0) : (addon.usd ?? 0)
    return { min: v, max: v }
  }
  return currency === 'IDR'
    ? { min: addon.idrMin ?? 0, max: addon.idrMax ?? 0 }
    : { min: addon.usdMin ?? 0, max: addon.usdMax ?? 0 }
}

export function formatPrice(value: number, currency: Currency): string {
  const v = Math.round(value)
  if (currency === 'IDR') {
    return `IDR ${v.toLocaleString('id-ID')}K`
  }
  return `$${v}`
}

export function formatRange(range: PriceRange, currency: Currency): string {
  return range.min === range.max
    ? formatPrice(range.min, currency)
    : `${formatPrice(range.min, currency)} – ${formatPrice(range.max, currency)}`
}

/** total estimate: base + extra characters + add-on ranges, then multipliers */
export function estimateRange(
  base: number,
  extraChars: number,
  addonIds: ReadonlySet<string>,
  currency: Currency,
  commercial: boolean,
  rush: boolean,
): PriceRange {
  let min = base + base * EXTRA_CHARACTER_RATE * extraChars
  let max = min
  for (const a of ADDONS) {
    if (!addonIds.has(a.id)) continue
    const r = addonRange(a, currency)
    min += r.min
    max += r.max
  }
  const mult = (commercial ? COMMERCIAL_MULTIPLIER : 1) * (rush ? RUSH_MULTIPLIER : 1)
  return { min: min * mult, max: max * mult }
}
