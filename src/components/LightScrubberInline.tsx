import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { Sun, Moon, Infinity as InfinityIcon } from 'lucide-react'
import { useLightStore } from '@/store/lightStore'
import { ANCHORS, nearestPhaseKey } from '@/lib/theme'
import { clamp, cn } from '@/lib/utils'

const TOKEN = 30
const HALF = TOKEN / 2

// Horizontal sky gradient (dawn → night, left → right).
const SKY_GRADIENT = `linear-gradient(to right, ${ANCHORS.map((a) => a.bg).join(', ')})`

/**
 * A compact, horizontal variant of the light scrubber for the mobile drawer.
 * Shares the same lightStore as the fixed rail — moving one moves the other.
 */
export function LightScrubberInline({ className }: { className?: string }) {
  const lightPhase = useLightStore((s) => s.lightPhase)
  const setLightPhase = useLightStore((s) => s.setLightPhase)
  const nudgePhase = useLightStore((s) => s.nudgePhase)
  const autoDrift = useLightStore((s) => s.autoDrift)
  const toggleAutoDrift = useLightStore((s) => s.toggleAutoDrift)

  const trackRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const [width, setWidth] = useState(0)
  const x = useMotionValue(0)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const measure = () => setWidth(el.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!draggingRef.current && width > 0) x.set(lightPhase * width)
  }, [lightPhase, width, x])

  const label = nearestPhaseKey(lightPhase).toUpperCase()
  const percent = Math.round(lightPhase * 100)
  const isDay = lightPhase < 0.5

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      nudgePhase(-0.02)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      nudgePhase(0.02)
    } else if (e.key === 'Home') {
      e.preventDefault()
      setLightPhase(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setLightPhase(1)
    }
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="mb-3 flex items-center justify-between">
        <span className="label text-muted">Light · {label}</span>
        <button
          type="button"
          onClick={toggleAutoDrift}
          aria-pressed={autoDrift}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-fast',
            autoDrift
              ? 'border-accent bg-accent/15 text-accent'
              : 'border-line text-muted hover:text-ink',
          )}
          title="Auto-drift the light"
        >
          <InfinityIcon className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>

      <div
        ref={trackRef}
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).dataset.token) return
          const rect = e.currentTarget.getBoundingClientRect()
          setLightPhase(clamp((e.clientX - rect.left) / rect.width, 0, 1))
        }}
        className="relative h-1.5 cursor-pointer rounded-full border border-line"
        style={{ background: SKY_GRADIENT }}
      >
        <motion.button
          type="button"
          data-token="true"
          drag="x"
          dragConstraints={{ left: 0, right: width }}
          dragElastic={0}
          dragMomentum={false}
          style={{ x, y: '-50%', width: TOKEN, height: TOKEN, marginLeft: -HALF }}
          onDragStart={() => {
            draggingRef.current = true
          }}
          onDrag={() => {
            if (width > 0) setLightPhase(clamp(x.get() / width, 0, 1))
          }}
          onDragEnd={() => {
            draggingRef.current = false
          }}
          onKeyDown={onKeyDown}
          role="slider"
          aria-label="Light phase"
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-valuetext={`${label}, ${percent}%`}
          tabIndex={0}
          whileTap={{ scale: 1.12 }}
          className="absolute left-0 top-1/2 flex touch-none items-center justify-center rounded-full border border-line bg-surface text-ink shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {isDay ? (
            <Sun className="h-3.5 w-3.5" strokeWidth={1.75} />
          ) : (
            <Moon className="h-3.5 w-3.5" strokeWidth={1.75} />
          )}
        </motion.button>
      </div>

      <div className="mt-3 flex justify-between">
        {ANCHORS.map((a) => (
          <button
            key={a.key}
            type="button"
            onClick={() => setLightPhase(a.phase)}
            className={cn(
              'label transition-colors duration-fast hover:text-ink',
              nearestPhaseKey(lightPhase) === a.key ? 'text-ink' : 'text-muted/60',
            )}
          >
            {a.label}
          </button>
        ))}
      </div>
    </div>
  )
}
