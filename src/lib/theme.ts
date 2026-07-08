/**
 * The Light Engine — colour math.
 *
 * The palette is light-reactive: four anchor themes (Dawn, Noon, Dusk, Night)
 * are placed along a `lightPhase` axis in [0, 1]. `computeThemeVars(phase)`
 * linearly interpolates between the two nearest anchors and returns a flat map
 * of CSS custom properties. `setLightPhase(phase)` writes them to `:root`.
 *
 * Every colour is emitted twice:
 *   --x       a hex string (convenient for raw CSS / canvas / three.js)
 *   --x-rgb   an "r g b" channel triplet (consumed by Tailwind so that
 *             `/<alpha>` opacity modifiers keep working live)
 */

export type PhaseKey = 'dawn' | 'noon' | 'dusk' | 'night'

interface Anchor {
  key: PhaseKey
  label: string
  /** Position on the light axis, 0..1 */
  phase: number
  bg: string
  surface: string
  ink: string
  muted: string
  line: string
  accent: string
  glow: string
  shadowColor: string
  /** Vertical offset of the ambient shadow, px */
  shadowY: number
  /** Blur radius of the ambient shadow, px */
  shadowBlur: number
  /** Opacity of the ambient shadow, 0..1 */
  shadowAlpha: number
  /** Overall light intensity, 0..1 — drives blooms, sheer bloom, glow strength */
  lightIntensity: number
}

// Ordered by phase position. Keep sorted ascending.
export const ANCHORS: readonly Anchor[] = [
  {
    key: 'dawn',
    label: 'DAWN',
    phase: 0,
    bg: '#EDE6DC',
    surface: '#F6F1EA',
    ink: '#2A2521',
    muted: '#8A8078',
    line: '#E0D8CB',
    accent: '#E0A98F',
    glow: '#E0A98F',
    shadowColor: '#6E5A4A',
    shadowY: 24,
    shadowBlur: 60,
    shadowAlpha: 0.12,
    lightIntensity: 0.35,
  },
  {
    key: 'noon',
    label: 'NOON',
    phase: 0.33,
    bg: '#F4F0E9',
    surface: '#FCFAF6',
    ink: '#1A1714',
    muted: '#8A8078',
    line: '#E4DDD1',
    accent: '#C89B5A',
    glow: '#C89B5A',
    shadowColor: '#5A4A38',
    shadowY: 6,
    shadowBlur: 16,
    shadowAlpha: 0.18,
    lightIntensity: 1,
  },
  {
    key: 'dusk',
    label: 'DUSK',
    phase: 0.66,
    bg: '#2A211B',
    surface: '#372C24',
    ink: '#F3E9DE',
    muted: '#B79E8C',
    line: '#4A3A2E',
    accent: '#E08B4C',
    glow: '#E08B4C',
    shadowColor: '#0E0906',
    shadowY: 30,
    shadowBlur: 70,
    shadowAlpha: 0.4,
    lightIntensity: 0.5,
  },
  {
    key: 'night',
    label: 'NIGHT',
    phase: 1,
    bg: '#12100E',
    surface: '#1A1714',
    ink: '#EDE7DF',
    muted: '#7E756B',
    line: '#2A2521',
    accent: '#9FB4C7',
    glow: '#9FB4C7',
    shadowColor: '#000000',
    shadowY: 40,
    shadowBlur: 90,
    shadowAlpha: 0.55,
    lightIntensity: 0.15,
  },
] as const

export const PHASE_ANCHORS = ANCHORS.map((a) => ({
  key: a.key,
  label: a.label,
  phase: a.phase,
}))

type RGB = [number, number, number]

function hexToRgb(hex: string): RGB {
  const h = hex.replace('#', '')
  const int = parseInt(
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h,
    16,
  )
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255]
}

function rgbToHex([r, g, b]: RGB): string {
  const to = (n: number) => Math.round(n).toString(16).padStart(2, '0')
  return `#${to(r)}${to(g)}${to(b)}`
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

function lerpRgb(a: RGB, b: RGB, t: number): RGB {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]
}

export const clampPhase = (p: number) => Math.min(1, Math.max(0, p))

/** Find the two anchors surrounding `phase` and the blend factor between them. */
function bracket(phase: number): { a: Anchor; b: Anchor; t: number } {
  const p = clampPhase(phase)
  for (let i = 0; i < ANCHORS.length - 1; i++) {
    const a = ANCHORS[i]
    const b = ANCHORS[i + 1]
    if (p >= a.phase && p <= b.phase) {
      const span = b.phase - a.phase
      return { a, b, t: span === 0 ? 0 : (p - a.phase) / span }
    }
  }
  const last = ANCHORS[ANCHORS.length - 1]
  return { a: last, b: last, t: 0 }
}

const COLOR_KEYS = [
  'bg',
  'surface',
  'ink',
  'muted',
  'line',
  'accent',
  'glow',
] as const

export type ThemeVars = Record<string, string>

/* ---------------- WCAG contrast guard ---------------- */

const channelLum = (c: number) => {
  const s = c / 255
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}
function luminance([r, g, b]: RGB): number {
  return 0.2126 * channelLum(r) + 0.7152 * channelLum(g) + 0.0722 * channelLum(b)
}
function contrastRatio(a: RGB, b: RGB): number {
  const la = luminance(a)
  const lb = luminance(b)
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

/**
 * Return `fg` unchanged if it already meets `min` contrast against `bg`;
 * otherwise lerp it toward black or white (whichever is more legible on `bg`)
 * just far enough to clear the ratio.
 */
const BLACK: RGB = [0, 0, 0]
const WHITE: RGB = [255, 255, 255]

/** Smallest blend of `fg` toward `target` (0..1) that clears `min` contrast. */
function blendToClear(fg: RGB, bg: RGB, target: RGB, min: number): RGB {
  let lo = 0
  let hi = 1
  for (let i = 0; i < 18; i++) {
    const mid = (lo + hi) / 2
    if (contrastRatio(lerpRgb(fg, target, mid), bg) >= min) hi = mid
    else lo = mid
  }
  return lerpRgb(fg, target, hi)
}

/** Return `fg` unchanged if it meets `min` on `bg`; else push it toward the
 *  higher-contrast extreme just far enough. */
function ensureContrast(fg: RGB, bg: RGB, min: number): RGB {
  if (contrastRatio(fg, bg) >= min) return fg
  const target =
    contrastRatio(BLACK, bg) >= contrastRatio(WHITE, bg) ? BLACK : WHITE
  return blendToClear(fg, bg, target, min)
}

/**
 * Keep body text legible on `bg`. Usually only `ink` moves — but where the
 * interpolated background lands in the mid-tone "dead zone" (no foreground can
 * reach AA on it), nudge the background away from ink's target first, then set
 * ink. Returns the (possibly adjusted) [ink, bg].
 */
function legiblePair(ink: RGB, bg: RGB, min: number): [RGB, RGB] {
  const target =
    contrastRatio(BLACK, bg) >= contrastRatio(WHITE, bg) ? BLACK : WHITE
  let bg2 = bg
  if (contrastRatio(target, bg) < min) {
    const away = target === BLACK ? WHITE : BLACK
    bg2 = blendToClear(bg, target, away, min)
  }
  return [ensureContrast(ink, bg2, min), bg2]
}

/** Compute the full CSS-variable map for a given light phase. */
export function computeThemeVars(phase: number): ThemeVars {
  const { a, b, t } = bracket(phase)
  const vars: ThemeVars = {}

  // Interpolate every colour first so we can run the contrast guard on ink.
  const rgbByKey: Record<string, RGB> = {}
  for (const key of COLOR_KEYS) {
    rgbByKey[key] = lerpRgb(hexToRgb(a[key]), hexToRgb(b[key]), t)
  }

  // Accessibility guard: between anchors, the interpolated ink can drift toward
  // the background and drop below WCAG AA. Keep body text at 4.5:1 (nudging the
  // background too if it lands in the mid-tone dead zone), and muted at 3:1.
  // The +0.15 margin absorbs the later rounding of channels to integers.
  const [ink2, bg2] = legiblePair(rgbByKey.ink, rgbByKey.bg, 4.65)
  rgbByKey.ink = ink2
  rgbByKey.bg = bg2
  rgbByKey.muted = ensureContrast(rgbByKey.muted, rgbByKey.bg, 3.15)

  for (const key of COLOR_KEYS) {
    const rgb = rgbByKey[key]
    const r = Math.round(rgb[0])
    const g = Math.round(rgb[1])
    const bl = Math.round(rgb[2])
    vars[`--${key}`] = rgbToHex(rgb)
    vars[`--${key}-rgb`] = `${r} ${g} ${bl}`
  }

  const shadowRgb = lerpRgb(hexToRgb(a.shadowColor), hexToRgb(b.shadowColor), t)
  vars['--shadow-color'] = rgbToHex(shadowRgb)
  vars['--shadow-color-rgb'] =
    `${Math.round(shadowRgb[0])} ${Math.round(shadowRgb[1])} ${Math.round(shadowRgb[2])}`
  vars['--shadow-y'] = `${lerp(a.shadowY, b.shadowY, t).toFixed(1)}px`
  vars['--shadow-blur'] = `${lerp(a.shadowBlur, b.shadowBlur, t).toFixed(1)}px`
  vars['--shadow-alpha'] = lerp(a.shadowAlpha, b.shadowAlpha, t).toFixed(3)
  vars['--light-intensity'] = lerp(
    a.lightIntensity,
    b.lightIntensity,
    t,
  ).toFixed(3)

  return vars
}

let lastPhase = -1

/**
 * Write the interpolated theme for `phase` to `document.documentElement`.
 * Cheap enough to call every animation frame; skips redundant writes.
 */
export function setLightPhase(phase: number, force = false): void {
  if (typeof document === 'undefined') return
  const p = clampPhase(phase)
  if (!force && Math.abs(p - lastPhase) < 0.0005) return
  lastPhase = p

  const vars = computeThemeVars(p)
  const root = document.documentElement
  for (const name in vars) {
    root.style.setProperty(name, vars[name])
  }
  // Reflect nearest anchor as a data attribute + light/dark class for any
  // consumer that wants coarse-grained theming (e.g. `color-scheme`).
  const nearest = ANCHORS.reduce((best, a) =>
    Math.abs(a.phase - p) < Math.abs(best.phase - p) ? a : best,
  )
  root.dataset.phase = nearest.key
  const isDark = p > 0.5
  root.classList.toggle('dark', isDark)
  root.style.colorScheme = isDark ? 'dark' : 'light'
}

/** Nearest anchor key for a given phase — handy for labels/UI. */
export function nearestPhaseKey(phase: number): PhaseKey {
  const p = clampPhase(phase)
  return ANCHORS.reduce((best, a) =>
    Math.abs(a.phase - p) < Math.abs(best.phase - p) ? a : best,
  ).key
}
