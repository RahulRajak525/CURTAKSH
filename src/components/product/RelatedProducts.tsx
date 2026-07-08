import { Link } from 'react-router-dom'
import type { Product } from '@/types'
import { Container, Section, Label, Skeleton } from '@/components/ui'
import { getImageUrl } from '@/lib/getImageUrl'
import { formatFrom } from '@/lib/format'
import { productPage } from '@/config/product'

/** "You may also like" rail. */
export function RelatedProducts({
  products,
  isLoading,
}: {
  products: Product[]
  isLoading: boolean
}) {
  if (!isLoading && products.length === 0) return null

  return (
    <Section>
      <Container>
        <Label className="mb-8 block">{productPage.related.title}</Label>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-[3/4] rounded-lg" />
                  <Skeleton className="mt-3 h-5 w-2/3" />
                  <Skeleton className="mt-2 h-4 w-1/3" />
                </div>
              ))
            : products.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  className="group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-line shadow-soft">
                    <div
                      className="absolute inset-0 transition-transform duration-cinematic ease-settle group-hover:scale-[1.05]"
                      style={{
                        backgroundColor: 'rgb(var(--ink-rgb) / 0.06)',
                        backgroundImage: `url(${getImageUrl(product.light.day)})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                  </div>
                  <p className="mt-3 font-display text-h4 text-ink">
                    {product.name}
                  </p>
                  <p className="mt-0.5 text-small text-ink">
                    {formatFrom(product.price)}
                  </p>
                </Link>
              ))}
        </div>
      </Container>
    </Section>
  )
}
