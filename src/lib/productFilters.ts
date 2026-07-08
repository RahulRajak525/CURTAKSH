import type { Product } from '@/types'
import { FACET_ORDER } from '@/config/filters'
import type { SortKey } from '@/config/filters'

/**
 * Pure product filtering + faceting. Used client-side by the collection page now
 * (instant, animated re-flow) and by the catalog service — the same predicate
 * moves server-side later with no UI change.
 */
export interface ProductFilters {
  textures: string[]
  functions: string[]
  spaces: string[]
  colours: string[] // colour names
  priceMin?: number
  priceMax?: number
}

export const emptyFilters = (): ProductFilters => ({
  textures: [],
  functions: [],
  spaces: [],
  colours: [],
})

export function countActiveFilters(f: ProductFilters, price?: { min: number; max: number }): number {
  let n = f.textures.length + f.functions.length + f.spaces.length + f.colours.length
  if (price && (f.priceMin !== undefined || f.priceMax !== undefined)) {
    if (f.priceMin! > price.min || f.priceMax! < price.max) n += 1
  }
  return n
}

export function applyProductFilters(
  products: Product[],
  f: ProductFilters,
  sort: SortKey = 'new',
): Product[] {
  const filtered = products.filter((p) => {
    if (f.textures.length && !f.textures.includes(p.texture)) return false
    if (f.functions.length && !p.functions.some((x) => f.functions.includes(x)))
      return false
    if (f.spaces.length && !p.spaces.some((x) => f.spaces.includes(x)))
      return false
    if (f.colours.length && !p.colors.some((c) => f.colours.includes(c.name)))
      return false
    if (f.priceMin !== undefined && p.price.amount < f.priceMin) return false
    if (f.priceMax !== undefined && p.price.amount > f.priceMax) return false
    return true
  })

  return filtered.sort((a, b) => {
    if (sort === 'price') return a.price.amount - b.price.amount
    if (sort === 'popularity') return b.popularity - a.popularity
    return +new Date(b.createdAt) - +new Date(a.createdAt) // new
  })
}

/* ---------------- facets ---------------- */

export interface FacetValue {
  value: string
  count: number
}
export interface ColourFacet {
  name: string
  hex: string
  count: number
}
export interface Facets {
  textures: FacetValue[]
  functions: FacetValue[]
  spaces: FacetValue[]
  colours: ColourFacet[]
  price: { min: number; max: number }
}

function ordered(values: Map<string, number>, order: readonly string[]): FacetValue[] {
  const known = order
    .filter((o) => values.has(o))
    .map((o) => ({ value: o, count: values.get(o)! }))
  const extra = [...values.keys()]
    .filter((v) => !order.includes(v))
    .sort()
    .map((v) => ({ value: v, count: values.get(v)! }))
  return [...known, ...extra]
}

/** Available facet values + counts + price bounds for a set of products. */
export function deriveFacets(products: Product[]): Facets {
  const tex = new Map<string, number>()
  const fn = new Map<string, number>()
  const sp = new Map<string, number>()
  const col = new Map<string, { hex: string; count: number }>()
  let min = Infinity
  let max = 0

  for (const p of products) {
    tex.set(p.texture, (tex.get(p.texture) ?? 0) + 1)
    for (const x of p.functions) fn.set(x, (fn.get(x) ?? 0) + 1)
    for (const x of p.spaces) sp.set(x, (sp.get(x) ?? 0) + 1)
    for (const c of p.colors) {
      const e = col.get(c.name) ?? { hex: c.hex, count: 0 }
      e.count += 1
      col.set(c.name, e)
    }
    min = Math.min(min, p.price.amount)
    max = Math.max(max, p.price.amount)
  }

  const colours = [...col.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name, v]) => ({ name, hex: v.hex, count: v.count }))

  return {
    textures: ordered(tex, FACET_ORDER.texture),
    functions: ordered(fn, FACET_ORDER.function),
    spaces: ordered(sp, FACET_ORDER.space),
    colours,
    price: { min: Number.isFinite(min) ? min : 0, max },
  }
}
