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
        <span className="flex h-9 w-9 items-center justify-center border-2 border-black bg-black font-display text-xs font-bold uppercase text-white">
          {ad.brand.slice(0, 2)}
        </span>
        <div className="flex-1 leading-tight">
          <span className="font-display text-sm font-bold text-black">
            {ad.handle}
          </span>
          <span className="block font-mono text-[10px] uppercase tracking-widest text-muted">
            Sponsored
          </span>
        </div>
        <button
          onClick={() =>
            showToast({
              message: 'This ad is why the app is free. You are the product.',
            })
          }
          className="p-1 font-mono text-[10px] font-bold uppercase tracking-tight text-muted"
        >
          Why?
        </button>
      </div>

      {/* Creative */}
      <div className="relative aspect-[4/5] w-full select-none border-y-2 border-black">
        <SmartImage src={ad.image} alt={ad.caption} className="h-full w-full" />
        <span className="absolute bottom-2.5 left-2.5 border-2 border-black bg-white px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-tight text-black">
          {ad.tagline}
        </span>
      </div>

      {/* CTA — the loudest element on the card, on purpose. */}
      <button
        onClick={() =>
          showToast({ message: `Opening ${ad.brand}… this click paid for your scroll.` })
        }
        className="flex w-full items-center justify-between border-b-2 border-black bg-brand px-4 py-2.5 font-display text-sm font-bold uppercase tracking-widest text-white transition-transform active:translate-y-0.5"
      >
        {ad.cta}
        <span>→</span>
      </button>

      <div className="px-3.5 pb-4 pt-2">
        <p className="text-sm leading-snug text-black">
          <span className="font-bold">{ad.handle}</span> {ad.caption}
        </p>
      </div>
    </article>
  )
}
