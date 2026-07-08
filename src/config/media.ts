/**
 * Curated free stock photography (Pexels — hot-linkable, no API key required),
 * used as the seed imagery for the storefront. Centralised so any single photo
 * is a one-line swap; every consumer still resolves through lib/getImageUrl
 * (absolute URLs pass through untouched).
 *
 * `pexels(id, w)` builds a compressed, resized CDN URL. Pexels resizes on the
 * fly via query params, keeping payloads small.
 */
export function pexels(id: number, w = 1200): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`
}

/** Interior scenes — dressed windows, drapes in rooms. */
const drapes = [
  5835536, 35165092, 28098308, 23110026, 12944779, 462197, 11460858, 37252662,
  17856952, 2889618, 13005088, 25685899, 6207825, 6995148, 7587777,
]

/** Fabric / textile macro close-ups. */
const textiles = [
  7794365, 7533979, 7232397, 36346049, 6485437, 7598534, 30618181, 34851001,
  1487713, 6843273, 7232409, 5854040,
]

/**
 * Deterministic day/night photo pair for a product, keyed by slug so a given
 * product always resolves to the same pair. The product gallery applies its own
 * warmth/darkening wash for the night render, so both may be daytime frames.
 */
export function productImages(slug: string): { day: string; night: string } {
  let h = 0
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0
  const day = drapes[h % drapes.length]
  const night = drapes[(h + 7) % drapes.length]
  return { day: pexels(day), night: pexels(night) }
}

/** Nth textile close-up (wraps), for fabric swatch/texture tiles. */
export function textileImage(i: number): string {
  return pexels(textiles[i % textiles.length])
}
