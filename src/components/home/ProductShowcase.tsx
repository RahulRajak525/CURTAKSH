import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import type { Product } from '@/types'
import { useProducts } from '@/hooks'
import { Container, Section, Label, Reveal, Skeleton } from '@/components/ui'
import { getImageUrl } from '@/lib/getImageUrl'
import { formatFrom } from '@/lib/format'
import { home } from '@/config/home'

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="group relative flex w-[280px] shrink-0 flex-col md:w-[340px]"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-line shadow-soft">
        <div
          className="absolute inset-0 transition-transform duration-cinematic ease-settle group-hover:scale-[1.05]"
          style={{
            backgroundColor: 'rgb(var(--ink-rgb) / 0.06)',
            backgroundImage: `url(${getImageUrl(product.images[0]?.src ?? '')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* quick-view affordance (span, not a nested button) */}
        <span className="pointer-events-none absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-surface/90 px-3 py-1.5 text-[11px] text-ink opacity-0 backdrop-blur transition-opacity duration-fast group-hover:opacity-100">
          <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
          Quick view
        </span>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-h4 text-ink">{product.name}</p>
          <p className="mt-0.5 text-small text-muted">{product.tagline}</p>
        </div>
        {/* fabric swatch dots */}
        <div className="mt-1 flex shrink-0 -space-x-1">
          {product.colors.slice(0, 4).map((c) => (
            <span
              key={c.name}
              title={c.name}
              className="h-4 w-4 rounded-full border border-line"
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>
      <p className="mt-2 text-small text-ink">{formatFrom(product.price)}</p>
    </Link>
  )
}

export function ProductShowcase() {
  const { data, isLoading, error } = useProducts()
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [maxDrag, setMaxDrag] = useState(0)

  useEffect(() => {
    const measure = () => {
      const vp = viewportRef.current
      const track = trackRef.current
      if (!vp || !track) return
      setMaxDrag(Math.max(0, track.scrollWidth - vp.offsetWidth))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (viewportRef.current) ro.observe(viewportRef.current)
    if (trackRef.current) ro.observe(trackRef.current)
    return () => ro.disconnect()
  }, [data])

  const isEmpty = !isLoading && !error && data && data.length === 0

  return (
    <Section>
      <Container>
        <Reveal variant="fade" className="mb-10 flex items-end justify-between">
          <div>
            <Label className="mb-3 block">{home.showcase.eyebrow}</Label>
            <h2 className="max-w-xl font-display text-h1 text-ink">
              {home.showcase.title}
            </h2>
          </div>
          {maxDrag > 0 && (
            <Label className="hidden shrink-0 text-muted/60 md:block">
              Drag to explore →
            </Label>
          )}
        </Reveal>
      </Container>

      {error ? (
        <Container>
          <p className="text-body text-muted">
            We couldn’t load products just now. Please refresh.
          </p>
        </Container>
      ) : isEmpty ? (
        <Container>
          <p className="text-body text-muted">{home.showcase.empty}</p>
        </Container>
      ) : (
        <div ref={viewportRef} className="overflow-hidden">
          <motion.div
            ref={trackRef}
            drag="x"
            dragConstraints={{ left: -maxDrag, right: 0 }}
            dragElastic={0.06}
            className="flex cursor-grab gap-6 px-gutter active:cursor-grabbing"
          >
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-[280px] shrink-0 md:w-[340px]">
                    <Skeleton className="aspect-[3/4] rounded-lg" />
                    <Skeleton className="mt-4 h-5 w-1/2" />
                    <Skeleton className="mt-2 h-4 w-1/3" />
                  </div>
                ))
              : data?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </motion.div>
        </div>
      )}
    </Section>
  )
}
