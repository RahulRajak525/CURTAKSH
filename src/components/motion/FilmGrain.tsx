import { useMemo } from 'react'

/**
 * A fine film-grain / noise overlay fixed over the whole app at low opacity.
 * Generated inline via SVG feTurbulence (no asset request), blended so it reads
 * as tactile grain on both light and dark phases.
 */
export function FilmGrain({ opacity = 0.05 }: { opacity?: number }) {
  const url = useMemo(() => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'>
      <filter id='grain'>
        <feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/>
        <feColorMatrix type='saturate' values='0'/>
      </filter>
      <rect width='100%' height='100%' filter='url(#grain)'/>
    </svg>`
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] mix-blend-overlay"
      style={{
        backgroundImage: url,
        backgroundSize: '140px 140px',
        opacity,
      }}
    />
  )
}
