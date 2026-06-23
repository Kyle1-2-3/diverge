import { useState } from 'react'

interface SmartImageProps {
  src: string
  /** Tailwind gradient classes shown while loading or if the photo fails. */
  gradient: string
  /** Big emoji shown on the gradient fallback. */
  emoji: string
  alt: string
  className?: string
}

/**
 * Loads a real photo with a graceful fallback: the gradient + emoji shows while
 * the image loads, and stays if the device is offline or the photo 404s.
 * This keeps the app beautiful and reliable for a live demo.
 */
export default function SmartImage({
  src,
  gradient,
  emoji,
  alt,
  className = '',
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Gradient + emoji layer (fallback / loading state). */}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${gradient} transition-opacity duration-500 ${
          loaded && !failed ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <span className="text-7xl drop-shadow-lg">{emoji}</span>
      </div>

      {/* The real photo. */}
      {!failed && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  )
}
