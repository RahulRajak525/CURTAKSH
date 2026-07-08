import type { Facets, ProductFilters } from '@/lib/productFilters'
import { FACET_LABELS } from '@/config/filters'
import { Label } from '@/components/ui'
import { cn } from '@/lib/utils'

type ListField = 'textures' | 'functions' | 'spaces'

const inr = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n)

function FacetGroup({
  title,
  values,
  selected,
  onToggle,
}: {
  title: string
  values: { value: string; count: number }[]
  selected: string[]
  onToggle: (v: string) => void
}) {
  if (!values.length) return null
  return (
    <fieldset>
      <Label as="legend" className="mb-3 block">
        {title}
      </Label>
      <div className="flex flex-col gap-1">
        {values.map((f) => {
          const on = selected.includes(f.value)
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => onToggle(f.value)}
              aria-pressed={on}
              className="group flex items-center justify-between rounded-md px-2 py-1.5 text-left text-small transition-colors hover:bg-ink/[0.04]"
            >
              <span className="flex items-center gap-2.5">
                <span
                  className={cn(
                    'flex h-4 w-4 items-center justify-center rounded-sm border transition-colors',
                    on ? 'border-ink bg-ink text-bg' : 'border-line',
                  )}
                >
                  {on && (
                    <svg viewBox="0 0 10 10" className="h-2.5 w-2.5" fill="none">
                      <path
                        d="M1 5l2.5 2.5L9 2"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span className={on ? 'text-ink' : 'text-muted'}>{f.value}</span>
              </span>
              <span className="text-small text-muted/50">{f.count}</span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

/** Shared filter form. Stateless — the page owns `filters` and passes changes up. */
export function FilterControls({
  facets,
  filters,
  onChange,
}: {
  facets: Facets
  filters: ProductFilters
  onChange: (next: ProductFilters) => void
}) {
  const toggle = (field: ListField | 'colours', value: string) => {
    const cur = filters[field]
    const next = cur.includes(value)
      ? cur.filter((v) => v !== value)
      : [...cur, value]
    onChange({ ...filters, [field]: next })
  }

  const min = facets.price.min
  const max = facets.price.max
  const curMin = filters.priceMin ?? min
  const curMax = filters.priceMax ?? max

  return (
    <div className="flex flex-col gap-8">
      <FacetGroup
        title={FACET_LABELS.texture}
        values={facets.textures}
        selected={filters.textures}
        onToggle={(v) => toggle('textures', v)}
      />
      <FacetGroup
        title={FACET_LABELS.function}
        values={facets.functions}
        selected={filters.functions}
        onToggle={(v) => toggle('functions', v)}
      />
      <FacetGroup
        title={FACET_LABELS.space}
        values={facets.spaces}
        selected={filters.spaces}
        onToggle={(v) => toggle('spaces', v)}
      />

      {/* Colour */}
      {facets.colours.length > 0 && (
        <fieldset>
          <Label as="legend" className="mb-3 block">
            {FACET_LABELS.colour}
          </Label>
          <div className="flex flex-wrap gap-2.5">
            {facets.colours.map((c) => {
              const on = filters.colours.includes(c.name)
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => toggle('colours', c.name)}
                  aria-pressed={on}
                  title={`${c.name} (${c.count})`}
                  aria-label={c.name}
                  className={cn(
                    'h-7 w-7 rounded-full border transition-transform',
                    on
                      ? 'border-ink ring-2 ring-ink ring-offset-2 ring-offset-bg'
                      : 'border-line hover:scale-110',
                  )}
                  style={{ backgroundColor: c.hex }}
                />
              )
            })}
          </div>
        </fieldset>
      )}

      {/* Price */}
      {max > min && (
        <fieldset>
          <Label as="legend" className="mb-3 block">
            {FACET_LABELS.price}
          </Label>
          <div className="flex items-center justify-between text-small text-muted">
            <span>{inr(curMin)}</span>
            <span>{inr(curMax)}</span>
          </div>
          <div className="mt-3 space-y-2">
            <input
              type="range"
              aria-label="Minimum price"
              min={min}
              max={max}
              step={100}
              value={curMin}
              onChange={(e) =>
                onChange({
                  ...filters,
                  priceMin: Math.min(Number(e.target.value), curMax),
                  priceMax: curMax,
                })
              }
              className="w-full accent-[rgb(var(--accent-rgb))]"
            />
            <input
              type="range"
              aria-label="Maximum price"
              min={min}
              max={max}
              step={100}
              value={curMax}
              onChange={(e) =>
                onChange({
                  ...filters,
                  priceMin: curMin,
                  priceMax: Math.max(Number(e.target.value), curMin),
                })
              }
              className="w-full accent-[rgb(var(--accent-rgb))]"
            />
          </div>
        </fieldset>
      )}
    </div>
  )
}
