import { useState } from 'react'
import { Minus, Plus, Check, ShoppingBag, Mail, Heart } from 'lucide-react'
import type { Fabric, Product } from '@/types'
import type { Configuration } from '@/lib/pricing'
import { computePrice } from '@/lib/pricing'
import { HEADER_OPTIONS, LINING_OPTIONS, PRICING, productPage } from '@/config/product'
import { formatPrice, formatFrom } from '@/lib/format'
import { addToCart, requestSwatch } from '@/services'
import { useWishlist } from '@/hooks'
import { HeaderStyleIcon } from './HeaderStyleIcon'
import { cn, clamp } from '@/lib/utils'

const c = productPage.configurator

function GroupLabel({ children }: { children: React.ReactNode }) {
  return <span className="label mb-3 block text-muted">{children}</span>
}

export function Configurator({
  product,
  fabrics,
  config,
  onChange,
}: {
  product: Product
  fabrics: Fabric[]
  config: Configuration
  onChange: (next: Configuration) => void
}) {
  const wishlist = useWishlist()
  const [added, setAdded] = useState(false)
  const [swatchSent, setSwatchSent] = useState(false)
  const [busy, setBusy] = useState(false)

  const selectedFabric = fabrics.find((f) => f.id === config.fabricId)
  const price = computePrice(product, selectedFabric, config)

  const set = (patch: Partial<Configuration>) => onChange({ ...config, ...patch })
  const setCm = (key: 'width' | 'drop', raw: number) =>
    set({ [key]: clamp(Math.round(raw), PRICING.minCm, PRICING.maxCm) })

  const onAddToCart = async () => {
    setBusy(true)
    // Payload shaped exactly as the future API expects.
    await addToCart({
      productId: product.id,
      fabricId: config.fabricId,
      colour: config.colour,
      width: config.width,
      drop: config.drop,
      header: config.header,
      lining: config.lining,
      quantity: config.quantity,
    })
    window.dispatchEvent(new Event('drape:store'))
    setBusy(false)
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  const onSwatch = async () => {
    await requestSwatch({
      productId: product.id,
      fabricId: config.fabricId,
      colour: config.colour,
    })
    setSwatchSent(true)
    setTimeout(() => setSwatchSent(false), 2200)
  }

  const wished = wishlist.has(product.id)

  return (
    <div className="flex flex-col gap-8">
      {/* Fabric */}
      {fabrics.length > 0 && (
        <div>
          <GroupLabel>{c.fabricLabel}</GroupLabel>
          <div className="flex flex-col gap-2">
            {fabrics.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => set({ fabricId: f.id })}
                aria-pressed={config.fabricId === f.id}
                className={cn(
                  'flex items-center gap-3 rounded-lg border p-3 text-left transition-colors',
                  config.fabricId === f.id
                    ? 'border-ink'
                    : 'border-line hover:border-ink/40',
                )}
              >
                <span
                  className="h-9 w-9 shrink-0 rounded-md border border-line"
                  style={{ backgroundColor: f.colorHex }}
                />
                <span className="flex-1">
                  <span className="block text-small text-ink">{f.name}</span>
                  <span className="block text-small text-muted">
                    {f.composition}
                  </span>
                </span>
                <span className="text-small text-muted">
                  {formatPrice(f.pricePerMetre)}/m
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Colour */}
      {product.colors.length > 0 && (
        <div>
          <GroupLabel>{c.colourLabel}</GroupLabel>
          <div className="flex flex-wrap gap-2.5">
            {product.colors.map((col) => (
              <button
                key={col.name}
                type="button"
                onClick={() => set({ colour: col.name })}
                aria-pressed={config.colour === col.name}
                aria-label={col.name}
                title={col.name}
                className={cn(
                  'h-9 w-9 rounded-full border transition-transform',
                  config.colour === col.name
                    ? 'border-ink ring-2 ring-ink ring-offset-2 ring-offset-bg'
                    : 'border-line hover:scale-110',
                )}
                style={{ backgroundColor: col.hex }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="label text-muted">{c.sizeLabel}</span>
          <span className="text-small text-muted/70">{c.metricNote}</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {(['width', 'drop'] as const).map((dim) => (
            <label key={dim} className="block">
              <span className="mb-1.5 block text-small text-muted">
                {dim === 'width' ? c.widthLabel : c.dropLabel}
              </span>
              <div className="flex items-center rounded-lg border border-line focus-within:border-ink">
                <input
                  type="number"
                  inputMode="numeric"
                  min={PRICING.minCm}
                  max={PRICING.maxCm}
                  value={config[dim]}
                  onChange={(e) => setCm(dim, Number(e.target.value))}
                  className="w-full bg-transparent px-3 py-2.5 text-body text-ink outline-none"
                />
                <span className="px-3 text-small text-muted">cm</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Header style */}
      <div>
        <GroupLabel>{c.headerLabel}</GroupLabel>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {HEADER_OPTIONS.map((h) => (
            <button
              key={h.value}
              type="button"
              onClick={() => set({ header: h.value })}
              aria-pressed={config.header === h.value}
              className={cn(
                'flex flex-col items-center gap-2 rounded-lg border px-2 py-3 text-center transition-colors',
                config.header === h.value
                  ? 'border-ink text-ink'
                  : 'border-line text-muted hover:border-ink/40',
              )}
            >
              <HeaderStyleIcon type={h.value} />
              <span className="text-[11px] leading-tight">{h.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Lining */}
      <div>
        <GroupLabel>{c.liningLabel}</GroupLabel>
        <div className="flex flex-wrap gap-2.5">
          {LINING_OPTIONS.map((l) => (
            <button
              key={l.value}
              type="button"
              onClick={() => set({ lining: l.value })}
              aria-pressed={config.lining === l.value}
              className={cn(
                'rounded-full border px-4 py-2 text-small transition-colors',
                config.lining === l.value
                  ? 'border-ink bg-ink text-bg'
                  : 'border-line text-ink hover:border-ink/40',
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <GroupLabel>{c.quantityLabel}</GroupLabel>
        <div className="inline-flex items-center rounded-full border border-line">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => set({ quantity: Math.max(1, config.quantity - 1) })}
            className="flex h-10 w-10 items-center justify-center text-ink hover:bg-ink/[0.05]"
          >
            <Minus className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <span className="w-10 text-center text-body text-ink">
            {config.quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => set({ quantity: Math.min(20, config.quantity + 1) })}
            className="flex h-10 w-10 items-center justify-center text-ink hover:bg-ink/[0.05]"
          >
            <Plus className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Price + actions */}
      <div className="border-t border-line pt-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="label text-muted">{productPage.fromLabel}</span>
            <p className="font-display text-h2 text-ink">{formatPrice(price)}</p>
          </div>
          <span className="text-small text-muted">{formatFrom(product.price)}</span>
        </div>
        <p className="mt-2 text-small text-muted">{c.priceNote}</p>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onAddToCart}
            disabled={busy}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-small text-bg transition-colors hover:bg-ink/90 disabled:opacity-60"
          >
            {added ? (
              <>
                <Check className="h-4 w-4" strokeWidth={2} />
                {c.added}
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
                {c.addToCart}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => wishlist.toggle(product.id)}
            aria-pressed={wished}
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
            className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-ink/[0.05]"
          >
            <Heart
              className={cn('h-5 w-5', wished && 'text-accent')}
              strokeWidth={1.75}
              fill={wished ? 'currentColor' : 'none'}
            />
          </button>
        </div>

        <button
          type="button"
          onClick={onSwatch}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-line px-6 py-3 text-small text-ink transition-colors hover:border-ink"
        >
          {swatchSent ? (
            <>
              <Check className="h-4 w-4 text-accent" strokeWidth={2} />
              {c.swatchSent}
            </>
          ) : (
            <>
              <Mail className="h-4 w-4" strokeWidth={1.75} />
              {c.swatch}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
