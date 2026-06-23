import type { Intention } from '../types'

// The five intentions shown on the "What do you want from your feed today?"
// screen. Each one carries a confirmation message and a target diversity score
// so the feed can visually respond to the choice.
export const intentions: Intention[] = [
  {
    id: 'relax',
    emoji: '🌿',
    title: 'Relax',
    subtitle: 'Calm, easy, low-pressure content',
    message:
      'Got it. Diverge will keep things light — but still slip in a couple of fresh voices so your downtime widens your world a little.',
    targetScore: 52,
  },
  {
    id: 'learn',
    emoji: '💡',
    title: 'Learn something new',
    subtitle: 'Ideas, science, how things work',
    message:
      'Nice. Diverge will lean toward posts that teach you something, drawing from topics outside your usual scroll.',
    targetScore: 74,
  },
  {
    id: 'perspective',
    emoji: '🔄',
    title: 'Understand another perspective',
    subtitle: 'Hear how others see the world',
    message:
      'Brave choice. Diverge will surface viewpoints you might normally skip — shaped by curiosity, not just what you agree with.',
    targetScore: 88,
  },
  {
    id: 'trends',
    emoji: '🔥',
    title: 'Catch up on trends',
    subtitle: "What everyone's talking about",
    message:
      "Sure. Diverge will show you what's popular — and quietly balance it with a few things the trend machine would normally hide.",
    targetScore: 46,
  },
  {
    id: 'explore',
    emoji: '🧭',
    title: 'Explore outside my bubble',
    subtitle: 'Push me somewhere unexpected',
    message:
      'Love it. Diverge is built for exactly this. Your feed has been reshuffled to bring distant topics and opposing views to the front.',
    targetScore: 94,
  },
]
