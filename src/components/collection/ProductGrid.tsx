import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Product } from '@/types'
import { ProductCard } from './ProductCard'
import { Skeleton } from '@/components/ui'
import { ease } from '@/lib/motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

const PAGE = 8
const GRID = 'grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 xl:grid-cols-4'

function SkeletonGrid() {
  return (
    <div className={GRID}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i}>
          <Skeleton className="aspect-[3/4] rounded-lg" />
          <Skeleton className="mt-3 h-5 w-2/3" />
          <Skeleton className="mt-2 h-4 w-1/3" />
        </div>
      ))}
    </div>
  )
}

/**
 * Product grid with animated re-flow (Framer layout), IntersectionObserver
 * infinite scroll (swap-ready for a paginated API), and skeleton / empty /
 * error states.
 */
export function ProductGrid({
  products,
  isLoading,
  error,
  wishlistHas,
  onToggleWishlist,
  onQuickView,
  onClearFilters,
}: {
  products: Product[]
  isLoading: boolean
  error: Error | null
  wishlistHas: (id: string) => boolean
  onToggleWishlist: (id: string) => void
  onQuickView: (p: Product) => void
  onClearFilters: () => void
}) {
  const reduced = usePrefersReducedMotion()
  const [visible, setVisible] = useState(PAGE)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Reset paging whenever the (memoised) result set changes.
  useEffect(() => setVisible(PAGE), [products])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible((v) => Math.min(products.length, v + PAGE))
      }
    })
    io.observe(el)
    return () => io.disconnect()
  }, [products.length])

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-body text-muted">
          Something went wrong loading these products. Please refresh.
        </p>
      </div>
    )
  }

  if (isLoading) return <SkeletonGrid />

  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-display text-h3 text-ink">Nothing matches — yet.</p>
        <p className="mx-auto mt-3 max-w-sm text-body text-muted">
          Try loosening a filter to see more of the collection.
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-6 text-small text-ink underline underline-offset-4 hover:opacity-70"
        >
          Clear all filters
        </button>
      </div>
    )
  }

  const shown = products.slice(0, visible)
  const hasMore = visible < products.length

  return (
    <>
      <motion.div layout={!reduced} className={GRID}>
        <AnimatePresence mode="popLayout">
          {shown.map((product) => (
            <motion.div
              key={product.id}
              layout={!reduced}
              initial={reduced ? false : { opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              transition={{ duration: reduced ? 0 : 0.35, ease: ease.settle }}
            >
              <ProductCard
                product={product}
                wishlisted={wishlistHas(product.id)}
                onToggleWishlist={onToggleWishlist}
                onQuickView={onQuickView}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {hasMore && (
        <div ref={sentinelRef} className="mt-10">
          <SkeletonGrid />
        </div>
      )}
    </>
  )
}
