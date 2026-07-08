import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { Collection, Fabric, Product } from '@/types'
import { useProduct, useFabrics, useCollections, useProducts } from '@/hooks'
import { Container, Section, Label, Skeleton } from '@/components/ui'
import { ProductGallery } from '@/components/product/ProductGallery'
import { Configurator } from '@/components/product/Configurator'
import { TrustRow } from '@/components/product/TrustRow'
import { ProductAccordions } from '@/components/product/ProductAccordions'
import { StoryBand } from '@/components/product/StoryBand'
import { RelatedProducts } from '@/components/product/RelatedProducts'
import type { Configuration } from '@/lib/pricing'
import { liningBlock } from '@/lib/pricing'
import { formatFrom } from '@/lib/format'
import { PRICING } from '@/config/product'

/** Owns the configurator state once the product is loaded (so gallery + details
 *  share one source of truth for colour + lining). */
function ConfiguredProduct({
  product,
  fabrics,
  collection,
  related,
  relatedLoading,
}: {
  product: Product
  fabrics: Fabric[]
  collection?: Collection
  related: Product[]
  relatedLoading: boolean
}) {
  const [config, setConfig] = useState<Configuration>({
    fabricId: product.fabricIds[0],
    colour: product.colors[0]?.name,
    width: PRICING.defaultWidth,
    drop: PRICING.defaultDrop,
    header: 'eyelet',
    lining: 'unlined',
    quantity: 1,
  })

  const selectedFabric = fabrics.find((f) => f.id === config.fabricId)
  const colorHex =
    product.colors.find((col) => col.name === config.colour)?.hex ??
    product.colors[0]?.hex ??
    '#cccccc'
  const block = liningBlock(config.lining)

  return (
    <>
      <Container className="pt-28">
        {/* breadcrumbs */}
        <nav aria-label="Breadcrumb" className="label mb-8 flex items-center gap-2 text-muted">
          <Link to="/" className="transition-colors hover:text-ink">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" strokeWidth={2} />
          {collection && (
            <>
              <Link
                to={`/collections/${collection.slug}`}
                className="transition-colors hover:text-ink"
              >
                {collection.name}
              </Link>
              <ChevronRight className="h-3 w-3" strokeWidth={2} />
            </>
          )}
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* gallery (sticky) */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductGallery product={product} colorHex={colorHex} block={block} />
          </div>

          {/* details */}
          <div>
            <Label className="text-muted">{product.category}</Label>
            <h1 className="mt-2 font-display text-display-2 leading-[0.95] text-ink">
              {product.name}
            </h1>
            <p className="mt-3 text-h4 text-ink">{formatFrom(product.price)}</p>
            <p className="mt-5 max-w-md text-body text-muted">
              {product.description}
            </p>

            <div className="mt-8">
              <Configurator
                product={product}
                fabrics={fabrics}
                config={config}
                onChange={setConfig}
              />
            </div>
          </div>
        </div>

        {/* trust + accordions */}
        <div className="mt-16">
          <TrustRow />
        </div>
        <div className="mt-4 max-w-3xl">
          <ProductAccordions fabric={selectedFabric} />
        </div>
      </Container>

      {collection && (
        <div className="mt-20">
          <StoryBand collection={collection} />
        </div>
      )}

      <RelatedProducts products={related} isLoading={relatedLoading} />
    </>
  )
}

function LoadingState() {
  return (
    <Container className="pt-28">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Skeleton className="aspect-[4/5] rounded-lg" />
        <div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-4 h-12 w-2/3" />
          <Skeleton className="mt-4 h-6 w-32" />
          <Skeleton className="mt-6 h-24 w-full" />
          <Skeleton className="mt-8 h-40 w-full" />
        </div>
      </div>
    </Container>
  )
}

export function ProductDetail() {
  const { slug = '' } = useParams()
  const { data: product, isLoading, error } = useProduct(slug)
  const { data: allFabrics } = useFabrics()
  const { data: allCollections } = useCollections()
  const { data: relatedRaw, isLoading: relatedLoading } = useProducts(
    product ? { collectionId: product.collectionId } : undefined,
  )

  if (isLoading) return <LoadingState />

  if (error) {
    return (
      <Section className="min-h-[60vh]">
        <Container className="text-center">
          <p className="text-body text-muted">
            Something went wrong loading this product. Please refresh.
          </p>
        </Container>
      </Section>
    )
  }

  if (!product) {
    return (
      <Section className="flex min-h-[60vh] items-center">
        <Container className="text-center">
          <Label>Not found</Label>
          <p className="mt-4 font-display text-h1 text-ink">
            This piece has moved on
          </p>
          <p className="mx-auto mt-4 max-w-sm text-body text-muted">
            The product you’re after is no longer available.
          </p>
          <Link
            to="/collections"
            className="mt-8 inline-block border-b border-line pb-1 text-small text-ink transition-colors hover:border-ink"
          >
            Browse collections
          </Link>
        </Container>
      </Section>
    )
  }

  const fabrics = (allFabrics ?? []).filter((f) =>
    product.fabricIds.includes(f.id),
  )
  const collection = allCollections?.find((c) => c.id === product.collectionId)
  const related = (relatedRaw ?? [])
    .filter((p) => p.id !== product.id)
    .slice(0, 4)

  return (
    <ConfiguredProduct
      product={product}
      fabrics={fabrics}
      collection={collection}
      related={related}
      relatedLoading={relatedLoading}
    />
  )
}
