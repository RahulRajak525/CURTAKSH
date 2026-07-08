import type { Product, Collection, Fabric } from '@/types'
import { products } from '@/data/products'
import { collections } from '@/data/collections'
import { fabrics } from '@/data/fabrics'
import { applyProductFilters } from '@/lib/productFilters'
import type { ProductFilters } from '@/lib/productFilters'
import type { SortKey } from '@/config/filters'
import { resolve } from './client'

/**
 * Catalog service — read endpoints shaped like a future REST API.
 * Components must reach data only through functions like these (or hooks that
 * wrap them), never by importing from data/ directly.
 */

export function getProducts(params?: {
  category?: Product['category']
  collectionId?: string
  featured?: boolean
  /** Faceted filters — the collection page applies these client-side today, but
   *  the service already honours them so this becomes a server query unchanged. */
  filters?: ProductFilters
  sort?: SortKey
}): Promise<Product[]> {
  let list = products
  if (params?.category) list = list.filter((p) => p.category === params.category)
  if (params?.collectionId)
    list = list.filter((p) => p.collectionId === params.collectionId)
  if (params?.featured) list = list.filter((p) => p.featured)
  if (params?.filters || params?.sort) {
    list = applyProductFilters(
      list,
      params.filters ?? {
        textures: [],
        functions: [],
        spaces: [],
        colours: [],
      },
      params.sort ?? 'new',
    )
  }
  return resolve(list)
}

export function getProductBySlug(slug: string): Promise<Product | null> {
  return resolve(products.find((p) => p.slug === slug) ?? null)
}

export function getCollections(params?: {
  featured?: boolean
}): Promise<Collection[]> {
  let list = collections
  if (params?.featured) list = list.filter((c) => c.featured)
  return resolve(list)
}

export function getCollectionBySlug(slug: string): Promise<Collection | null> {
  return resolve(collections.find((c) => c.slug === slug) ?? null)
}

export function getFabrics(params?: {
  opacity?: Fabric['opacity']
}): Promise<Fabric[]> {
  let list = fabrics
  if (params?.opacity) list = list.filter((f) => f.opacity === params.opacity)
  return resolve(list)
}

export function getFabricBySlug(slug: string): Promise<Fabric | null> {
  return resolve(fabrics.find((f) => f.slug === slug) ?? null)
}
