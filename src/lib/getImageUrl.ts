/**
 * Single choke-point for every image URL in the app so the asset host can be
 * swapped for a CDN later without touching components.
 *
 * Rules:
 *  - absolute URLs (http/https, protocol-relative, data:) pass through untouched
 *  - a leading "/" is treated as an app-relative public path
 *  - everything else is resolved against the (configurable) asset base
 *
 * Later this can prepend a CDN origin and append transform params
 * (?w=&q=&fm=) — the call sites never need to change.
 */
const ASSET_BASE = import.meta.env.VITE_ASSET_BASE_URL ?? ''

export interface ImageOptions {
  /** target width in px (reserved for future CDN transform) */
  width?: number
  /** quality 1..100 (reserved for future CDN transform) */
  quality?: number
}

export function getImageUrl(path: string, _options: ImageOptions = {}): string {
  if (!path) return ''
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) {
    return path
  }
  const clean = path.startsWith('/') ? path : `/${path}`
  return `${ASSET_BASE}${clean}`
}
