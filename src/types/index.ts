/**
 * Domain types for DRAPÉ. Treat these as the future REST/GraphQL API contract:
 * services resolve local seed data shaped exactly like these, so swapping in a
 * real backend later is a change of service body only.
 */

export interface Money {
  amount: number
  currency: string
}

/** How much light a fabric lets through — central to the light-reactive theme. */
export type FabricOpacity =
  | 'sheer'
  | 'light-filtering'
  | 'room-darkening'
  | 'blackout'

export interface Fabric {
  id: string
  slug: string
  name: string
  /** e.g. "100% Belgian linen" */
  composition: string
  opacity: FabricOpacity
  /** fabric weight in grams per square metre */
  weightGsm: number
  /** representative swatch colour */
  colorHex: string
  /** close-up texture image path (via getImageUrl) */
  textureImage: string
  pricePerMetre: Money
  /** short spec bullets: "Machine washable", "OEKO-TEX certified", … */
  properties: string[]
}

export interface ProductImage {
  src: string
  alt: string
  width?: number
  height?: number
}

export interface ColorOption {
  name: string
  hex: string
}

export type ProductCategory = 'curtains' | 'sheers' | 'blinds' | 'hardware'

/** Two static renders per product so cards can preview light behaviour. */
export interface LightRenders {
  day: string
  night: string
}

export interface Product {
  id: string
  slug: string
  name: string
  tagline?: string
  category: ProductCategory
  description: string
  price: Money
  images: ProductImage[]
  /** day / night renders for the per-card light toggle */
  light: LightRenders
  /** fabrics this product is available in */
  fabricIds: string[]
  collectionId?: string
  colors: ColorOption[]
  /** primary weave/material facet, e.g. "Linen" | "Sheer" | "Velvet" */
  texture: string
  /** light-behaviour facets, e.g. ["Room-Darkening", "Thermal"] */
  functions: string[]
  /** recommended rooms, e.g. ["Living Room", "Bedroom"] */
  spaces: string[]
  /** 0..100 relative popularity, for sort */
  popularity: number
  sizes?: string[]
  featured?: boolean
  /** ISO date string */
  createdAt: string
}

export interface Collection {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  heroImage: string
  productIds: string[]
  featured?: boolean
}

export interface NavItem {
  label: string
  href: string
  description?: string
  children?: NavItem[]
  featured?: boolean
}

/* ---------------- Configurator ---------------- */

export type HeaderStyle = 'eyelet' | 'pinch-pleat' | 'tab-top' | 'rod-pocket'
export type LiningType = 'unlined' | 'dim-out' | 'blackout'

/* ---------------- Cart ---------------- */

/** The made-to-measure line payload. Shaped exactly as the future API expects. */
export interface CartLineInput {
  productId: string
  fabricId?: string
  colour?: string
  /** finished width in cm */
  width?: number
  /** finished drop in cm */
  drop?: number
  header?: HeaderStyle
  lining?: LiningType
  quantity: number
}

export interface CartLine extends CartLineInput {
  id: string
}

export interface Cart {
  id: string
  lines: CartLine[]
  subtotal: Money
}

/* ---------------- Wishlist ---------------- */

export interface Wishlist {
  productIds: string[]
}

/* ---------------- Search ---------------- */

export interface SearchResult {
  type: 'product' | 'collection' | 'fabric'
  id: string
  slug: string
  title: string
  subtitle?: string
  image?: string
}

/* ---------------- Appointments (in-home / showroom consult) ---------------- */

export type AppointmentKind = 'in-home' | 'showroom' | 'virtual'

export interface AppointmentSlot {
  id: string
  /** ISO datetime */
  start: string
  available: boolean
}

export interface AppointmentRequest {
  kind: AppointmentKind
  name: string
  email: string
  phone?: string
  slotId: string
  notes?: string
}

export interface AppointmentConfirmation {
  id: string
  status: 'confirmed' | 'pending'
  request: AppointmentRequest
}

/** Design-service consultation enquiry (Atelier form). */
export interface ConsultationRequest {
  name: string
  email: string
  phone: string
  city: string
  projectType: string
  message?: string
}

export interface ConsultationConfirmation {
  id: string
  status: 'received'
  request: ConsultationRequest
}

/* ---------------- Lookbook (inspiration) ---------------- */

export interface LookScene {
  id: string
  title: string
  /** room this scene styles, e.g. "Living Room" */
  room: string
  /** aesthetic tag, e.g. "Minimal" */
  style: string
  image: string
  alt: string
  /** drives the masonry span */
  aspect: 'portrait' | 'landscape' | 'square'
  /** products featured in the shot */
  productIds: string[]
}

/* ---------------- Stores (locator) ---------------- */

export interface Store {
  id: string
  name: string
  city: string
  address: string
  phone: string
  hours: string
  /** geo — for a future map/distance API */
  lat: number
  lng: number
}

/* ---------------- Contact ---------------- */

export interface ContactMessage {
  name: string
  email: string
  topic: string
  message: string
}

export interface ContactConfirmation {
  id: string
  status: 'received'
}

/* ---------------- Async UI contract ---------------- */

/** Shape every data hook returns so loading/empty/error UI exists day one. */
export interface AsyncState<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
}
