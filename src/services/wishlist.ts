import type { Wishlist } from '@/types'
import { resolve } from './client'

/**
 * Wishlist service — stub. Real interface, local body (localStorage).
 */
const STORAGE_KEY = 'drape.wishlist'

function read(): Wishlist {
  if (typeof localStorage === 'undefined') return { productIds: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Wishlist) : { productIds: [] }
  } catch {
    return { productIds: [] }
  }
}

function write(wishlist: Wishlist): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist))
}

export function getWishlist(): Promise<Wishlist> {
  return resolve(read())
}

export function toggleWishlist(productId: string): Promise<Wishlist> {
  const wishlist = read()
  wishlist.productIds = wishlist.productIds.includes(productId)
    ? wishlist.productIds.filter((id) => id !== productId)
    : [...wishlist.productIds, productId]
  write(wishlist)
  return resolve(wishlist)
}
