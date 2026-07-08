import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { X, ArrowRight, Heart } from 'lucide-react'
import type { Product } from '@/types'
import { GlassPanel, Label } from '@/components/ui'
import { getImageUrl } from '@/lib/getImageUrl'
import { formatFrom } from '@/lib/format'
import { ease } from '@/lib/motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/utils'

/** Glass quick-view: image + key specs + View Product. Rendered in a portal. */
export function QuickViewModal({
  product,
  onClose,
  wishlisted,
  onToggleWishlist,
}: {
  product: Product | null
  onClose: () => void
  wishlisted: boolean
  onToggleWishlist: (id: string) => void
}) {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!product) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [product, onClose])

  const specs = product
    ? [
        { label: 'Texture', value: product.texture },
        product.functions.length
          ? { label: 'Function', value: product.functions.join(', ') }
          : null,
        { label: 'Rooms', value: product.spaces.join(', ') },
      ].filter(Boolean as unknown as (v: unknown) => v is { label: string; value: string })
    : []

  return createPortal(
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-[300] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.div
            className="absolute inset-0 bg-ink/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: ease.entrance }}
            role="dialog"
            aria-modal="true"
            aria-label={`${product.name} quick view`}
            className="relative w-full max-w-3xl"
          >
            <GlassPanel className="grid grid-cols-1 overflow-hidden rounded-t-xl sm:grid-cols-2 sm:rounded-xl">
              {/* image */}
              <div
                className="aspect-[4/3] sm:aspect-auto"
                style={{
                  backgroundColor: 'rgb(var(--ink-rgb) / 0.08)',
                  backgroundImage: `url(${getImageUrl(product.light.day)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              {/* details */}
              <div className="flex flex-col p-7">
                <Label className="text-muted">{product.category}</Label>
                <h3 className="mt-2 font-display text-h2 text-ink">
                  {product.name}
                </h3>
                <p className="mt-1 text-body text-muted">{product.tagline}</p>
                <p className="mt-4 text-h4 text-ink">{formatFrom(product.price)}</p>

                <dl className="mt-6 space-y-2.5 border-t border-line pt-5">
                  {specs.map((s) => (
                    <div key={s.label} className="flex gap-3 text-small">
                      <dt className="w-24 shrink-0 text-muted">{s.label}</dt>
                      <dd className="text-ink">{s.value}</dd>
                    </div>
                  ))}
                  <div className="flex items-center gap-3 text-small">
                    <dt className="w-24 shrink-0 text-muted">Colours</dt>
                    <dd className="flex gap-1.5">
                      {product.colors.map((c) => (
                        <span
                          key={c.name}
                          title={c.name}
                          className="h-4 w-4 rounded-full border border-line"
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </dd>
                  </div>
                </dl>

                <div className="mt-auto flex items-center gap-3 pt-7">
                  <Link
                    to={`/products/${product.slug}`}
                    onClick={onClose}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-small text-bg transition-colors hover:bg-ink/90"
                  >
                    View product
                    <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => onToggleWishlist(product.id)}
                    aria-pressed={wishlisted}
                    aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-ink/[0.05]"
                  >
                    <Heart
                      className={cn('h-4 w-4', wishlisted && 'text-accent')}
                      strokeWidth={1.75}
                      fill={wishlisted ? 'currentColor' : 'none'}
                    />
                  </button>
                </div>
              </div>
            </GlassPanel>

            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface/85 text-ink backdrop-blur transition-colors hover:bg-surface"
            >
              <X className="h-5 w-5" strokeWidth={1.6} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
