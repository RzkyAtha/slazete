export type Currency = 'IDR' | 'USD'

export const CURRENCY: Currency[] = ['IDR', 'USD']

/** IDR values are in thousands (K) - 150 = IDR 150.000. USD values are dollars. */
export interface CommissionType {
  id: string
  label: string
  idr: number
  usd: number
  /** preview image path under /public */
  image?: string
}

export const COMMISSION_TYPES: CommissionType[] = [
  { id: 'headshot', label: 'Headshot / Bust up', idr: 150, usd: 50, image: '/BustUp.png' },
  { id: 'halfbody', label: 'Half body / Thighs up', idr: 300, usd: 70, image: '/HalfBody.png' },
  { id: 'fullbody', label: 'Full body', idr: 500, usd: 90, image: '/FullBody.png' },
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
  },
  {
    id: 'animal',
    label: 'Animal / pet',
    kind: 'range',
    idrMin: 40,
    idrMax: 100,
    usdMin: 8,
    usdMax: 25,
  },
  {
    id: 'accessories',
    label: 'Complex accessories',
    kind: 'range',
    idrMin: 20,
    idrMax: 100,
    usdMin: 5,
    usdMax: 25,
  },
  {
    id: 'private',
    label: 'Private commission',
    kind: 'fixed',
    idr: 50,
    usd: 20,
    hint: 'not posted publicly',
  },
  {
    id: 'psd',
    label: 'PSD file',
    kind: 'fixed',
    idr: 25,
    usd: 10,
  },
  {
    id: 'revision',
    label: 'Extra major revision',
    kind: 'range',
    idrMin: 20,
    idrMax: 50,
    usdMin: 10,
    usdMax: 20,
    hint: '3 revisions already included',
  },
]

/** extra character = +80% of base price, max 5 characters total on one canvas */
export const EXTRA_CHARACTER_RATE = 0.8
export const MAX_CHARACTERS = 5

export const COMMERCIAL_MULTIPLIER = 2
export const RUSH_MULTIPLIER = 1.5

export const WILL_DRAW = ['gore', 'nsfw']

export const WONT_DRAW = ['mecha', 'political', 'weird fetish things']

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
