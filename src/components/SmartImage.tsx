import { useState } from 'react'

interface SmartImageProps {
  src: string
  alt: string
  className?: string
}

/**
 * Loads a real photo with a graceful, on-brand fallback: a flat neutral block
 * shows while the image loads and stays if the device is offline or the photo
 * 404s. No rainbow gradients, no emoji — it stays quiet like the rest.
 */
export default function SmartImage({
  src,
  alt,
  className = '',
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  return (
    <div className={`relative overflow-hidden bg-hairline ${className}`}>
      {/* Flat fallback / loading state. */}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-hairline transition-opacity duration-300 ${
          loaded && !failed ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {failed && (
          <span className="text-[11px] font-medium text-faint">No image</span>
        )}
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
