import type { NavItem } from '@/types'
import { pexels } from '@/config/media'

/**
 * Navigation config. Pages and chrome consume this — never hardcode nav links.
 * The mega-menu taxonomy mirrors a premium curtain/shade storefront.
 */

export interface MegaColumn {
  title: string
  items: NavItem[]
}

export interface MegaFeature {
  label: string
  caption: string
  href: string
  image: string
}

export interface MegaMenu {
  columns: MegaColumn[]
  feature: MegaFeature
}

export interface PrimaryNavItem extends NavItem {
  /** Present when this top-level item opens a full-width mega-menu. */
  mega?: MegaMenu
}

const curtainsMega: MegaMenu = {
  columns: [
    {
      title: 'By Texture',
      items: [
        { label: 'Linen', href: '/collections/linen' },
        { label: 'Cotton', href: '/collections/cotton' },
        { label: 'Velvet', href: '/collections/velvet' },
        { label: 'Sheer', href: '/collections/sheer' },
        { label: 'Blackout', href: '/collections/blackout' },
      ],
    },
    {
      title: 'By Function',
      items: [
        { label: 'Blackout', href: '/collections/blackout' },
        { label: 'Room-Darkening', href: '/collections/room-darkening' },
        { label: 'Sheer', href: '/collections/sheer' },
        { label: 'Thermal', href: '/collections/thermal' },
      ],
    },
    {
      title: 'By Space',
      items: [
        { label: 'Living Room', href: '/collections/living-room' },
        { label: 'Bedroom', href: '/collections/bedroom' },
        { label: 'Dining', href: '/collections/dining' },
        { label: 'Kids', href: '/collections/kids' },
      ],
    },
    {
      title: 'By Trend',
      items: [
        { label: 'New', href: '/collections/new' },
        { label: 'Best Sellers', href: '/collections/best-sellers' },
        { label: 'Modern', href: '/collections/modern' },
      ],
    },
  ],
  feature: {
    label: 'The Linen Collection',
    caption: 'Sheers tuned to bloom at noon',
    href: '/collections/linen',
    image: pexels(6207825, 900),
  },
}

const shadesMega: MegaMenu = {
  columns: [
    {
      title: 'By Texture',
      items: [
        { label: 'Woven Wood', href: '/collections/woven-wood' },
        { label: 'Linen', href: '/collections/linen-shades' },
        { label: 'Solar', href: '/collections/solar' },
        { label: 'Bamboo', href: '/collections/bamboo' },
        { label: 'Sheer', href: '/collections/sheer-shades' },
      ],
    },
    {
      title: 'By Function',
      items: [
        { label: 'Blackout', href: '/collections/blackout-shades' },
        { label: 'Room-Darkening', href: '/collections/room-darkening-shades' },
        { label: 'Light-Filtering', href: '/collections/light-filtering' },
        { label: 'Thermal', href: '/collections/thermal-shades' },
      ],
    },
    {
      title: 'By Space',
      items: [
        { label: 'Living Room', href: '/collections/living-room-shades' },
        { label: 'Bedroom', href: '/collections/bedroom-shades' },
        { label: 'Kitchen', href: '/collections/kitchen' },
        { label: 'Office', href: '/collections/office' },
      ],
    },
    {
      title: 'By Trend',
      items: [
        { label: 'New', href: '/collections/new-shades' },
        { label: 'Best Sellers', href: '/collections/best-selling-shades' },
        { label: 'Motorized', href: '/collections/motorized' },
      ],
    },
  ],
  feature: {
    label: 'Motorised Shades',
    caption: 'Quiet, app-controlled light',
    href: '/collections/shades',
    image: pexels(11460858, 900),
  },
}

export const primaryNav: PrimaryNavItem[] = [
  { label: 'Curtains', href: '/collections', mega: curtainsMega },
  { label: 'Shades', href: '/collections', mega: shadesMega },
  { label: 'Fabrics', href: '/fabrics' },
  { label: 'Inspiration', href: '/inspiration' },
  { label: 'Atelier', href: '/design-service', description: 'Design Service' },
]

export const footerNav: MegaColumn[] = [
  {
    title: 'Shop',
    items: [
      { label: 'Curtains', href: '/collections' },
      { label: 'Shades', href: '/collections' },
      { label: 'Fabrics', href: '/fabrics' },
      { label: 'New Arrivals', href: '/collections/new' },
    ],
  },
  {
    title: 'Discover',
    items: [
      { label: 'Inspiration', href: '/inspiration' },
      { label: 'Collections', href: '/collections' },
      { label: 'The Journal', href: '/inspiration' },
      { label: 'About Curtaksh', href: '/about' },
    ],
  },
  {
    title: 'Atelier',
    items: [
      { label: 'Design Service', href: '/design-service' },
      { label: 'Book a Consult', href: '/design-service' },
      { label: 'Made-to-Measure', href: '/design-service' },
      { label: 'Trade Program', href: '/design-service' },
    ],
  },
  {
    title: 'Support',
    items: [
      { label: 'Measuring Guide', href: '/guide/measure' },
      { label: 'Contact', href: '/contact' },
      { label: 'Shipping & Returns', href: '/contact' },
      { label: 'FAQ', href: '/contact' },
    ],
  },
]
