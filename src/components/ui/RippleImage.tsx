import {
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from 'react'
import type { RipplePointerState } from '@/components/three/RippleImageCanvas'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useIsMobile } from '@/hooks/useIsMobile'
import { cn } from '@/lib/utils'

// Lazy so three.js only loads once an image is actually hovered.
const RippleImageCanvas = lazy(
  () => import('@/components/three/RippleImageCanvas'),
)

export interface RippleImageProps {
  src: string
  alt?: string
  className?: string
  imgClassName?: string
}

/**
 * An image that ripples like brushed fabric under the cursor, with a
 * Light-Engine-tinted sheen following it. Renders a plain <img> everywhere
 * (poster, mobile, reduced-motion, WebGL/CORS failure); on desktop the shader
 * canvas mounts on first hover and its frameloop pauses again after the
 * ripple has settled.
 *
 * Fills its parent (h-full w-full). Position it via a wrapper — don't pass
 * `absolute`/`relative` in className: cn() doesn't resolve Tailwind conflicts.
 */
export function RippleImage({
  src,
  alt = '',
  className,
  imgClassName,
}: RippleImageProps) {
  const reduced = usePrefersReducedMotion()
  const isMobile = useIsMobile()
  const enabled = !reduced && !isMobile

  const [armed, setArmed] = useState(false) // canvas mounted (first hover)
  const [active, setActive] = useState(false) // frameloop running
  const [failed, setFailed] = useState(false)
  const pointer = useRef<RipplePointerState>({ x: 0.5, y: 0.5, hover: 0 })
  const settleTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(settleTimer.current), [])

  const handleEnter = (e: PointerEvent<HTMLDivElement>) => {
    window.clearTimeout(settleTimer.current)
    writePointer(e)
    pointer.current.hover = 1
    setArmed(true)
    setActive(true)
  }
  const handleMove = (e: PointerEvent<HTMLDivElement>) => writePointer(e)
  const handleLeave = () => {
    pointer.current.hover = 0
    // keep animating long enough for the ripple to ease out, then pause
    settleTimer.current = window.setTimeout(() => setActive(false), 1400)
  }

  const writePointer = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    pointer.current.x = (e.clientX - rect.left) / rect.width
    pointer.current.y = 1 - (e.clientY - rect.top) / rect.height // UV y-up
  }

  return (
    <div
      className={cn('relative h-full w-full overflow-hidden', className)}
      onPointerEnter={enabled ? handleEnter : undefined}
      onPointerMove={enabled ? handleMove : undefined}
      onPointerLeave={enabled ? handleLeave : undefined}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={cn(
          'absolute inset-0 h-full w-full object-cover',
          imgClassName,
        )}
      />
      {enabled && armed && !failed && (
        <div aria-hidden="true" className="absolute inset-0">
          <Suspense fallback={null}>
            <RippleImageCanvas
              src={src}
              pointer={pointer}
              active={active}
              onError={() => setFailed(true)}
            />
          </Suspense>
        </div>
      )}
    </div>
  )
}
