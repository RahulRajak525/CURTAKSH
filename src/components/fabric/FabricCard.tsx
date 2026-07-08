import { useRef, useState } from 'react'
import { Check, Mail } from 'lucide-react'
import type { Fabric } from '@/types'
import { getImageUrl } from '@/lib/getImageUrl'
import { formatPrice } from '@/lib/format'
import { requestSwatch } from '@/services'
import { content } from '@/config/content'

const prettyOpacity = (o: string) => o.replace(/-/g, ' ')

/** Fabric tile with macro-texture hover (zoom + pointer parallax) and an
 *  "Order swatch" action. */
export function FabricCard({ fabric }: { fabric: Fabric }) {
  const bgRef = useRef<HTMLDivElement>(null)
  const [sent, setSent] = useState(false)

  const onMove = (e: React.MouseEvent) => {
    const el = bgRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const rx = (e.clientX - rect.left) / rect.width - 0.5
    const ry = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `scale(1.14) translate(${-rx * 14}px, ${-ry * 14}px)`
  }
  const onLeave = () => {
    if (bgRef.current) bgRef.current.style.transform = 'scale(1)'
  }

  const onOrder = async () => {
    await requestSwatch({ fabricId: fabric.id })
    setSent(true)
    setTimeout(() => setSent(false), 2200)
  }

  return (
    <div className="flex flex-col">
      <div
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative aspect-[4/5] overflow-hidden rounded-lg border border-line shadow-soft"
      >
        <div
          ref={bgRef}
          className="absolute inset-0 transition-transform duration-500 ease-settle"
          style={{
            backgroundColor: fabric.colorHex,
            backgroundImage: `url(${getImageUrl(fabric.textureImage)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <span className="label text-white/80">
            {fabric.weightGsm} gsm · {prettyOpacity(fabric.opacity)}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-h4 text-ink">{fabric.name}</p>
          <p className="mt-0.5 text-small text-muted">{fabric.composition}</p>
        </div>
        <span className="mt-1 shrink-0 text-small text-ink">
          {formatPrice(fabric.pricePerMetre)}/m
        </span>
      </div>

      <button
        type="button"
        onClick={onOrder}
        className="mt-3 inline-flex items-center justify-center gap-2 rounded-full border border-line py-2.5 text-small text-ink transition-colors hover:border-ink"
      >
        {sent ? (
          <>
            <Check className="h-4 w-4 text-accent" strokeWidth={2} />
            {content.fabrics.swatchSent}
          </>
        ) : (
          <>
            <Mail className="h-4 w-4" strokeWidth={1.75} />
            {content.fabrics.orderSwatch}
          </>
        )}
      </button>
    </div>
  )
}
