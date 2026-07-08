import { useRef } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/**
 * Magnetic hover — the element eases toward the cursor while hovered and
 * springs back on leave. Returns a ref, a Framer `style` (motion values) and
 * pointer handlers to spread onto a `motion.*` element. Disabled (no-op) under
 * prefers-reduced-motion.
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>(
  strength = 0.35,
) {
  const ref = useRef<T>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.3 })
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.3 })
  const reducedMotion = usePrefersReducedMotion()

  const onMouseMove = (e: ReactMouseEvent) => {
    if (reducedMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const relX = e.clientX - (rect.left + rect.width / 2)
    const relY = e.clientY - (rect.top + rect.height / 2)
    x.set(relX * strength)
    y.set(relY * strength)
  }

  const onMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return {
    ref,
    style: reducedMotion ? {} : { x: springX, y: springY },
    onMouseMove,
    onMouseLeave,
  }
}
