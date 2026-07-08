import { useCallback } from 'react'
import type { Product, Collection, Fabric, AsyncState } from '@/types'
import {
  getProducts,
  getProductBySlug,
  getCollections,
  getCollectionBySlug,
  getFabrics,
} from '@/services'
import { useAsync } from './useAsync'

type ProductParams = Parameters<typeof getProducts>[0]

export function useProducts(params?: ProductParams): AsyncState<Product[]> {
  const key = JSON.stringify(params ?? {})
  const factory = useCallback(() => getProducts(params), [key]) // eslint-disable-line react-hooks/exhaustive-deps
  return useAsync(factory, [key])
}

export function useProduct(slug: string): AsyncState<Product | null> {
  const factory = useCallback(() => getProductBySlug(slug), [slug])
  return useAsync(factory, [slug])
}

export function useCollections(params?: {
  featured?: boolean
}): AsyncState<Collection[]> {
  const key = JSON.stringify(params ?? {})
  const factory = useCallback(() => getCollections(params), [key]) // eslint-disable-line react-hooks/exhaustive-deps
  return useAsync(factory, [key])
}

export function useCollection(slug: string): AsyncState<Collection | null> {
  const factory = useCallback(() => getCollectionBySlug(slug), [slug])
  return useAsync(factory, [slug])
}

export function useFabrics(params?: {
  opacity?: Fabric['opacity']
}): AsyncState<Fabric[]> {
  const key = JSON.stringify(params ?? {})
  const factory = useCallback(() => getFabrics(params), [key]) // eslint-disable-line react-hooks/exhaustive-deps
  return useAsync(factory, [key])
}
