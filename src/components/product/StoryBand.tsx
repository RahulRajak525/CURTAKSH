import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Collection } from '@/types'
import { Container, Label } from '@/components/ui'
import { getImageUrl } from '@/lib/getImageUrl'
import { productPage } from '@/config/product'

/** Which collection this product belongs to + a link back. */
export function StoryBand({ collection }: { collection: Collection }) {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundColor: 'rgb(var(--ink-rgb) / 0.9)',
          backgroundImage: `linear-gradient(to right, rgb(0 0 0 / 0.6), rgb(0 0 0 / 0.35)), url(${getImageUrl(
            collection.heroImage,
          )})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Container className="relative py-20">
        <div className="max-w-xl">
          <Label className="mb-4 block text-white/70">
            {productPage.story.eyebrow}
          </Label>
          <h2 className="font-display text-display-2 leading-[0.95] text-white">
            {collection.name}
          </h2>
          <p className="mt-4 text-body text-white/80">{collection.description}</p>
          <Link
            to={`/collections/${collection.slug}`}
            className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-small text-white transition-colors hover:bg-white hover:text-ink"
          >
            {productPage.story.cta}
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </Link>
        </div>
      </Container>
    </div>
  )
}
