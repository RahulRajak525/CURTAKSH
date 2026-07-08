import type { Money } from '@/types'

/**
 * Money formatting. DRAPÉ sells in India — prices render in ₹ (INR) with
 * en-IN grouping (₹1,23,456). Currency comes from the Money value so a future
 * multi-region catalogue still formats correctly.
 */
export function formatPrice(money: Money, opts?: { showDecimals?: boolean }): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: money.currency,
    maximumFractionDigits: opts?.showDecimals ? 2 : 0,
  }).format(money.amount)
}

/** "from ₹8,900" — for cards where the price is a starting point. */
export function formatFrom(money: Money): string {
  return `from ${formatPrice(money)}`
}
