import { useCallback, useEffect, useState } from 'react'
import { getWishlist, toggleWishlist } from '@/services'

/**
 * Wishlist membership + toggling, backed by the wishlist service stub.
 * Optimistic updates; dispatches `drape:store` so the navbar badge (and any
 * other listener) refreshes.
 */
export function useWishlist() {
  const [ids, setIds] = useState<string[]>([])

  useEffect(() => {
    let alive = true
    const refresh = () => getWishlist().then((w) => alive && setIds(w.productIds))
    refresh()
    window.addEventListener('drape:store', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      alive = false
      window.removeEventListener('drape:store', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  const has = useCallback((id: string) => ids.includes(id), [ids])

  const toggle = useCallback((id: string) => {
    setIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
    toggleWishlist(id).then(() => window.dispatchEvent(new Event('drape:store')))
  }, [])

  return { ids, has, toggle }
}
