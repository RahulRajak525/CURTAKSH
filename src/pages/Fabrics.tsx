import { useMemo, useState } from 'react'
import type { Fabric } from '@/types'
import { useFabrics } from '@/hooks'
import { Container, Section, PageHero, Label, Reveal, Skeleton } from '@/components/ui'
import { FabricCard } from '@/components/fabric/FabricCard'
import { content } from '@/config/content'
import { pexels } from '@/config/media'
import { cn } from '@/lib/utils'

const materialOf = (f: Fabric): string => {
  const s = `${f.composition} ${f.name}`.toLowerCase()
  if (s.includes('velvet')) return 'Velvet'
  if (s.includes('linen')) return 'Linen'
  if (s.includes('silk')) return 'Silk'
  if (s.includes('wool')) return 'Wool'
  if (s.includes('cotton')) return 'Cotton'
  return 'Other'
}

const WEIGHT_BUCKETS = [
  { key: 'light', label: 'Light · ≤150', test: (g: number) => g <= 150 },
  { key: 'medium', label: 'Medium · 151–350', test: (g: number) => g > 150 && g <= 350 },
  { key: 'heavy', label: 'Heavy · >350', test: (g: number) => g > 350 },
] as const

const prettyOpacity = (o: string) =>
  o.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

interface Filters {
  materials: string[]
  weights: string[]
  opacities: string[]
}

function ChipGroup({
  label,
  values,
  selected,
  onToggle,
  format,
}: {
  label: string
  values: string[]
  selected: string[]
  onToggle: (v: string) => void
  format?: (v: string) => string
}) {
  if (!values.length) return null
  return (
    <div>
      <Label className="mb-2 block">{label}</Label>
      <div className="flex flex-wrap gap-2">
        {values.map((v) => {
          const on = selected.includes(v)
          return (
            <button
              key={v}
              type="button"
              onClick={() => onToggle(v)}
              aria-pressed={on}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-small transition-colors',
                on ? 'border-ink bg-ink text-bg' : 'border-line text-ink hover:border-ink/50',
              )}
            >
              {format ? format(v) : v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function Fabrics() {
  const { data, isLoading, error } = useFabrics()
  const fabrics = useMemo(() => data ?? [], [data])
  const [filters, setFilters] = useState<Filters>({
    materials: [],
    weights: [],
    opacities: [],
  })

  const materials = useMemo(
    () => [...new Set(fabrics.map(materialOf))].sort(),
    [fabrics],
  )
  const opacities = useMemo(
    () => [...new Set(fabrics.map((f) => f.opacity))],
    [fabrics],
  )
  const weights = useMemo(
    () =>
      WEIGHT_BUCKETS.filter((b) => fabrics.some((f) => b.test(f.weightGsm))).map(
        (b) => b.key,
      ),
    [fabrics],
  )

  const toggle = (field: keyof Filters, v: string) =>
    setFilters((f) => ({
      ...f,
      [field]: f[field].includes(v)
        ? f[field].filter((x) => x !== v)
        : [...f[field], v],
    }))

  const filtered = useMemo(
    () =>
      fabrics.filter((f) => {
        if (filters.materials.length && !filters.materials.includes(materialOf(f)))
          return false
        if (
          filters.weights.length &&
          !filters.weights.some((k) =>
            WEIGHT_BUCKETS.find((b) => b.key === k)?.test(f.weightGsm),
          )
        )
          return false
        if (filters.opacities.length && !filters.opacities.includes(f.opacity))
          return false
        return true
      }),
    [fabrics, filters],
  )

  return (
    <>
      <PageHero
        eyebrow={content.fabrics.eyebrow}
        title={content.fabrics.title}
        intro={content.fabrics.intro}
        backgroundImage={pexels(7794365, 1600)}
      />

      <Section>
        <Container>
          {/* filters */}
          <div className="mb-12 flex flex-col gap-6 border-b border-line pb-8 md:flex-row md:gap-12">
            <ChipGroup
              label={content.fabrics.filters.material}
              values={materials}
              selected={filters.materials}
              onToggle={(v) => toggle('materials', v)}
            />
            <ChipGroup
              label={content.fabrics.filters.weight}
              values={weights}
              selected={filters.weights}
              onToggle={(v) => toggle('weights', v)}
              format={(k) => WEIGHT_BUCKETS.find((b) => b.key === k)?.label ?? k}
            />
            <ChipGroup
              label={content.fabrics.filters.opacity}
              values={opacities}
              selected={filters.opacities}
              onToggle={(v) => toggle('opacities', v)}
              format={prettyOpacity}
            />
          </div>

          {error ? (
            <p className="text-body text-muted">
              We couldn’t load fabrics just now. Please refresh.
            </p>
          ) : isLoading ? (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-[4/5] rounded-lg" />
                  <Skeleton className="mt-3 h-5 w-2/3" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-16 text-center text-body text-muted">
              {content.fabrics.empty}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((fabric) => (
                <Reveal key={fabric.id} variant="fade">
                  <FabricCard fabric={fabric} />
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
