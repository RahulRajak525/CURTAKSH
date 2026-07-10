import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ArrowUp } from 'lucide-react'
import { useLenis } from '@/components/motion/SmoothScrollProvider'
import { usePrefersReducedMotion } from '@/hooks'
import { cn } from '@/lib/utils'

/**
 * "Back to top" affordance. Fades in bottom-right once the visitor nears the
 * foot of the homepage; a click glides back up through Lenis (instant under
 * reduced-motion). Sits opposite the left FloatingWhatsApp and below the
 * centre-right LightScrubber, so nothing collides.
 */
export function ScrollToTop() {
  const { pathname } = useLocation()
  const lenis = useLenis()
  const reduced = usePrefersReducedMotion()
  const [atBottom, setAtBottom] = useState(false)

  const onHome = pathname === '/'

  useEffect(() => {
    if (!onHome) {
      setAtBottom(false)
      return
    }
    let ticking = false
    const update = () => {
      ticking = false
      const scrollBottom = window.scrollY + window.innerHeight
      const nearFoot = scrollBottom >= document.documentElement.scrollHeight - 200
      setAtBottom(nearFoot)
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [onHome])

  const toTop = () => {
    if (lenis) lenis.scrollTo(0, { immediate: reduced })
    else window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  if (!onHome) return null

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      title="Back to top"
      tabIndex={atBottom ? 0 : -1}
      className={cn(
        'glass group fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-line text-ink shadow-soft',
        'transition-[opacity,transform] duration-base ease-[cubic-bezier(0.22,1,0.36,1)]',
        'hover:scale-[1.05] active:scale-95 motion-reduce:transition-none',
        atBottom
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0',
      )}
    >
      <ArrowUp
        className="h-5 w-5 transition-transform duration-base ease-settle group-hover:-translate-y-0.5 motion-reduce:transform-none"
        strokeWidth={1.8}
      />
    </button>
  )
}
