import type { Product, ColorOption } from '@/types'
import { productImages } from '@/config/media'

/**
 * Local seed data. Only ever read through services/ — never import directly.
 *
 * Authored as a terse `Seed` then expanded to full `Product`s (day/night render
 * paths + INR price + colour swatches derived from the shared palette). This is
 * the future API contract, so every product carries the facet fields the
 * collection page filters on: texture / functions / spaces / colours / price /
 * popularity.
 */

const HEX: Record<string, string> = {
  Mist: '#D8CFC0',
  Dune: '#C9A981',
  Cloud: '#F1EBE1',
  Ember: '#8C5A3C',
  Nocturne: '#1E1A17',
  Slate: '#4A5568',
  Ivory: '#EFE7D9',
  Sage: '#9CA789',
  Blush: '#E0B7A0',
  Graphite: '#2A2A2A',
  Brass: '#C89B5A',
  Silver: '#C7C4BE',
}

interface Seed {
  id: string
  slug: string
  name: string
  tagline: string
  category: Product['category']
  description: string
  priceInr: number
  collectionId: string
  texture: string
  functions: string[]
  spaces: string[]
  colors: string[]
  fabricIds: string[]
  popularity: number
  sizes?: string[]
  featured?: boolean
  createdAt: string
}

const CURTAIN_SIZES = ['215 cm', '245 cm', '275 cm', 'Custom']

const seed: Seed[] = [
  // ── Linen ─────────────────────────────────────────────
  {
    id: 'prd-halcyon',
    slug: 'halcyon-linen-drape',
    name: 'Halcyon',
    tagline: 'The everyday linen, perfected',
    category: 'curtains',
    description:
      'A relaxed, floor-pooling linen curtain that softens light without dimming a room. Our most versatile drape.',
    priceInr: 8900,
    collectionId: 'col-linen',
    texture: 'Linen',
    functions: ['Light-Filtering'],
    spaces: ['Living Room', 'Bedroom'],
    colors: ['Mist', 'Dune'],
    fabricIds: ['fab-linen-mist', 'fab-linen-dune'],
    popularity: 92,
    sizes: CURTAIN_SIZES,
    featured: true,
    createdAt: '2026-01-12',
  },
  {
    id: 'prd-linen-brise',
    slug: 'brise-linen-sheer',
    name: 'Brise',
    tagline: 'A breath of linen light',
    category: 'sheers',
    description:
      'An airy loose-weave linen that lifts with a breeze and diffuses the afternoon into a soft wash.',
    priceInr: 9600,
    collectionId: 'col-linen',
    texture: 'Linen',
    functions: ['Light-Filtering', 'Thermal'],
    spaces: ['Living Room', 'Dining'],
    colors: ['Ivory', 'Sage'],
    fabricIds: ['fab-linen-mist'],
    popularity: 70,
    sizes: CURTAIN_SIZES,
    createdAt: '2026-03-01',
  },
  {
    id: 'prd-linen-hollis',
    slug: 'hollis-linen-drape',
    name: 'Hollis',
    tagline: 'Weighted linen, quiet rooms',
    category: 'curtains',
    description:
      'A heavier stonewashed linen with a room-darkening lining — structured folds and a calm hush.',
    priceInr: 10400,
    collectionId: 'col-linen',
    texture: 'Linen',
    functions: ['Room-Darkening'],
    spaces: ['Bedroom'],
    colors: ['Dune', 'Slate'],
    fabricIds: ['fab-linen-dune'],
    popularity: 61,
    sizes: CURTAIN_SIZES,
    createdAt: '2026-04-02',
  },

  // ── Sheer ─────────────────────────────────────────────
  {
    id: 'prd-aurelia',
    slug: 'aurelia-silk-sheer',
    name: 'Aurelia',
    tagline: 'Light, made visible',
    category: 'sheers',
    description:
      'A whisper-weight silk voile that blooms at noon and glows at dusk. Turns a window into a lantern.',
    priceInr: 12400,
    collectionId: 'col-sheer',
    texture: 'Sheer',
    functions: ['Sheer'],
    spaces: ['Living Room', 'Dining'],
    colors: ['Cloud'],
    fabricIds: ['fab-voile-cloud'],
    popularity: 88,
    sizes: ['245 cm', '275 cm', 'Custom'],
    featured: true,
    createdAt: '2026-02-03',
  },
  {
    id: 'prd-sheer-lumen',
    slug: 'lumen-silk-sheer',
    name: 'Lumen',
    tagline: 'Warm haze, all day',
    category: 'sheers',
    description:
      'A cotton-silk voile with a faint champagne cast that keeps a room bright but never bare.',
    priceInr: 11200,
    collectionId: 'col-sheer',
    texture: 'Sheer',
    functions: ['Sheer'],
    spaces: ['Living Room'],
    colors: ['Ivory', 'Blush'],
    fabricIds: ['fab-voile-cloud'],
    popularity: 74,
    sizes: ['245 cm', '275 cm', 'Custom'],
    createdAt: '2026-03-12',
  },
  {
    id: 'prd-sheer-veil',
    slug: 'veil-cotton-sheer',
    name: 'Veil',
    tagline: 'Soft privacy, gentle glow',
    category: 'sheers',
    description:
      'A close cotton voile that filters more light for bedrooms and kids’ rooms while staying luminous.',
    priceInr: 9800,
    collectionId: 'col-sheer',
    texture: 'Sheer',
    functions: ['Sheer', 'Light-Filtering'],
    spaces: ['Bedroom', 'Kids'],
    colors: ['Cloud', 'Sage'],
    fabricIds: ['fab-voile-cloud'],
    popularity: 66,
    sizes: ['215 cm', '245 cm', 'Custom'],
    createdAt: '2026-04-20',
  },

  // ── Blackout ──────────────────────────────────────────
  {
    id: 'prd-nocturne',
    slug: 'nocturne-velvet-blackout',
    name: 'Nocturne',
    tagline: 'Absolute dark, on command',
    category: 'curtains',
    description:
      'A deep cotton-velvet blackout curtain with a three-pass thermal lining. Blocks light completely.',
    priceInr: 16800,
    collectionId: 'col-blackout',
    texture: 'Blackout',
    functions: ['Blackout', 'Thermal'],
    spaces: ['Bedroom'],
    colors: ['Nocturne'],
    fabricIds: ['fab-velvet-nocturne'],
    popularity: 90,
    sizes: CURTAIN_SIZES,
    featured: true,
    createdAt: '2026-02-20',
  },
  {
    id: 'prd-blackout-umbra',
    slug: 'umbra-blackout',
    name: 'Umbra',
    tagline: 'Room-darkening, made simple',
    category: 'curtains',
    description:
      'A matte woven blackout with a soft hand — near-total dark for bedrooms and nurseries.',
    priceInr: 15200,
    collectionId: 'col-blackout',
    texture: 'Blackout',
    functions: ['Blackout', 'Room-Darkening'],
    spaces: ['Bedroom', 'Kids'],
    colors: ['Graphite', 'Slate'],
    fabricIds: ['fab-velvet-nocturne'],
    popularity: 77,
    sizes: CURTAIN_SIZES,
    createdAt: '2026-03-18',
  },
  {
    id: 'prd-blackout-eclipse',
    slug: 'eclipse-blackout',
    name: 'Eclipse',
    tagline: 'Cinema dark, thermal warm',
    category: 'curtains',
    description:
      'A dense triple-weave blackout that also insulates — for media rooms and west-facing glass.',
    priceInr: 17600,
    collectionId: 'col-blackout',
    texture: 'Blackout',
    functions: ['Blackout', 'Thermal'],
    spaces: ['Living Room', 'Bedroom'],
    colors: ['Nocturne', 'Graphite'],
    fabricIds: ['fab-velvet-nocturne'],
    popularity: 69,
    sizes: CURTAIN_SIZES,
    createdAt: '2026-04-28',
  },

  // ── Velvet ────────────────────────────────────────────
  {
    id: 'prd-ember',
    slug: 'ember-wool-drape',
    name: 'Ember',
    tagline: 'Warmth you can draw closed',
    category: 'curtains',
    description:
      'A brushed merino-and-cashmere drape that insulates against cold glass and dampens sound.',
    priceInr: 14200,
    collectionId: 'col-velvet',
    texture: 'Velvet',
    functions: ['Room-Darkening', 'Thermal'],
    spaces: ['Living Room', 'Bedroom'],
    colors: ['Ember'],
    fabricIds: ['fab-wool-ember'],
    popularity: 84,
    sizes: ['245 cm', '275 cm', 'Custom'],
    createdAt: '2026-03-08',
  },
  {
    id: 'prd-velvet-sable',
    slug: 'sable-velvet',
    name: 'Sable',
    tagline: 'Deep pile, deeper quiet',
    category: 'curtains',
    description:
      'A dense cotton velvet that swallows sound and light for a plush, grounded room.',
    priceInr: 15800,
    collectionId: 'col-velvet',
    texture: 'Velvet',
    functions: ['Room-Darkening', 'Thermal'],
    spaces: ['Living Room', 'Dining'],
    colors: ['Graphite', 'Nocturne'],
    fabricIds: ['fab-wool-ember', 'fab-velvet-nocturne'],
    popularity: 72,
    sizes: ['245 cm', '275 cm', 'Custom'],
    createdAt: '2026-04-05',
  },
  {
    id: 'prd-velvet-rosewood',
    slug: 'rosewood-velvet',
    name: 'Rosewood',
    tagline: 'A warm blush of velvet',
    category: 'curtains',
    description:
      'A softer velvet in muted rose and clay — room-darkening with a romantic, tactile drape.',
    priceInr: 13600,
    collectionId: 'col-velvet',
    texture: 'Velvet',
    functions: ['Room-Darkening'],
    spaces: ['Bedroom', 'Dining'],
    colors: ['Blush', 'Ember'],
    fabricIds: ['fab-wool-ember'],
    popularity: 58,
    sizes: ['245 cm', '275 cm', 'Custom'],
    createdAt: '2026-05-01',
  },

  // ── Shades ────────────────────────────────────────────
  {
    id: 'prd-solace-blind',
    slug: 'solace-roller-blind',
    name: 'Solace',
    tagline: 'Quiet control of the day',
    category: 'blinds',
    description:
      'A light-filtering roller in washed linen with a chainless motorised roll. Tempers glare, keeps the view.',
    priceInr: 7400,
    collectionId: 'col-shades',
    texture: 'Woven',
    functions: ['Light-Filtering'],
    spaces: ['Living Room', 'Kitchen'],
    colors: ['Dune', 'Mist'],
    fabricIds: ['fab-linen-dune', 'fab-linen-mist'],
    popularity: 80,
    sizes: ['Custom'],
    createdAt: '2026-04-11',
  },
  {
    id: 'prd-shade-solar',
    slug: 'sol-solar-shade',
    name: 'Sol',
    tagline: 'Cut glare, keep the view',
    category: 'blinds',
    description:
      'A solar shade that blocks heat and UV while preserving the outward view — ideal for screens and desks.',
    priceInr: 8200,
    collectionId: 'col-shades',
    texture: 'Solar',
    functions: ['Light-Filtering', 'Thermal'],
    spaces: ['Office', 'Living Room'],
    colors: ['Silver', 'Slate'],
    fabricIds: ['fab-linen-mist'],
    popularity: 63,
    sizes: ['Custom'],
    createdAt: '2026-04-15',
  },
  {
    id: 'prd-shade-kestrel',
    slug: 'kestrel-woven-shade',
    name: 'Kestrel',
    tagline: 'Woven warmth, room-darkening',
    category: 'blinds',
    description:
      'A woven bamboo shade with a room-darkening liner — texture by day, true privacy by night.',
    priceInr: 9100,
    collectionId: 'col-shades',
    texture: 'Bamboo',
    functions: ['Room-Darkening'],
    spaces: ['Bedroom', 'Living Room'],
    colors: ['Dune', 'Ember'],
    fabricIds: ['fab-linen-dune'],
    popularity: 55,
    sizes: ['Custom'],
    createdAt: '2026-05-06',
  },

  // ── Hardware ──────────────────────────────────────────
  {
    id: 'prd-meridian-track',
    slug: 'meridian-ceiling-track',
    name: 'Meridian Track',
    tagline: 'The line that disappears',
    category: 'hardware',
    description:
      'A recessed ceiling track machined from anodised aluminium. Hides the mechanism so the fabric falls from nowhere.',
    priceInr: 5200,
    collectionId: 'col-hardware',
    texture: 'Aluminium',
    functions: [],
    spaces: ['Living Room', 'Bedroom'],
    colors: ['Silver', 'Graphite'],
    fabricIds: [],
    popularity: 60,
    createdAt: '2026-03-30',
  },
  {
    id: 'prd-hardware-orbit',
    slug: 'orbit-brass-rod',
    name: 'Orbit Rod',
    tagline: 'Brass, turned by hand',
    category: 'hardware',
    description:
      'A slim solid-brass rod with turned finials — a warm metal line above the drape.',
    priceInr: 4200,
    collectionId: 'col-hardware',
    texture: 'Brass',
    functions: [],
    spaces: ['Living Room', 'Dining'],
    colors: ['Brass', 'Graphite'],
    fabricIds: [],
    popularity: 52,
    createdAt: '2026-04-22',
  },
  {
    id: 'prd-hardware-cleat',
    slug: 'cleat-hold-set',
    name: 'Cleat Set',
    tagline: 'The small, considered detail',
    category: 'hardware',
    description:
      'Machined holdbacks and cleats in brushed steel — the quiet punctuation of a well-dressed window.',
    priceInr: 1800,
    collectionId: 'col-hardware',
    texture: 'Steel',
    functions: [],
    spaces: ['Bedroom', 'Kids'],
    colors: ['Silver', 'Graphite'],
    fabricIds: [],
    popularity: 40,
    createdAt: '2026-05-10',
  },
]

export const products: Product[] = seed.map((s) => {
  const { day, night } = productImages(s.slug)
  return {
    id: s.id,
    slug: s.slug,
    name: s.name,
    tagline: s.tagline,
    category: s.category,
    description: s.description,
    price: { amount: s.priceInr, currency: 'INR' },
    images: [
      { src: day, alt: `${s.name} in daylight` },
      { src: night, alt: `${s.name} at night` },
    ],
    light: { day, night },
    fabricIds: s.fabricIds,
    collectionId: s.collectionId,
    colors: s.colors.map((n): ColorOption => ({ name: n, hex: HEX[n] ?? '#CCCCCC' })),
    texture: s.texture,
    functions: s.functions,
    spaces: s.spaces,
    popularity: s.popularity,
    sizes: s.sizes,
    featured: s.featured,
    createdAt: s.createdAt,
  }
})
