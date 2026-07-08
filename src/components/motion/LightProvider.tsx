import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useLightStore } from '@/store/lightStore'
import { setLightPhase as applyPhase, clampPhase } from '@/lib/theme'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/** Full drift cycle length in ms (Dawn → Night → Dawn). */
const DRIFT_PERIOD = 90_000

/**
 * Bridges the light store to the DOM. It:
 *  - writes the interpolated theme to :root whenever lightPhase changes
 *    (batched into a single requestAnimationFrame so drag/drift stay smooth)
 *  - runs the optional slow "auto-drift" oscillation
 *  - disables drift under prefers-reduced-motion
 *
 * It subscribes to the store imperatively so it never re-renders its subtree.
 */
export function LightProvider({ children }: { children: ReactNode }) {
  const autoDrift = useLightStore((s) => s.autoDrift)
  const reducedMotion = usePrefersReducedMotion()

  // Paint the current phase, and repaint on every change.
  useEffect(() => {
    let frame = 0
    let queued = false

    const flush = () => {
      queued = false
      applyPhase(useLightStore.getState().lightPhase)
    }

    // Initial paint (forced — overwrites the NOON defaults from tokens.css).
    applyPhase(useLightStore.getState().lightPhase, true)

    const unsub = useLightStore.subscribe((state, prev) => {
      if (state.lightPhase === prev.lightPhase) return
      if (queued) return
      queued = true
      frame = requestAnimationFrame(flush)
    })

    return () => {
      unsub()
      cancelAnimationFrame(frame)
    }
  }, [])

  // Auto-drift: gently oscillate the phase with a sine wave.
  useEffect(() => {
    if (!autoDrift || reducedMotion) return

    const { setLightPhase } = useLightStore.getState()
    // Seed the clock so the wave starts at the current phase (no jump).
    const current = clampPhase(useLightStore.getState().lightPhase)
    const theta0 = Math.asin(Math.min(1, Math.max(-1, (current - 0.5) / 0.5)))
    const omega = (Math.PI * 2) / DRIFT_PERIOD
    const start = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const theta = theta0 + omega * (now - start)
      setLightPhase(0.5 + 0.5 * Math.sin(theta))
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frame)
  }, [autoDrift, reducedMotion])

  return <>{children}</>
}
