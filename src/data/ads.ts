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
    id: 'ad4',
    brand: 'HaulHub',
    handle: 'haulhub',
    tagline: 'New drops daily',
    caption:
      '2,000 new styles added TODAY 🛍️ if your fit isn’t from this week, is it even a fit? free shipping ends tonight ⏰',
    image: photo('divadhaul'),
    cta: 'Shop the haul',
  },
  {
    id: 'ad5',
    brand: 'BingeBox',
    handle: 'bingebox',
    tagline: 'Season 4 just dropped',
    caption:
      'all 10 episodes. right now. you weren’t doing anything tomorrow anyway 📺 first month free.',
    image: photo('divadbinge'),
    cta: 'Start watching',
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
  {
    id: 'ad6',
    brand: 'CrunchQuest',
    handle: 'crunchquest.game',
    tagline: 'Just one more level',
    caption:
      'your daily bonus expires in 2 hours ⏰ 50 free spins if you log in NOW. everyone in your area is playing 🎮',
    image: photo('divadgame'),
    cta: 'Play free',
  },
  {
    id: 'ad7',
    brand: 'SipCity',
    handle: 'sipcity.delivery',
    tagline: 'Bubble tea in 15 min',
    caption:
      'craving hits at 11pm? we know. we literally know 🧋 first order free — tonight only.',
    image: photo('divadboba'),
    cta: 'Order now',
  },
  {
    id: 'ad8',
    brand: 'FitStreak',
    handle: 'fitstreak.app',
    tagline: 'Don’t break the chain',
    caption:
      'day 1 is easy. day 100 is who you become 💪 your friends can see your streak — can they see you quit?',
    image: photo('divadfit'),
    cta: 'Start streak',
  },
  {
    id: 'ad9',
    brand: 'GlossDrop',
    handle: 'glossdrop',
    tagline: 'As seen everywhere',
    caption:
      'the lip oil your feed won’t shut up about 💋 back in stock for 24 hours. after that? who knows.',
    image: photo('divadgloss'),
    cta: 'Get it first',
  },
]
