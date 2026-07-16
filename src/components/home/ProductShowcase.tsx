import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import type { Product } from '@/types'
import { useProducts } from '@/hooks'
import {
  Container,
  Section,
  Label,
  Reveal,
  Skeleton,
  Marquee,
  SplitText,
} from '@/components/ui'
import { getImageUrl } from '@/lib/getImageUrl'
import { formatFrom } from '@/lib/format'
import { home } from '@/config/home'

/** Seconds per card — sets a slow, even glide regardless of how many there are. */
const SECONDS_PER_CARD = 9

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

  const isEmpty = !isLoading && !error && data && data.length === 0

  return (
    <Section>
      <Container>
        <div className="mb-10 flex items-end justify-between">
          <div>
            <Reveal variant="left">
              <Label className="mb-3 block">{home.showcase.eyebrow}</Label>
            </Reveal>
            <SplitText
              as="h2"
              text={home.showcase.title}
              splitBy="word"
              delay={0.1}
              className="block max-w-xl font-display text-h1 text-ink"
            />
          </div>
          {!isLoading && !error && !isEmpty && (
            <Reveal variant="right" delay={0.3} className="hidden shrink-0 md:block">
              <Label className="text-muted/60">Hover to pause →</Label>
            </Reveal>
          )}
        </div>
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
      ) : isLoading ? (
        <div className="flex gap-6 overflow-hidden px-gutter">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-[280px] shrink-0 md:w-[340px]">
              <Skeleton className="aspect-[3/4] rounded-lg" />
              <Skeleton className="mt-4 h-5 w-1/2" />
              <Skeleton className="mt-2 h-4 w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <Marquee
          speed={(data?.length ?? 0) * SECONDS_PER_CARD}
          direction="left"
          className="px-gutter"
        >
          {data?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Marquee>
      )}
    </Section>
  )
}
