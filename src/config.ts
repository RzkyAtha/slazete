// ─── Site config - edit values here ────────────────────────────────

// WhatsApp number in international format, digits only (no +, spaces, or dashes)
// TODO: replace with the artist's real number
export const WHATSAPP_NUMBER = '6281234567890'

export const ARTIST_NAME = 'slazete'

// commission orders go to DMs - no prefill API exists, so the brief is
// copied to clipboard and the DM/profile is opened for pasting
export const INSTAGRAM_DM_URL = 'https://ig.me/m/slazete'
export const TIKTOK_PROFILE_URL = 'https://tiktok.com/@slazete_'

export type SocialIcon = 'instagram' | 'x' | 'tiktok' | 'whatsapp'

// TODO: replace with the artist's real profile URLs
export const SOCIALS: { label: string; icon: SocialIcon; href: string }[] = [
  { label: 'Instagram', icon: 'instagram', href: 'https://instagram.com/slazete' },
  { label: 'X (Twitter)', icon: 'x', href: 'https://x.com/slazete_' },
  { label: 'TikTok', icon: 'tiktok', href: 'https://tiktok.com/@slazete_' },
  { label: 'WhatsApp', icon: 'whatsapp', href: `https://wa.me/${WHATSAPP_NUMBER}` },
]
