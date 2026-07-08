import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sun, Moon, Heart, Plus } from 'lucide-react'
import type { Product } from '@/types'
import { getImageUrl } from '@/lib/getImageUrl'
import { formatFrom } from '@/lib/format'
import { cn } from '@/lib/utils'

export function ProductCard({
  product,
  wishlisted,
  onToggleWishlist,
  onQuickView,
}: {
  product: Product
  wishlisted: boolean
  onToggleWishlist: (id: string) => void
  onQuickView: (product: Product) => void
}) {
  const [night, setNight] = useState(false)
  const [tint, setTint] = useState<string | null>(null)

  const image = night ? product.light.night : product.light.day

  return (
    <div className="group relative flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-line shadow-soft transition-shadow duration-base ease-settle group-hover:shadow-glow">
        {/* product render (day / night) */}
        <div
          className="absolute inset-0 transition-transform duration-cinematic ease-settle group-hover:scale-[1.04]"
          style={{
            backgroundColor: 'rgb(var(--ink-rgb) / 0.06)',
            backgroundImage: `url(${getImageUrl(image)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* swatch preview tint */}
        {tint && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 mix-blend-multiply transition-opacity"
            style={{ backgroundColor: tint, opacity: 0.55 }}
          />
        )}
        {/* light-sweep on hover */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full opacity-0 transition-all duration-cinematic ease-settle group-hover:translate-x-0 group-hover:opacity-100"
          style={{
            background:
              'linear-gradient(105deg, transparent 30%, rgb(var(--glow-rgb) / 0.4) 50%, transparent 70%)',
          }}
        />

        {/* stretched link (primary target) */}
        <Link
          to={`/products/${product.slug}`}
          aria-label={product.name}
          className="absolute inset-0 z-0"
        />

        {/* day / night toggle */}
        <button
          type="button"
          onClick={() => setNight((n) => !n)}
          aria-pressed={night}
          aria-label={night ? 'Show in daylight' : 'Show at night'}
          title={night ? 'Daylight' : 'Night'}
          className="absolute left-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface/85 text-ink backdrop-blur transition-colors hover:bg-surface"
        >
          {night ? (
            <Moon className="h-4 w-4" strokeWidth={1.75} />
          ) : (
            <Sun className="h-4 w-4" strokeWidth={1.75} />
          )}
        </button>

        {/* wishlist heart */}
        <button
          type="button"
          onClick={() => onToggleWishlist(product.id)}
          aria-pressed={wishlisted}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface/85 text-ink backdrop-blur transition-colors hover:bg-surface"
        >
          <Heart
            className={cn('h-4 w-4', wishlisted && 'text-accent')}
            strokeWidth={1.75}
            fill={wishlisted ? 'currentColor' : 'none'}
          />
        </button>

        {/* quick view */}
        <button
          type="button"
          onClick={() => onQuickView(product)}
          className="absolute inset-x-3 bottom-3 z-10 flex items-center justify-center gap-1.5 rounded-full bg-ink/90 py-2.5 text-small text-bg opacity-0 backdrop-blur transition-all duration-base ease-settle group-hover:opacity-100"
        >
          <Plus className="h-4 w-4" strokeWidth={1.75} />
          Quick view
        </button>
      </div>

      {/* meta */}
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <Link
            to={`/products/${product.slug}`}
            className="font-display text-h4 text-ink transition-colors hover:text-ink/70"
          >
            {product.name}
          </Link>
          <p className="mt-0.5 text-small text-muted">{product.tagline}</p>
        </div>
        {/* swatch dots — hover to preview */}
        <div className="mt-1 flex shrink-0 gap-1">
          {product.colors.map((c) => (
            <button
              key={c.name}
              type="button"
              aria-label={`Preview ${c.name}`}
              onMouseEnter={() => setTint(c.hex)}
              onMouseLeave={() => setTint(null)}
              onFocus={() => setTint(c.hex)}
              onBlur={() => setTint(null)}
              className="h-4 w-4 rounded-full border border-line transition-transform hover:scale-125"
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>
      <p className="mt-1.5 text-small text-ink">{formatFrom(product.price)}</p>
    </div>
  )
}
