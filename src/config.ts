// ─── Site config - edit values here ────────────────────────────────

// WhatsApp number in international format, digits only (no +, spaces, or dashes)
// TODO: replace with the artist's real number
export const WHATSAPP_NUMBER = '6281234567890'

export const ARTIST_NAME = 'slazete'

export type SocialIcon = 'instagram' | 'x' | 'tiktok' | 'whatsapp'

// TODO: replace with the artist's real profile URLs
export const SOCIALS: { label: string; icon: SocialIcon; href: string }[] = [
  { label: 'Instagram', icon: 'instagram', href: 'https://instagram.com/slazete' },
  { label: 'X (Twitter)', icon: 'x', href: 'https://x.com/slazete_' },
  { label: 'TikTok', icon: 'tiktok', href: 'https://tiktok.com/@slazete_' },
  { label: 'WhatsApp', icon: 'whatsapp', href: `https://wa.me/${WHATSAPP_NUMBER}` },
]
