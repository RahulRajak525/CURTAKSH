/** Collection-page filter + sort configuration. Facet values are *derived* from
 *  data (see lib/productFilters); these arrays only fix display order + labels. */

export type SortKey = 'new' | 'popularity' | 'price'

export interface SortOption {
  key: SortKey
  label: string
}

export const SORT_OPTIONS: SortOption[] = [
  { key: 'new', label: 'Newest' },
  { key: 'popularity', label: 'Popularity' },
  { key: 'price', label: 'Price: Low to High' },
]

export const FACET_ORDER = {
  texture: [
    'Linen',
    'Cotton',
    'Sheer',
    'Velvet',
    'Blackout',
    'Woven',
    'Solar',
    'Bamboo',
    'Aluminium',
    'Brass',
    'Steel',
  ],
  function: ['Sheer', 'Light-Filtering', 'Room-Darkening', 'Blackout', 'Thermal'],
  space: ['Living Room', 'Bedroom', 'Dining', 'Kids', 'Kitchen', 'Office'],
} as const

export const FACET_LABELS = {
  texture: 'Texture',
  function: 'Function',
  space: 'Space',
  colour: 'Colour',
  price: 'Price',
} as const
