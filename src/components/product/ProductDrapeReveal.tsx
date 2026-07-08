import { useRef, useState } from 'react'
import { MoveHorizontal } from 'lucide-react'
import { clamp } from '@/lib/utils'

/**
 * In-context before/after for THIS product: a bare, glaring window on the right;
 * drag the handle left→right to draw the product's drape across it. The dressed
 * side is tinted by the selected colour and deepened by the lining's block
 * factor. Keyboard-accessible (ARIA slider).
 */
export function ProductDrapeReveal({
  colorHex,
  block,
}: {
  colorHex: string
  block: number
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const [pos, setPos] = useState(0.32)

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

  return (
    <div
      ref={trackRef}
      onPointerDown={(e) => {
        draggingRef.current = true
        setFromClientX(e.clientX)
      }}
      onPointerMove={(e) => draggingRef.current && setFromClientX(e.clientX)}
      onPointerUp={() => (draggingRef.current = false)}
      onPointerLeave={() => (draggingRef.current = false)}
      className="relative h-full w-full touch-none select-none overflow-hidden"
    >
      {/* BARE — cold, glaring */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 35%, #ffffff, #e7edf2 45%, #cfd8e0 78%, #b9c4ce)',
        }}
      />
      {/* DRESSED — warm, curtained, tinted by the fabric colour (clipped to `pos`) */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: `inset(0 ${(1 - pos) * 100}% 0 0)`,
          backgroundColor: colorHex,
          backgroundImage: `
            radial-gradient(120% 90% at 50% 40%, rgb(var(--glow-rgb) / ${0.45 * (1 - block * 0.5)}), transparent 60%),
            linear-gradient(to bottom, rgb(0 0 0 / ${0.12 + block * 0.4}), rgb(0 0 0 / ${0.22 + block * 0.5})),
            repeating-linear-gradient(90deg,
              rgb(255 255 255 / 0.10) 0px,
              rgb(255 255 255 / 0.10) 22px,
              rgb(0 0 0 / 0.12) 24px,
              rgb(255 255 255 / 0.10) 46px)`,
        }}
      />
      {/* window mullions */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-[8%] border border-ink/15" />
        <div className="absolute inset-y-[8%] left-1/2 w-px -translate-x-1/2 bg-ink/15" />
        <div className="absolute inset-x-[8%] top-1/2 h-px -translate-y-1/2 bg-ink/15" />
      </div>

      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-ink/60 px-2.5 py-1 text-[10px] uppercase tracking-wide text-white">
        Bare
      </span>
      <span
        className="pointer-events-none absolute left-3 top-3 rounded-full bg-accent/90 px-2.5 py-1 text-[10px] uppercase tracking-wide text-bg transition-opacity"
        style={{ opacity: pos > 0.12 ? 1 : 0 }}
      >
        Dressed
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
          className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-line bg-surface text-ink shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <MoveHorizontal className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  )
}
