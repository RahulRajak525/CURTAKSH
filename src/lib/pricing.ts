import type { Product, Fabric, HeaderStyle, LiningType, Money } from '@/types'
import { HEADER_OPTIONS, LINING_OPTIONS, PRICING } from '@/config/product'

export interface Configuration {
  fabricId?: string
  colour?: string
  width: number // cm
  drop: number // cm
  header: HeaderStyle
  lining: LiningType
  quantity: number
}

/**
 * Static made-to-measure price model (₹). Monotonic in size, fullness, lining
 * and quantity so the UI recalculates predictably. Swap for a server quote later
 * — the inputs are the cart payload.
 *
 *   unit = fabricRate · area · fullness  +  liningRate · area  +  makingCharge
 *   total = unit · quantity
 */
export function computePrice(
  product: Product,
  fabric: Fabric | undefined,
  config: Configuration,
): Money {
  const widthM = Math.max(config.width, 0) / 100
  const dropM = Math.max(config.drop, 0) / 100
  const area = widthM * dropM // m²

  const fullness =
    HEADER_OPTIONS.find((h) => h.value === config.header)?.fullness ?? 2
  const lining = LINING_OPTIONS.find((l) => l.value === config.lining)
  const fabricRate = fabric?.pricePerMetre.amount ?? product.price.amount

  const fabricCost = fabricRate * area * fullness
  const liningCost = (lining?.ratePerSqm ?? 0) * area
  const unit = fabricCost + liningCost + PRICING.makingCharge

  const amount = Math.max(0, Math.round((unit * config.quantity) / 10) * 10)
  return { amount, currency: product.price.currency }
}

/** Night-render light-blocking, 0..1, from the chosen lining. */
export function liningBlock(lining: LiningType): number {
  return LINING_OPTIONS.find((l) => l.value === lining)?.block ?? 0.15
}
