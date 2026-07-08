import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getCart, getWishlist } from '@/services'

export interface StoreCounts {
  cart: number
  wishlist: number
}

/**
 * Live cart + wishlist badge counts, read through the service stubs. Refreshes
 * on route change and on cross-tab storage events. A `drape:store` custom event
 * lets same-tab mutations trigger a refresh too.
 */
export function useStoreCounts(): StoreCounts {
  const location = useLocation()
  const [counts, setCounts] = useState<StoreCounts>({ cart: 0, wishlist: 0 })

  useEffect(() => {
    let alive = true
    const refresh = () => {
      Promise.all([getCart(), getWishlist()]).then(([cart, wishlist]) => {
        if (!alive) return
        setCounts({
          cart: cart.lines.reduce((n, l) => n + l.quantity, 0),
          wishlist: wishlist.productIds.length,
        })
      })
    }
    refresh()
    window.addEventListener('storage', refresh)
    window.addEventListener('drape:store', refresh)
    return () => {
      alive = false
      window.removeEventListener('storage', refresh)
      window.removeEventListener('drape:store', refresh)
    }
  }, [location.pathname])

  return counts
}
