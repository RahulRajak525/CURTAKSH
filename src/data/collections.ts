import type { Collection } from '@/types'
import { pexels } from '@/config/media'

/**
 * Local seed data. Only ever read through services/ — never import directly.
 * These double as the homepage "shop by category" tiles; slugs match the
 * mega-menu hrefs (/collections/linen, /collections/sheer, …).
 */
export const collections: Collection[] = [
  {
    id: 'col-linen',
    slug: 'linen',
    name: 'Linen',
    tagline: 'Relaxed, breathable, timeless',
    description:
      'Stonewashed Belgian and European linens that pool softly and filter daylight without dimming a room. Our most versatile drape — equally at home in a sun-washed loft or a quiet bedroom.',
    heroImage: pexels(6207825, 1600),
    productIds: ['prd-halcyon', 'prd-linen-brise', 'prd-linen-hollis'],
    featured: true,
  },
  {
    id: 'col-sheer',
    slug: 'sheer',
    name: 'Sheer',
    tagline: 'Light, made soft',
    description:
      'Whisper-weight silk voiles that bloom at noon and glow at dusk — turning a window into a lantern.',
    heroImage: pexels(2889618, 1600),
    productIds: ['prd-aurelia', 'prd-sheer-lumen', 'prd-sheer-veil'],
  },
  {
    id: 'col-blackout',
    slug: 'blackout',
    name: 'Blackout',
    tagline: 'True dark, on command',
    description:
      'Three-pass thermal blackout curtains that block light completely and hush a room for deep rest.',
    heroImage: pexels(25685899, 1600),
    productIds: ['prd-nocturne', 'prd-blackout-umbra', 'prd-blackout-eclipse'],
  },
  {
    id: 'col-velvet',
    slug: 'velvet',
    name: 'Velvet',
    tagline: 'Depth and warmth',
    description:
      'Deep cotton and brushed-wool velvets that insulate against cold glass and dampen sound with a soft, tactile hand.',
    heroImage: pexels(13005088, 1600),
    productIds: ['prd-ember', 'prd-velvet-sable', 'prd-velvet-rosewood'],
  },
  {
    id: 'col-shades',
    slug: 'shades',
    name: 'Shades',
    tagline: 'Quiet, adjustable light',
    description:
      'Chainless motorised rollers and woven shades that temper glare while keeping the view.',
    heroImage: pexels(11460858, 1600),
    productIds: ['prd-solace-blind', 'prd-shade-solar', 'prd-shade-kestrel'],
  },
  {
    id: 'col-hardware',
    slug: 'hardware',
    name: 'Hardware',
    tagline: 'The line that disappears',
    description:
      'Recessed tracks, rods and motors machined to vanish — so the fabric is all you see.',
    heroImage: pexels(462197, 1600),
    productIds: ['prd-meridian-track', 'prd-hardware-orbit', 'prd-hardware-cleat'],
  },
]
