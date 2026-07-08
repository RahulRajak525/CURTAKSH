import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { Sun, Moon, Infinity as InfinityIcon } from 'lucide-react'
import { useLightStore } from '@/store/lightStore'
import { ANCHORS, nearestPhaseKey } from '@/lib/theme'
import { clamp, cn } from '@/lib/utils'

const TOKEN = 30 // px — draggable token diameter
const HALF = TOKEN / 2

// A vertical "sky" gradient built from the four anchor background tones.
const SKY_GRADIENT = `linear-gradient(to bottom, ${ANCHORS.map(
  (a) => a.bg,
).join(', ')})`

/**
 * The Light Engine's control surface: a slim vertical scrubber pinned to the
 * right edge. A sun/moon token travels a gradient track between DAWN and NIGHT.
 *  - drag the token (Framer Motion drag) to set the phase
 *  - click the track or a label to jump
 *  - focus the token and use ↑/↓ (fine) · PageUp/Down (coarse) · Home/End
 *  - toggle slow auto-drift
 *
 * The token is an ARIA slider (vertical) and announces its value via
 * aria-valuetext.
 */
export function LightScrubber() {
  const lightPhase = useLightStore((s) => s.lightPhase)
  const setLightPhase = useLightStore((s) => s.setLightPhase)
  const nudgePhase = useLightStore((s) => s.nudgePhase)
  const autoDrift = useLightStore((s) => s.autoDrift)
  const toggleAutoDrift = useLightStore((s) => s.toggleAutoDrift)

  const trackRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const [height, setHeight] = useState(0)
  const y = useMotionValue(0)

  // Measure the track so we can map pixels ↔ phase.
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const measure = () => setHeight(el.clientHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Keep the token synced to the phase whenever it changes externally
  // (auto-drift, keyboard, label click) — but never while dragging.
  useEffect(() => {
    if (!draggingRef.current && height > 0) y.set(lightPhase * height)
  }, [lightPhase, height, y])

  const label = nearestPhaseKey(lightPhase).toUpperCase()
  const percent = Math.round(lightPhase * 100)
  const isDay = lightPhase < 0.5

  const setFromClientY = (clientY: number) => {
    const el = trackRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setLightPhase(clamp((clientY - rect.top) / rect.height, 0, 1))
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault()
        nudgePhase(-0.02)
        break
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault()
        nudgePhase(0.02)
        break
      case 'PageUp':
        e.preventDefault()
        nudgePhase(-0.1)
        break
      case 'PageDown':
        e.preventDefault()
        nudgePhase(0.1)
        break
      case 'Home':
        e.preventDefault()
        setLightPhase(0)
        break
      case 'End':
        e.preventDefault()
        setLightPhase(1)
        break
    }
  }

  return (
    <div
      className="fixed right-3 top-1/2 z-[100] hidden -translate-y-1/2 flex-col items-center gap-4 md:flex"
      aria-label="Light phase control"
    >
      <span className="label text-muted [writing-mode:vertical-rl] rotate-180">
        LIGHT
      </span>

      <div className="relative flex h-[48vh] max-h-[520px] min-h-[280px] items-stretch">
        {/* labels */}
        <div className="relative mr-3 w-10">
          {ANCHORS.map((a) => (
            <button
              key={a.key}
              type="button"
              onClick={() => setLightPhase(a.phase)}
              style={{ top: `${a.phase * 100}%` }}
              className={cn(
                'label absolute right-0 -translate-y-1/2 whitespace-nowrap transition-colors duration-fast hover:text-ink',
                nearestPhaseKey(lightPhase) === a.key
                  ? 'text-ink'
                  : 'text-muted/60',
              )}
            >
              {a.label}
            </button>
          ))}
        </div>

        {/* track */}
        <div
          ref={trackRef}
          onPointerDown={(e) => {
            if (e.target === e.currentTarget || e.currentTarget.contains(e.target as Node)) {
              // Ignore when the token itself starts the interaction.
              if ((e.target as HTMLElement).dataset.token) return
              setFromClientY(e.clientY)
            }
          }}
          className="relative w-1.5 cursor-pointer overflow-visible rounded-full border border-line"
          style={{ background: SKY_GRADIENT }}
        >
          {/* token */}
          <motion.button
            type="button"
            data-token="true"
            drag="y"
            dragConstraints={{ top: 0, bottom: height }}
            dragElastic={0}
            dragMomentum={false}
            style={{ y, x: '-50%', width: TOKEN, height: TOKEN, marginTop: -HALF }}
            onDragStart={() => {
              draggingRef.current = true
            }}
            onDrag={() => {
              if (height > 0) setLightPhase(clamp(y.get() / height, 0, 1))
            }}
            onDragEnd={() => {
              draggingRef.current = false
            }}
            onKeyDown={onKeyDown}
            role="slider"
            aria-label="Light phase"
            aria-orientation="vertical"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            aria-valuetext={`${label}, ${percent}%`}
            tabIndex={0}
            whileTap={{ scale: 1.12 }}
            className={cn(
              'absolute left-1/2 top-0 flex touch-none items-center justify-center rounded-full',
              'border border-line bg-surface text-ink shadow-soft',
              'transition-colors duration-base ease-settle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
            )}
          >
            {isDay ? (
              <Sun className="h-3.5 w-3.5" strokeWidth={1.75} />
            ) : (
              <Moon className="h-3.5 w-3.5" strokeWidth={1.75} />
            )}
          </motion.button>
        </div>
      </div>

      {/* auto-drift toggle */}
      <button
        type="button"
        onClick={toggleAutoDrift}
        aria-pressed={autoDrift}
        title="Auto-drift the light"
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-fast',
          autoDrift
            ? 'border-accent bg-accent/15 text-accent'
            : 'border-line text-muted hover:text-ink',
        )}
      >
        <InfinityIcon className="h-4 w-4" strokeWidth={1.75} />
      </button>
    </div>
  )
}
