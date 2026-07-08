import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import type { Fabric } from '@/types'
import { useFabrics } from '@/hooks'
import { Container, Section, Label, Skeleton } from '@/components/ui'
import { getImageUrl } from '@/lib/getImageUrl'
import { formatPrice } from '@/lib/format'
import { home } from '@/config/home'
import { cn } from '@/lib/utils'

/** Very soft, WebAudio-generated "fabric rustle" — filtered noise, low gain. */
function useRustle() {
  const ctxRef = useRef<AudioContext | null>(null)
  const nodesRef = useRef<{ src: AudioBufferSourceNode; gain: GainNode } | null>(
    null,
  )
  const [on, setOn] = useState(false)

  const toggle = () => {
    try {
      if (!on) {
        const Ctor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext
        const ctx = ctxRef.current ?? new Ctor()
        ctxRef.current = ctx
        const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
        const ch = buffer.getChannelData(0)
        for (let i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * 0.5
        const src = ctx.createBufferSource()
        src.buffer = buffer
        src.loop = true
        const lp = ctx.createBiquadFilter()
        lp.type = 'lowpass'
        lp.frequency.value = 900
        const gain = ctx.createGain()
        gain.gain.value = 0.015
        src.connect(lp).connect(gain).connect(ctx.destination)
        src.start()
        nodesRef.current = { src, gain }
        setOn(true)
      } else {
        nodesRef.current?.src.stop()
        nodesRef.current = null
        setOn(false)
      }
    } catch {
      /* audio unavailable — ignore */
    }
  }

  useEffect(() => () => nodesRef.current?.src.stop(), [])
  return { on, toggle }
}

function Preview({ fabric }: { fabric: Fabric }) {
  const bgRef = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent) => {
    const el = bgRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const rx = (e.clientX - rect.left) / rect.width - 0.5
    const ry = (e.clientY - rect.top) / rect.height - 0.5
    // parallax depth
    el.style.transform = `scale(1.18) translate(${-rx * 18}px, ${-ry * 18}px)`
  }
  const onLeave = () => {
    if (bgRef.current) bgRef.current.style.transform = 'scale(1.12)'
  }

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-line shadow-soft"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 scale-[1.12] transition-transform duration-500 ease-settle"
        style={{
          backgroundColor: fabric.colorHex,
          backgroundImage: `url(${getImageUrl(fabric.textureImage)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
      {/* mono spec label */}
      <div className="absolute bottom-0 left-0 p-6 text-white">
        <p className="font-display text-h3">{fabric.name}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          <span className="label text-white/80">{fabric.composition}</span>
          <span className="label text-white/80">{fabric.weightGsm} gsm</span>
          <span className="label text-white/80">
            {fabric.opacity.replace('-', ' ')}
          </span>
          <span className="label text-white/80">
            {formatPrice(fabric.pricePerMetre)}/m
          </span>
        </div>
      </div>
    </div>
  )
}

export function Materials() {
  const { data, isLoading, error } = useFabrics()
  const [active, setActive] = useState(0)
  const rustle = useRustle()

  if (error) return null

  const fabrics = data ?? []
  const activeFabric = fabrics[Math.min(active, fabrics.length - 1)]

  return (
    <Section>
      <Container>
        <div className="mb-10 flex items-end justify-between gap-6">
          <div className="max-w-xl">
            <Label className="mb-3 block">{home.materials.eyebrow}</Label>
            <h2 className="font-display text-h1 text-ink">
              {home.materials.headline}
            </h2>
            <p className="mt-4 text-body text-muted">{home.materials.sub}</p>
          </div>
          <button
            type="button"
            onClick={rustle.toggle}
            aria-pressed={rustle.on}
            title="Ambient fabric sound"
            className={cn(
              'hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors md:flex',
              rustle.on
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-line text-muted hover:text-ink',
            )}
          >
            {rustle.on ? (
              <Volume2 className="h-4 w-4" strokeWidth={1.75} />
            ) : (
              <VolumeX className="h-4 w-4" strokeWidth={1.75} />
            )}
          </button>
        </div>

        {isLoading || !activeFabric ? (
          <Skeleton className="aspect-[16/10] w-full rounded-lg" />
        ) : (
          <>
            <Preview fabric={activeFabric} />
            <div className="mt-6 flex flex-wrap gap-3">
              {fabrics.map((fabric, i) => (
                <button
                  key={fabric.id}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                  className={cn(
                    'flex items-center gap-2.5 rounded-full border py-2 pl-2 pr-4 text-small transition-colors duration-fast',
                    i === active
                      ? 'border-ink text-ink'
                      : 'border-line text-muted hover:text-ink',
                  )}
                >
                  <span
                    className="h-6 w-6 rounded-full border border-line"
                    style={{ backgroundColor: fabric.colorHex }}
                  />
                  {fabric.name}
                </button>
              ))}
            </div>
          </>
        )}
      </Container>
    </Section>
  )
}
