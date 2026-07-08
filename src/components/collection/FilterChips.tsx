import { X } from 'lucide-react'
import type { Facets, ProductFilters } from '@/lib/productFilters'

type Chip = { key: string; label: string; remove: () => void }

const inr = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n)

/** Removable chips for every active filter, plus Clear all. */
export function FilterChips({
  filters,
  facets,
  onChange,
  onClear,
}: {
  filters: ProductFilters
  facets: Facets
  onChange: (next: ProductFilters) => void
  onClear: () => void
}) {
  const remove = (field: 'textures' | 'functions' | 'spaces' | 'colours', v: string) =>
    onChange({ ...filters, [field]: filters[field].filter((x) => x !== v) })

  const chips: Chip[] = [
    ...filters.textures.map((v) => ({ key: `t-${v}`, label: v, remove: () => remove('textures', v) })),
    ...filters.functions.map((v) => ({ key: `f-${v}`, label: v, remove: () => remove('functions', v) })),
    ...filters.spaces.map((v) => ({ key: `s-${v}`, label: v, remove: () => remove('spaces', v) })),
    ...filters.colours.map((v) => ({ key: `c-${v}`, label: v, remove: () => remove('colours', v) })),
  ]

  const priceNarrowed =
    (filters.priceMin !== undefined && filters.priceMin > facets.price.min) ||
    (filters.priceMax !== undefined && filters.priceMax < facets.price.max)
  if (priceNarrowed) {
    chips.push({
      key: 'price',
      label: `${inr(filters.priceMin ?? facets.price.min)} – ${inr(filters.priceMax ?? facets.price.max)}`,
      remove: () => onChange({ ...filters, priceMin: undefined, priceMax: undefined }),
    })
  }

  if (!chips.length) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.remove}
          className="group inline-flex items-center gap-1.5 rounded-full border border-line py-1 pl-3 pr-2 text-small text-ink transition-colors hover:border-ink"
        >
          {chip.label}
          <X className="h-3.5 w-3.5 text-muted transition-colors group-hover:text-ink" strokeWidth={2} />
        </button>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="ml-1 text-small text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
      >
        Clear all
      </button>
    </div>
  )
}
