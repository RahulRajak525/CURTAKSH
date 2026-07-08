import { Marquee } from '@/components/ui'
import { home } from '@/config/home'

/** Slow mono marquee of proof points. */
export function MarqueeStrip() {
  return (
    <div className="border-y border-line bg-surface/50 py-5">
      <Marquee speed={42}>
        {home.proofPoints.flatMap((point) => [
          <span key={point} className="label text-ink">
            {point}
          </span>,
          <span key={`${point}-dot`} aria-hidden="true" className="text-accent">
            ·
          </span>,
        ])}
      </Marquee>
    </div>
  )
}
