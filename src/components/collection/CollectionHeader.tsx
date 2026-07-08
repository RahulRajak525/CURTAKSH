import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { Collection } from '@/types'
import { Container } from '@/components/ui'
import { getImageUrl } from '@/lib/getImageUrl'

/** Full-width collection band — Fraunces name, story line, Light-reactive hero,
 *  mono breadcrumbs. */
export function CollectionHeader({ collection }: { collection: Collection }) {
  return (
    <header className="relative overflow-hidden border-b border-line">
      {/* hero texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundColor: 'rgb(var(--surface-rgb))',
          backgroundImage: `url(${getImageUrl(collection.heroImage)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Light-Engine-reactive wash */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(90% 120% at 20% 0%, rgb(var(--glow-rgb) / 0.4), transparent 55%), linear-gradient(to top, rgb(var(--bg-rgb)), rgb(var(--bg-rgb) / 0.55) 55%, rgb(var(--bg-rgb) / 0.2))',
        }}
      />

      <Container className="relative pb-14 pt-28">
        {/* breadcrumbs */}
        <nav aria-label="Breadcrumb" className="label mb-8 flex items-center gap-2 text-muted">
          <Link to="/" className="transition-colors hover:text-ink">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" strokeWidth={2} />
          <Link to="/collections" className="transition-colors hover:text-ink">
            Collections
          </Link>
          <ChevronRight className="h-3 w-3" strokeWidth={2} />
          <span className="text-ink">{collection.name}</span>
        </nav>

        <h1 className="max-w-3xl font-display text-display-2 leading-[0.95] text-ink">
          {collection.name}
        </h1>
        <p className="mt-5 max-w-xl text-body text-muted">
          {collection.tagline}. {collection.description}
        </p>
      </Container>
    </header>
  )
}
