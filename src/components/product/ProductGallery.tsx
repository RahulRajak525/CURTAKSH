import { useRef, useState } from 'react'
import { Sun, Sunset, Moon, Scissors } from 'lucide-react'
import type { Product } from '@/types'
import { useLightStore } from '@/store/lightStore'
import { getImageUrl } from '@/lib/getImageUrl'
import { clamp, cn } from '@/lib/utils'
import { ProductDrapeReveal } from './ProductDrapeReveal'

type View = 'light' | 'reveal'

const LIGHT_STOPS = [
  { key: 'day', label: 'Day', phase: 0.33, Icon: Sun },
  { key: 'dusk', label: 'Dusk', phase: 0.66, Icon: Sunset },
  { key: 'night', label: 'Night', phase: 1, Icon: Moon },
] as const

/**
 * Product gallery. The main render is tied to the global lightPhase: the day and
 * night images crossfade as the scrubber (or the "View in your light" control)
 * moves, with a dusk warmth wash and lining-driven night darkening. Zoom on
 * hover. A "Drape reveal" view lets the shopper pull the curtain across a window.
 */
export function ProductGallery({
  product,
  colorHex,
  block,
}: {
  product: Product
  colorHex: string
  block: number
}) {
  const phase = useLightStore((s) => s.lightPhase)
  const setLightPhase = useLightStore((s) => s.setLightPhase)
  const [view, setView] = useState<View>('light')
  const zoomRef = useRef<HTMLDivElement>(null)

  // crossfade + wash factors from the light phase
  const nightOpacity = clamp((phase - 0.4) / 0.6, 0, 1)
  const warmth = clamp(1 - Math.abs(phase - 0.66) / 0.34, 0, 1)
  const activeStop = phase < 0.5 ? 'day' : phase < 0.84 ? 'dusk' : 'night'

  const onZoomMove = (e: React.MouseEvent) => {
    const el = zoomRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    el.style.transformOrigin = `${x}% ${y}%`
    el.style.transform = 'scale(1.6)'
  }
  const onZoomLeave = () => {
    if (zoomRef.current) zoomRef.current.style.transform = 'scale(1)'
  }

  const layer = (src: string, extra?: React.CSSProperties): React.CSSProperties => ({
    backgroundColor: 'rgb(var(--ink-rgb) / 0.06)',
    backgroundImage: `url(${getImageUrl(src)})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    ...extra,
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-line shadow-soft">
        {view === 'light' ? (
          <div
            onMouseMove={onZoomMove}
            onMouseLeave={onZoomLeave}
            className="absolute inset-0 cursor-zoom-in"
          >
            <div
              ref={zoomRef}
              className="absolute inset-0 transition-transform duration-500 ease-settle"
            >
              {/* day render */}
              <div className="absolute inset-0" style={layer(product.light.day)} />
              {/* night render crossfaded in */}
              <div
                className="absolute inset-0"
                style={layer(product.light.night, { opacity: nightOpacity })}
              />
              {/* colour tint */}
              <div
                aria-hidden
                className="absolute inset-0 mix-blend-multiply"
                style={{ backgroundColor: colorHex, opacity: 0.5 }}
              />
              {/* dusk warmth */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(90% 80% at 50% 35%, rgb(var(--glow-rgb) / 0.55), transparent 60%)',
                  opacity: warmth * 0.6,
                }}
              />
              {/* lining darkening at night */}
              <div
                aria-hidden
                className="absolute inset-0 bg-black"
                style={{ opacity: nightOpacity * block * 0.72 }}
              />
            </div>
          </div>
        ) : (
          <ProductDrapeReveal colorHex={colorHex} block={block} />
        )}

        {/* view tabs */}
        <div className="absolute left-3 top-3 flex gap-1 rounded-full bg-surface/80 p-1 backdrop-blur">
          <button
            type="button"
            onClick={() => setView('light')}
            aria-pressed={view === 'light'}
            className={cn(
              'rounded-full px-3 py-1 text-[11px] transition-colors',
              view === 'light' ? 'bg-ink text-bg' : 'text-ink',
            )}
          >
            In your light
          </button>
          <button
            type="button"
            onClick={() => setView('reveal')}
            aria-pressed={view === 'reveal'}
            className={cn(
              'flex items-center gap-1 rounded-full px-3 py-1 text-[11px] transition-colors',
              view === 'reveal' ? 'bg-ink text-bg' : 'text-ink',
            )}
          >
            <Scissors className="h-3 w-3" strokeWidth={1.75} />
            Drape reveal
          </button>
        </div>
      </div>

      {/* View in your light */}
      <div className="flex items-center justify-between gap-4">
        <span className="label text-muted">View in your light</span>
        <div className="flex gap-1 rounded-full border border-line p-1">
          {LIGHT_STOPS.map(({ key, label, phase: p, Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setLightPhase(p)
                setView('light')
              }}
              aria-pressed={activeStop === key}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-small transition-colors',
                activeStop === key ? 'bg-ink text-bg' : 'text-muted hover:text-ink',
              )}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* thumbnails */}
      <div className="flex gap-3">
        {product.images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => {
              setLightPhase(i === 0 ? 0.33 : 1)
              setView('light')
            }}
            className="h-20 w-16 shrink-0 overflow-hidden rounded-md border border-line transition-colors hover:border-ink"
            style={layer(img.src)}
            aria-label={img.alt}
          />
        ))}
      </div>
    </div>
  )
}
