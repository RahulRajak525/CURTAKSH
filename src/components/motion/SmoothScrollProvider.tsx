import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const LenisContext = createContext<Lenis | null>(null)

/** Access the app-wide Lenis instance (null under reduced motion / before init). */
export const useLenis = () => useContext(LenisContext)

/**
 * Initialises Lenis smooth scroll app-wide and wires it to GSAP ScrollTrigger
 * so scroll-driven animations stay perfectly in sync:
 *  - GSAP's ticker drives Lenis's rAF (single animation loop)
 *  - Lenis 'scroll' events push ScrollTrigger.update
 *  - a scrollerProxy maps ScrollTrigger's scroll position onto Lenis
 *
 * Under prefers-reduced-motion Lenis is not created — native scrolling is used
 * and ScrollTrigger falls back to the default window scroller.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion()
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (reducedMotion) {
      gsap.ticker.lagSmoothing(500, 33)
      ScrollTrigger.refresh()
      return
    }

    const instance = new Lenis({
      duration: 1.1,
      // Heavy, settled easing — matches the "fabric settling" motion language.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    })
    lenisRef.current = instance
    setLenis(instance)

    // Keep ScrollTrigger in sync with Lenis.
    instance.on('scroll', ScrollTrigger.update)

    // Register a scrollerProxy so ScrollTrigger reads/writes via Lenis.
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (typeof value === 'number') {
          instance.scrollTo(value, { immediate: true })
        }
        return instance.scroll
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        }
      },
    })

    // Drive Lenis from GSAP's ticker (one rAF loop for the whole app).
    const raf = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    const onRefresh = () => instance.resize()
    ScrollTrigger.addEventListener('refresh', onRefresh)
    ScrollTrigger.refresh()

    return () => {
      ScrollTrigger.removeEventListener('refresh', onRefresh)
      gsap.ticker.remove(raf)
      instance.destroy()
      lenisRef.current = null
      setLenis(null)
    }
  }, [reducedMotion])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
