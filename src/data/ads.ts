// ---------------------------------------------------------------------------
// Fake sponsored posts for the attention-funded model. All brands invented.
// These only ever appear when advertisers are the ones paying for the app.
// ---------------------------------------------------------------------------

export interface Ad {
  id: string
  brand: string
  handle: string
  tagline: string
  caption: string
  image: string
  cta: string
}

const photo = (seed: string) => `https://picsum.photos/seed/${seed}/800/1000`

export const ads: Ad[] = [
  {
    id: 'ad1',
    brand: 'GlowFizz',
    handle: 'glowfizz.energy',
    tagline: 'Sparkling energy water',
    caption:
      'that 3pm crash? gone. ✨ GlowFizz keeps you going so you never have to stop. 40% off with code SCROLL40 — today only ⏰',
    image: photo('divadfizz'),
    cta: 'Shop now',
  },
  {
    id: 'ad2',
    brand: 'SnapKicks',
    handle: 'snapkicks',
    tagline: 'Drops every Friday',
    caption:
      'the drop everyone on your feed is wearing 🔥 restocked once. when they’re gone, they’re gone.',
    image: photo('divadkicks'),
    cta: 'Get yours',
  },
  {
    id: 'ad3',
    brand: 'LumaPhone',
    handle: 'lumaphone',
    tagline: 'The camera that never sleeps',
    caption:
      'your memories deserve 200 megapixels. trade in today — your friends already did 📸',
    image: photo('divadphone'),
    cta: 'Trade in',
  },
]
