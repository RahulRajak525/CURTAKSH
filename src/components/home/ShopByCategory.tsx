import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { Collection } from '@/types'
import { useCollections } from '@/hooks'
import { Container, Section, Label, Reveal, Skeleton } from '@/components/ui'
import { getImageUrl } from '@/lib/getImageUrl'
import { home } from '@/config/home'
import { cn } from '@/lib/utils'

function CategoryCard({ collection }: { collection: Collection }) {
  return (
    <Link
      to={`/collections/${collection.slug}`}
      className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-lg border border-line shadow-soft transition-shadow duration-base ease-settle hover:shadow-glow"
    >
      {/* image / gradient placeholder — scales on hover */}
      <div
        className="absolute inset-0 transition-transform duration-cinematic ease-settle group-hover:scale-[1.06]"
        style={{
          backgroundColor: 'rgb(var(--ink-rgb) / 0.06)',
          backgroundImage: `linear-gradient(to top, rgb(var(--ink-rgb) / 0.6), transparent 62%), url(${getImageUrl(
            collection.heroImage,
          )})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* light-sweep on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full opacity-0 transition-all duration-cinematic ease-settle group-hover:translate-x-0 group-hover:opacity-100"
        style={{
          background:
            'linear-gradient(105deg, transparent 30%, rgb(var(--glow-rgb) / 0.35) 50%, transparent 70%)',
        }}
      />
      {/* label slides up on hover */}
      <div className="relative p-6">
        <p className="font-display text-h3 text-bg">{collection.name}</p>
        <p className="mt-1 flex items-center gap-1 text-small text-bg/80 transition-transform duration-base ease-settle group-hover:-translate-y-0.5">
          {collection.tagline}
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
        </p>
      </div>
    </Link>
  )
}

export function ShopByCategory() {
  const { data, isLoading, error } = useCollections()

  return (
    <Section>
      <Container>
        <Reveal variant="fade" className="mb-12 flex items-end justify-between">
          <div>
            <Label className="mb-3 block">{home.categories.eyebrow}</Label>
            <h2 className="font-display text-h1 text-ink">
              {home.categories.title}
            </h2>
          </div>
        </Reveal>

        <div
          className={cn(
            'grid grid-cols-2 gap-5 md:grid-cols-3',
            error && 'hidden',
          )}
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/5] rounded-lg" />
              ))
            : data?.map((collection) => (
                <Reveal key={collection.id} variant="fade">
                  <CategoryCard collection={collection} />
                </Reveal>
              ))}
        </div>

        {error && (
          <p className="text-body text-muted">
            We couldn’t load categories just now. Please refresh.
          </p>
        )}
      </Container>
    </Section>
  )
}
