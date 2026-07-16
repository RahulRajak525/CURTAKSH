import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Container, GlassPanel, Label, Reveal, SplitText } from '@/components/ui'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useLightStore } from '@/store/lightStore'
import { PHASE_ANCHORS, nearestPhaseKey } from '@/lib/theme'
import { home } from '@/config/home'
import { cn } from '@/lib/utils'

// Lazy so three.js only loads when the live band is actually used.
const SilkRibbonField = lazy(() => import('@/components/three/SilkRibbonField'))

/**
 * "The Fabric of Light" — a full-bleed band of flowing 3D silk shaded live by
 * the Light Engine, with a HUD that reads the current phase and lets the user
 * set the hour (which re-lights the entire site, not just the cloth).
 * Mobile / reduced-motion get a token-driven gradient backdrop instead of the
 * canvas; the sim pauses while offscreen.
 */

/** Live phase readout — imperative store subscription, no re-renders. */
function PhaseReadout() {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const write = (phase: number) => {
      if (!ref.current) return
      const key = nearestPhaseKey(phase)
      const anchor = PHASE_ANCHORS.find((a) => a.key === key)
      ref.current.textContent = `${anchor?.label ?? ''} · ${phase.toFixed(2)}`
    }
    write(useLightStore.getState().lightPhase)
    return useLightStore.subscribe((s) => write(s.lightPhase))
  }, [])
  return <span ref={ref} className="tabular-nums" />
}

/** Dawn / Noon / Dusk / Night — sets the global light phase. */
function PhaseControls() {
  const activeKey = useLightStore((s) => nearestPhaseKey(s.lightPhase))
  const setLightPhase = useLightStore((s) => s.setLightPhase)
  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label={home.fabricOfLight.hudLabel}
    >
      {PHASE_ANCHORS.map((anchor) => (
        <button
          key={anchor.key}
          type="button"
          onClick={() => setLightPhase(anchor.phase)}
          aria-pressed={activeKey === anchor.key}
          className={cn(
            'rounded-full border px-4 py-1.5 font-mono text-[11px] tracking-[0.18em] transition-colors duration-fast ease-settle',
            activeKey === anchor.key
              ? 'border-accent bg-accent/15 text-ink'
              : 'border-line text-muted hover:border-accent/60 hover:text-ink',
          )}
        >
          {anchor.label}
        </button>
      ))}
    </div>
  )
}

/** Hairline corner ticks — quiet HUD framing. */
function CornerTicks() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-5 z-10">
      {(['top-0 left-0 border-t border-l', 'top-0 right-0 border-t border-r', 'bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r'] as const).map(
        (pos) => (
          <span
            key={pos}
            className={cn('absolute h-4 w-4 border-line', pos)}
          />
        ),
      )}
    </div>
  )
}

export function FabricOfLight() {
  const reduced = usePrefersReducedMotion()
  const isMobile = useIsMobile()
  const use3D = !reduced && !isMobile

  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  // Pause the sheet while the band is offscreen.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const copy = home.fabricOfLight

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-y border-line"
    >
      {/* token-driven backdrop — also the mobile / reduced-motion fallback */}
      <div aria-hidden="true" className="absolute inset-0 bg-bg">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(90% 70% at 50% 82%, rgb(var(--glow-rgb) / 0.3), transparent 62%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgb(var(--bg-rgb)), transparent 28%, transparent 72%, rgb(var(--bg-rgb)))',
          }}
        />
      </div>

      {use3D && (
        <Suspense fallback={null}>
          <SilkRibbonField active={inView} />
        </Suspense>
      )}

      <CornerTicks />

      {/* Overlay — pointer-events off so the cursor swell reaches the canvas;
          re-enabled on the HUD. */}
      <Container
        size="wide"
        className="pointer-events-none relative z-10 flex min-h-[78vh] flex-col justify-between gap-12 py-16 md:py-20"
      >
        <div className="max-w-xl">
          <Reveal variant="left">
            <Label className="mb-5 block">{copy.eyebrow}</Label>
          </Reveal>
          <SplitText
            as="h2"
            text={copy.headline}
            splitBy="word"
            delay={0.1}
            className="block font-display text-display-2 leading-[0.95] text-ink"
          />
          <Reveal variant="fade" delay={0.3}>
            <p className="mt-5 max-w-md text-body text-muted">{copy.sub}</p>
          </Reveal>
        </div>

        <Reveal variant="blur" delay={0.2} className="pointer-events-auto">
          <GlassPanel className="flex flex-wrap items-center justify-between gap-x-10 gap-y-6 p-6 md:p-7">
            <div>
              <Label className="block">{copy.hudLabel}</Label>
              <p className="mt-2 font-mono text-small text-ink">
                <PhaseReadout />
              </p>
            </div>
            <PhaseControls />
            <Link
              to={copy.cta.href}
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-2.5 text-small text-ink transition-colors duration-fast hover:border-accent hover:text-accent"
            >
              {copy.cta.label}
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </Link>
          </GlassPanel>
        </Reveal>
      </Container>
    </section>
  )
}
