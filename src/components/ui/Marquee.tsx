import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * Seamless infinite marquee. Renders its children twice and translates the
 * track by -50% on a CSS loop. Pauses on hover; static under reduced-motion.
 */
export function Marquee({
  children,
  speed = 30,
  direction = 'left',
  pauseOnHover = true,
  className,
}: {
  children: ReactNode
  /** seconds for one full loop */
  speed?: number
  direction?: 'left' | 'right'
  pauseOnHover?: boolean
  className?: string
}) {
  const reduced = usePrefersReducedMotion()

  const track = (
    <div className="flex shrink-0 items-center gap-12 pr-12" aria-hidden={undefined}>
      {children}
    </div>
  )

  if (reduced) {
    return (
      <div className={cn('overflow-hidden', className)}>
        <div className="flex items-center gap-12">{children}</div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'group flex overflow-hidden',
        pauseOnHover && '[&:hover>div]:[animation-play-state:paused]',
        className,
      )}
    >
      <div
        className="flex w-max"
        style={{
          animation: `drape-marquee ${speed}s linear infinite`,
          animationDirection: direction === 'right' ? 'reverse' : 'normal',
        }}
      >
        {track}
        {/* duplicate for seamless wrap */}
        <div className="flex shrink-0 items-center gap-12 pr-12" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
