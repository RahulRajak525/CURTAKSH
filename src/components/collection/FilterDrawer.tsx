import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { Facets, ProductFilters } from '@/lib/productFilters'
import { FilterControls } from './FilterControls'
import { Button } from '@/components/ui'
import { ease } from '@/lib/motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/** Mobile bottom-sheet filter drawer — slides up from the bottom. */
export function FilterDrawer({
  open,
  onClose,
  onClear,
  facets,
  filters,
  onChange,
  resultCount,
}: {
  open: boolean
  onClose: () => void
  onClear: () => void
  facets: Facets
  filters: ProductFilters
  onChange: (next: ProductFilters) => void
  resultCount: number
}) {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          <motion.div
            className="absolute inset-0 bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-xl border-t border-line bg-bg"
            initial={reduced ? { opacity: 0 } : { y: '100%' }}
            animate={reduced ? { opacity: 1 } : { y: 0 }}
            exit={reduced ? { opacity: 0 } : { y: '100%' }}
            transition={{ duration: 0.4, ease: ease.entrance }}
            role="dialog"
            aria-label="Filters"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="font-display text-h4 text-ink">Filters</span>
              <button
                type="button"
                aria-label="Close filters"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-ink/[0.06]"
              >
                <X className="h-5 w-5" strokeWidth={1.6} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              <FilterControls facets={facets} filters={filters} onChange={onChange} />
            </div>

            <div className="flex items-center gap-3 border-t border-line px-5 py-4">
              <button
                type="button"
                onClick={onClear}
                className="text-small text-muted underline-offset-4 hover:text-ink hover:underline"
              >
                Clear all
              </button>
              <Button variant="solid" className="flex-1" onClick={onClose}>
                Show {resultCount} {resultCount === 1 ? 'result' : 'results'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
