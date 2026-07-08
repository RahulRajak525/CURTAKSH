import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { X, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react'
import type { LookScene, Product } from '@/types'
import { Label } from '@/components/ui'
import { getImageUrl } from '@/lib/getImageUrl'
import { ease } from '@/lib/motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/** Fullscreen lightbox for a lookbook scene with "shop the shot" product links. */
export function Lightbox({
  look,
  productsById,
  onClose,
  onNav,
}: {
  look: LookScene | null
  productsById: Map<string, Product>
  onClose: () => void
  onNav: (dir: number) => void
}) {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!look) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onNav(-1)
      if (e.key === 'ArrowRight') onNav(1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [look, onClose, onNav])

  const featured = look
    ? look.productIds.map((id) => productsById.get(id)).filter(Boolean)
    : []

  return createPortal(
    <AnimatePresence>
      {look && (
        <motion.div
          className="fixed inset-0 z-[300] flex flex-col bg-ink/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label={look.title}
        >
          <div className="flex items-center justify-between p-4">
            <Label className="text-white/70">
              {look.room} · {look.style}
            </Label>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" strokeWidth={1.6} />
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center gap-3 px-3 pb-3 sm:gap-6 sm:px-6">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => onNav(-1)}
              className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:flex"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.75} />
            </button>

            <motion.div
              key={look.id}
              initial={reduced ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: ease.entrance }}
              className="flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-lg"
            >
              <img
                src={getImageUrl(look.image)}
                alt={look.alt}
                className="max-h-[62vh] w-full bg-surface object-cover"
              />
              <div className="flex flex-wrap items-center gap-3 bg-bg p-4">
                <span className="font-display text-h4 text-ink">{look.title}</span>
                <span className="text-small text-muted">Shop the shot:</span>
                {featured.map(
                  (p) =>
                    p && (
                      <Link
                        key={p.id}
                        to={`/products/${p.slug}`}
                        onClick={onClose}
                        className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1 text-small text-ink transition-colors hover:border-ink"
                      >
                        {p.name}
                        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </Link>
                    ),
                )}
              </div>
            </motion.div>

            <button
              type="button"
              aria-label="Next"
              onClick={() => onNav(1)}
              className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:flex"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
