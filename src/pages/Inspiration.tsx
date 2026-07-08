import { useMemo, useState } from 'react'
import type { Product } from '@/types'
import { useLooks, useProducts } from '@/hooks'
import { Container, Section, PageHero, Reveal, Skeleton } from '@/components/ui'
import { Lightbox } from '@/components/inspiration/Lightbox'
import { getImageUrl } from '@/lib/getImageUrl'
import { content } from '@/config/content'
import { pexels } from '@/config/media'
import { cn } from '@/lib/utils'

const aspectClass: Record<string, string> = {
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  square: 'aspect-square',
}

export function Inspiration() {
  const { data, isLoading, error } = useLooks()
  const { data: productData } = useProducts()
  const [room, setRoom] = useState<string | null>(null)
  const [style, setStyle] = useState<string | null>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const looks = useMemo(() => data ?? [], [data])
  const rooms = useMemo(() => [...new Set(looks.map((l) => l.room))], [looks])
  const styles = useMemo(() => [...new Set(looks.map((l) => l.style))], [looks])

  const filtered = useMemo(
    () =>
      looks.filter(
        (l) => (!room || l.room === room) && (!style || l.style === style),
      ),
    [looks, room, style],
  )

  const productsById = useMemo(() => {
    const map = new Map<string, Product>()
    for (const p of productData ?? []) map.set(p.id, p)
    return map
  }, [productData])

  const open = openIndex !== null ? filtered[openIndex] ?? null : null
  const nav = (dir: number) =>
    setOpenIndex((i) =>
      i === null ? i : (i + dir + filtered.length) % filtered.length,
    )

  const FilterRow = ({
    label,
    values,
    active,
    onPick,
  }: {
    label: string
    values: string[]
    active: string | null
    onPick: (v: string | null) => void
  }) => (
    <div className="flex flex-wrap items-center gap-2">
      <span className="label mr-1 text-muted">{label}</span>
      <button
        type="button"
        onClick={() => onPick(null)}
        aria-pressed={active === null}
        className={cn(
          'rounded-full border px-3.5 py-1.5 text-small transition-colors',
          active === null ? 'border-ink bg-ink text-bg' : 'border-line text-ink hover:border-ink/50',
        )}
      >
        {content.inspiration.allLabel}
      </button>
      {values.map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onPick(v)}
          aria-pressed={active === v}
          className={cn(
            'rounded-full border px-3.5 py-1.5 text-small transition-colors',
            active === v ? 'border-ink bg-ink text-bg' : 'border-line text-ink hover:border-ink/50',
          )}
        >
          {v}
        </button>
      ))}
    </div>
  )

  return (
    <>
      <PageHero
        eyebrow={content.inspiration.eyebrow}
        title={content.inspiration.title}
        intro={content.inspiration.intro}
        backgroundImage={pexels(9980246, 1600)}
      />

      <Section>
        <Container>
          {/* filters */}
          <div className="mb-12 flex flex-col gap-4">
            <FilterRow label="Room" values={rooms} active={room} onPick={setRoom} />
            <FilterRow label="Style" values={styles} active={style} onPick={setStyle} />
          </div>

          {error ? (
            <p className="text-body text-muted">
              We couldn’t load the lookbook just now. Please refresh.
            </p>
          ) : isLoading ? (
            <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className={cn('mb-5 w-full', i % 2 ? 'aspect-[3/4]' : 'aspect-[4/3]')}
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-16 text-center text-body text-muted">
              No scenes match — try another room or style.
            </p>
          ) : (
            <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
              {filtered.map((look, i) => (
                <Reveal
                  key={look.id}
                  variant="fade"
                  className="mb-5 block break-inside-avoid"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(i)}
                    className="group relative block w-full overflow-hidden rounded-lg border border-line shadow-soft"
                  >
                    <div
                      className={cn(
                        'w-full transition-transform duration-cinematic ease-settle group-hover:scale-[1.04]',
                        aspectClass[look.aspect],
                      )}
                      style={{
                        backgroundColor: 'rgb(var(--ink-rgb) / 0.06)',
                        backgroundImage: `url(${getImageUrl(look.image)})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/50 to-transparent opacity-0 transition-opacity duration-base group-hover:opacity-100">
                      <div className="p-5 text-left">
                        <p className="font-display text-h4 text-white">
                          {look.title}
                        </p>
                        <p className="text-small text-white/80">
                          {look.room} · {look.style}
                        </p>
                      </div>
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </Section>

      <Lightbox
        look={open}
        productsById={productsById}
        onClose={() => setOpenIndex(null)}
        onNav={nav}
      />
    </>
  )
}
