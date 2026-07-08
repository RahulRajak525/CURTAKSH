import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import type { Collection, Product } from '@/types'
import { useCollection, useProducts, useWishlist } from '@/hooks'
import { Container, Label } from '@/components/ui'
import { pexels } from '@/config/media'
import { CollectionHeader } from '@/components/collection/CollectionHeader'
import { FilterControls } from '@/components/collection/FilterControls'
import { FilterDrawer } from '@/components/collection/FilterDrawer'
import { FilterChips } from '@/components/collection/FilterChips'
import { ProductGrid } from '@/components/collection/ProductGrid'
import { QuickViewModal } from '@/components/collection/QuickViewModal'
import {
  applyProductFilters,
  countActiveFilters,
  deriveFacets,
  emptyFilters,
} from '@/lib/productFilters'
import type { ProductFilters } from '@/lib/productFilters'
import { SORT_OPTIONS } from '@/config/filters'
import type { SortKey } from '@/config/filters'

const titleize = (slug: string) =>
  slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

export function CollectionDetail() {
  const { slug = '' } = useParams()
  const { data: collection, isLoading: colLoading } = useCollection(slug)
  const {
    data: productData,
    isLoading: prodLoading,
    error,
  } = useProducts(collection ? { collectionId: collection.id } : undefined)

  const [filters, setFilters] = useState<ProductFilters>(emptyFilters)
  const [sort, setSort] = useState<SortKey>('new')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [quickView, setQuickView] = useState<Product | null>(null)
  const wishlist = useWishlist()

  // Reset filters when navigating to a different collection.
  useEffect(() => {
    setFilters(emptyFilters())
    setSort('new')
  }, [slug])

  const baseProducts = useMemo(() => productData ?? [], [productData])
  const facets = useMemo(() => deriveFacets(baseProducts), [baseProducts])
  const results = useMemo(
    () => applyProductFilters(baseProducts, filters, sort),
    [baseProducts, filters, sort],
  )

  const activeCount = countActiveFilters(filters, facets.price)
  const loading = colLoading || prodLoading

  // Header falls back to a slug-derived title if the collection isn't a real one.
  const headerCollection: Collection =
    collection ?? {
      id: '',
      slug,
      name: titleize(slug) || 'Collection',
      tagline: 'Browse the range',
      description: 'Explore our curtains, sheers and shades.',
      heroImage: pexels(6207825, 1600),
      productIds: [],
    }

  const clearFilters = () => setFilters(emptyFilters())

  return (
    <>
      <CollectionHeader collection={headerCollection} />

      <Container className="py-12">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-12">
          {/* desktop sticky sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="mb-6 flex items-center justify-between">
                <Label>Filter</Label>
                {activeCount > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-small text-muted underline-offset-4 hover:text-ink hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <FilterControls
                facets={facets}
                filters={filters}
                onChange={setFilters}
              />
            </div>
          </aside>

          <div>
            {/* toolbar */}
            <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
              <p className="text-small text-muted">
                {loading ? 'Loading…' : `${results.length} products`}
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-small text-ink lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" strokeWidth={1.75} />
                  Filters
                  {activeCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[11px] text-bg">
                      {activeCount}
                    </span>
                  )}
                </button>

                <div className="relative">
                  <label htmlFor="sort" className="sr-only">
                    Sort by
                  </label>
                  <select
                    id="sort"
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="appearance-none rounded-full border border-line bg-transparent py-2 pl-4 pr-9 text-small text-ink outline-none focus-visible:border-ink"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.key} value={o.key}>
                        Sort · {o.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                    strokeWidth={1.75}
                  />
                </div>
              </div>
            </div>

            {/* active filter chips */}
            {activeCount > 0 && (
              <div className="pt-4">
                <FilterChips
                  filters={filters}
                  facets={facets}
                  onChange={setFilters}
                  onClear={clearFilters}
                />
              </div>
            )}

            {/* grid */}
            <div className="pt-8">
              <ProductGrid
                products={results}
                isLoading={loading}
                error={error}
                wishlistHas={wishlist.has}
                onToggleWishlist={wishlist.toggle}
                onQuickView={setQuickView}
                onClearFilters={clearFilters}
              />
            </div>
          </div>
        </div>
      </Container>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onClear={clearFilters}
        facets={facets}
        filters={filters}
        onChange={setFilters}
        resultCount={results.length}
      />

      <QuickViewModal
        product={quickView}
        onClose={() => setQuickView(null)}
        wishlisted={quickView ? wishlist.has(quickView.id) : false}
        onToggleWishlist={wishlist.toggle}
      />
    </>
  )
}
