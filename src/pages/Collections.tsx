import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { Collection } from '@/types'
import { useCollections } from '@/hooks'
import { Container, Section, Label, Reveal, Skeleton } from '@/components/ui'
import { getImageUrl } from '@/lib/getImageUrl'
import { pexels } from '@/config/media'

function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link
      to={`/collections/${collection.slug}`}
      className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-lg border border-line shadow-soft transition-shadow duration-base ease-settle hover:shadow-glow"
    >
      <div
        className="absolute inset-0 transition-transform duration-cinematic ease-settle group-hover:scale-[1.05]"
        style={{
          backgroundColor: 'rgb(var(--ink-rgb) / 0.06)',
          backgroundImage: `linear-gradient(to top, rgb(var(--ink-rgb) / 0.62), transparent 60%), url(${getImageUrl(
            collection.heroImage,
          )})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="relative p-6">
        <p className="font-display text-h3 text-bg">{collection.name}</p>
        <p className="mt-1 flex items-center gap-1 text-small text-bg/80">
          {collection.tagline}
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
        </p>
      </div>
    </Link>
  )
}

export function Collections() {
  const { data, isLoading, error } = useCollections()

  return (
    <>
      <header className="relative overflow-hidden border-b border-line">
        {/* hero texture */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundColor: 'rgb(var(--surface-rgb))',
            backgroundImage: `url(${getImageUrl(pexels(5835536, 1600))})`,
          }}
        />
        {/* Light-Engine-reactive wash keeps the copy readable */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(90% 120% at 20% 0%, rgb(var(--glow-rgb) / 0.4), transparent 55%), linear-gradient(to top, rgb(var(--bg-rgb)), rgb(var(--bg-rgb) / 0.55) 55%, rgb(var(--bg-rgb) / 0.2))',
          }}
        />
        <Container className="relative pb-14 pt-28">
          <Label className="mb-6 block">Shop</Label>
          <h1 className="font-display text-display-2 leading-[0.95] text-ink">
            Collections
          </h1>
          <p className="mt-5 max-w-xl text-body text-muted">
            Curtains, sheers and shades — organised by the light they make. Choose
            a direction and refine from there.
          </p>
        </Container>
      </header>

      <Section>
        <Container>
          {error ? (
            <p className="text-body text-muted">
              We couldn’t load collections just now. Please refresh.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-[4/5] rounded-lg" />
                  ))
                : data?.map((collection) => (
                    <Reveal key={collection.id} variant="fade">
                      <CollectionCard collection={collection} />
                    </Reveal>
                  ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
