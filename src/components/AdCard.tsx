import type { Ad } from '../data/ads'
import { useInteractions } from '../state/interactions'
import SmartImage from './SmartImage'

interface AdCardProps {
  ad: Ad
}

/**
 * A sponsored post — the attention model's reason for existing. Styled to
 * blend into the feed the way real ads do: same card anatomy, a quiet
 * "Sponsored" label, and a loud call-to-action in the brand accent.
 */
export default function AdCard({ ad }: AdCardProps) {
  const { showToast } = useInteractions()

  return (
    <article className="animate-fade-up bg-white">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3.5 py-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-xs font-semibold uppercase text-white">
          {ad.brand.slice(0, 2)}
        </span>
        <div className="flex-1 leading-tight">
          <span className="text-sm font-semibold text-ink">{ad.handle}</span>
          <span className="block text-[11px] text-faint">Sponsored</span>
        </div>
        <button
          onClick={() =>
            showToast({
              message: 'This ad is why the app is free. You are the product.',
            })
          }
          className="p-1 text-[11px] font-medium text-faint"
        >
          Why?
        </button>
      </div>

      {/* Creative */}
      <div className="relative aspect-[4/5] w-full select-none">
        <SmartImage src={ad.image} alt={ad.caption} className="h-full w-full" />
        <span className="absolute bottom-2.5 left-2.5 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-medium text-ink">
          {ad.tagline}
        </span>
      </div>

      {/* CTA — the loudest element on the card, on purpose. */}
      <button
        onClick={() =>
          showToast({ message: `Opening ${ad.brand}… this click paid for your scroll.` })
        }
        className="flex w-full items-center justify-between bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-transform active:scale-[0.98]"
      >
        {ad.cta}
        <span>→</span>
      </button>

      <div className="px-3.5 pb-4 pt-2">
        <p className="text-sm leading-snug text-ink">
          <span className="font-semibold">{ad.handle}</span> {ad.caption}
        </p>
      </div>
    </article>
  )
}
