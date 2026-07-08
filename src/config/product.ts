import type { HeaderStyle, LiningType } from '@/types'

/** Configurator options + the static pricing model. Both UI and lib/pricing
 *  read these, so tweaking a rate changes label and price together. */

export interface HeaderOption {
  value: HeaderStyle
  label: string
  /** fabric fullness multiplier — drives price + gather */
  fullness: number
}

export const HEADER_OPTIONS: HeaderOption[] = [
  { value: 'eyelet', label: 'Eyelet', fullness: 2.0 },
  { value: 'pinch-pleat', label: 'Pinch Pleat', fullness: 2.5 },
  { value: 'tab-top', label: 'Tab Top', fullness: 2.0 },
  { value: 'rod-pocket', label: 'Rod Pocket', fullness: 2.2 },
]

export interface LiningOption {
  value: LiningType
  label: string
  /** ₹ per m² added to the price */
  ratePerSqm: number
  /** 0..1 — how much light the night render blocks */
  block: number
}

export const LINING_OPTIONS: LiningOption[] = [
  { value: 'unlined', label: 'Unlined', ratePerSqm: 0, block: 0.15 },
  { value: 'dim-out', label: 'Dim-out', ratePerSqm: 600, block: 0.55 },
  { value: 'blackout', label: 'Blackout', ratePerSqm: 950, block: 0.95 },
]

export const PRICING = {
  /** flat make-up charge per panel set (₹) */
  makingCharge: 1500,
  /** default finished size (cm) */
  defaultWidth: 150,
  defaultDrop: 230,
  minCm: 30,
  maxCm: 400,
}

export const productPage = {
  fromLabel: 'from',
  configurator: {
    fabricLabel: 'Fabric',
    colourLabel: 'Colour',
    sizeLabel: 'Size (cm)',
    widthLabel: 'Width',
    dropLabel: 'Drop',
    headerLabel: 'Header style',
    liningLabel: 'Lining',
    quantityLabel: 'Quantity',
    metricNote: 'All measurements in centimetres.',
    addToCart: 'Add to Cart',
    added: 'Added to cart',
    swatch: 'Order a Free Swatch',
    swatchSent: 'Swatch on its way',
    priceNote: 'Price updates with your selections. Final price confirmed after measure.',
  },
  trust: [
    { title: 'Free swatches', body: 'Feel the fabric before you commit — delivered free.' },
    { title: 'Made to measure', body: 'Cut, sewn and finished to your exact window.' },
    { title: 'Free design help', body: 'Talk to a Style Expert — no charge, no pressure.' },
    { title: 'Delivery & fitting', body: 'Free fitting within 30 km of our showrooms; nationwide in 2–3 weeks.' },
  ],
  accordions: [
    {
      id: 'materials',
      title: 'Materials & Care',
      body: 'Woven and finished in small batches. Gentle machine wash or dry clean as noted on the care label. Warm iron on reverse; hang to release folds.',
      link: null,
    },
    {
      id: 'measure',
      title: 'Measurement guidance',
      body: 'Not sure how to measure? Our step-by-step guide covers width, drop and header allowances for a flawless hang.',
      link: { label: 'Read the measuring guide', href: '/guide/measure' },
    },
    {
      id: 'delivery',
      title: 'Delivery & Returns',
      body: 'Made-to-measure orders ship in 2–3 weeks. Free fitting within 30 km of a showroom. Swatches and unopened hardware returnable within 30 days.',
      link: null,
    },
  ],
  story: {
    eyebrow: 'Part of the collection',
    cta: 'Explore the collection',
  },
  related: {
    title: 'You may also like',
  },
} as const
