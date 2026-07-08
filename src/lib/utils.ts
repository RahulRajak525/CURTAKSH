/**
 * Tiny className joiner. Filters falsy values so conditional classes stay
 * readable: cn('base', active && 'is-active', className).
 *
 * Deliberately dependency-free (no clsx/tailwind-merge) to keep the foundation
 * lean; swap in tailwind-merge later if class conflicts become a problem.
 */
export type ClassValue = string | number | false | null | undefined

export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ')
}

/** Linear interpolate. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Clamp n into [min, max]. */
export const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n))

/** Map n from [inMin,inMax] to [outMin,outMax]. */
export const mapRange = (
  n: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) => outMin + ((n - inMin) / (inMax - inMin)) * (outMax - outMin)
