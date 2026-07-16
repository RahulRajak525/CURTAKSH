import { useRef, useState } from 'react'
import { MoveHorizontal } from 'lucide-react'
import { Container, Section, Label, Reveal, SplitText } from '@/components/ui'
import { getImageUrl } from '@/lib/getImageUrl'
import { home } from '@/config/home'
import { clamp } from '@/lib/utils'

/**
 * Signature interactive block — a literal before/after. A bare, harshly-lit
 * window; drag the handle across to draw a warm, softening drape over it.
 * Fully keyboard-accessible: the handle is an ARIA slider (arrows / Home / End).
 */
export function DrapeReveal() {
  const trackRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const [pos, setPos] = useState(0.22) // 0 = all bare, 1 = fully dressed

  const setFromClientX = (clientX: number) => {
    const el = trackRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPos(clamp((clientX - rect.left) / rect.width, 0, 1))
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 0.1 : 0.04
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setPos((p) => clamp(p - step, 0, 1))
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      setPos((p) => clamp(p + step, 0, 1))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setPos(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setPos(1)
    }
  }

  const pct = Math.round(pos * 100)
  const { drapeReveal } = home

  return (
    <Section>
      <Container>
        <div className="mb-10 max-w-xl">
          <Reveal variant="left">
            <Label className="mb-3 block">{drapeReveal.eyebrow}</Label>
          </Reveal>
          <SplitText
            as="h2"
            text={drapeReveal.headline}
            splitBy="word"
            delay={0.1}
            className="block font-display text-h1 leading-[1.02] text-ink"
          />
          <Reveal variant="fade" delay={0.25}>
            <p className="mt-4 text-body text-muted">{drapeReveal.sub}</p>
          </Reveal>
        </div>

        <Reveal variant="blur" delay={0.15}>
        <div
          ref={trackRef}
          onPointerDown={(e) => {
            draggingRef.current = true
            setFromClientX(e.clientX)
          }}
          onPointerMove={(e) => {
            if (draggingRef.current) setFromClientX(e.clientX)
          }}
          onPointerUp={() => (draggingRef.current = false)}
          onPointerLeave={() => (draggingRef.current = false)}
          className="relative aspect-[16/10] w-full touch-none select-none overflow-hidden rounded-lg border border-line shadow-soft"
        >
          {/* BARE — the room as-is, seen through an undressed window */}
          <img
            src={getImageUrl(drapeReveal.image)}
            alt={drapeReveal.imageAlt}
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* a touch of cold glare over the bare view */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(120% 90% at 50% 30%, rgb(255 255 255 / 0.28), transparent 55%)',
            }}
          />
          {/* DRESSED — warm, softened, curtained (clipped from the left to `pos`) */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: `inset(0 ${(1 - pos) * 100}% 0 0)`,
              backgroundColor: 'rgb(var(--surface-rgb))',
              backgroundImage: `
                radial-gradient(120% 90% at 50% 40%, rgb(var(--glow-rgb) / 0.5), transparent 60%),
                linear-gradient(to bottom, rgb(var(--ink-rgb) / 0.06), rgb(var(--ink-rgb) / 0.16)),
                repeating-linear-gradient(90deg,
                  rgb(var(--surface-rgb)) 0px,
                  rgb(var(--surface-rgb)) 26px,
                  rgb(var(--line-rgb)) 28px,
                  rgb(var(--surface-rgb)) 54px)`,
            }}
          />
          {/* side labels */}
          <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-ink/60 px-3 py-1 text-[11px] uppercase tracking-wide text-white">
            {drapeReveal.bareLabel}
          </span>
          <span
            className="pointer-events-none absolute left-4 top-4 rounded-full bg-accent/90 px-3 py-1 text-[11px] uppercase tracking-wide text-bg transition-opacity"
            style={{ opacity: pos > 0.12 ? 1 : 0 }}
          >
            {drapeReveal.dressedLabel}
          </span>

          {/* handle */}
          <div
            className="absolute inset-y-0 w-px bg-white/70"
            style={{ left: `${pos * 100}%` }}
          >
            <button
              type="button"
              onKeyDown={onKeyDown}
              role="slider"
              aria-label="Drape coverage"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct}
              aria-valuetext={`${pct}% dressed`}
              className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-line bg-surface text-ink shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <MoveHorizontal className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>
        </Reveal>
      </Container>
    </Section>
  )
}
