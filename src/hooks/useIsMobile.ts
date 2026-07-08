import { useEffect, useState } from 'react'

/**
 * True on narrow / coarse-pointer devices. Used to swap the live 3D hero for a
 * lightweight static hero. Matches the Tailwind `lg` breakpoint (1024px) OR a
 * coarse primary pointer (touch), whichever applies.
 */
export function useIsMobile(maxWidth = 1023): boolean {
  const query = `(max-width: ${maxWidth}px), (pointer: coarse)`
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setIsMobile(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return isMobile
}
