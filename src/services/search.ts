import type { SearchResult } from '@/types'
import { products } from '@/data/products'
import { collections } from '@/data/collections'
import { fabrics } from '@/data/fabrics'
import { resolve } from './client'

/**
 * Search service — stub. Real interface, local (naive substring) body.
 * Replace with a search backend later; the SearchResult contract holds.
 */
export function search(query: string): Promise<SearchResult[]> {
  const q = query.trim().toLowerCase()
  if (!q) return resolve<SearchResult[]>([])

  const results: SearchResult[] = [
    ...products
      .filter((p) => `${p.name} ${p.tagline ?? ''} ${p.description}`.toLowerCase().includes(q))
      .map<SearchResult>((p) => ({
        type: 'product',
        id: p.id,
        slug: p.slug,
        title: p.name,
        subtitle: p.tagline,
        image: p.images[0]?.src,
      })),
    ...collections
      .filter((c) => `${c.name} ${c.tagline} ${c.description}`.toLowerCase().includes(q))
      .map<SearchResult>((c) => ({
        type: 'collection',
        id: c.id,
        slug: c.slug,
        title: c.name,
        subtitle: c.tagline,
        image: c.heroImage,
      })),
    ...fabrics
      .filter((f) => `${f.name} ${f.composition}`.toLowerCase().includes(q))
      .map<SearchResult>((f) => ({
        type: 'fabric',
        id: f.id,
        slug: f.slug,
        title: f.name,
        subtitle: f.composition,
        image: f.textureImage,
      })),
  ]
  return resolve(results)
}
