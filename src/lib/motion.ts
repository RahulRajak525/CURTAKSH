/**
 * Motion tokens — the vocabulary of DRAPÉ's movement.
 * Slow, weighted, physical — like fabric settling.
 *
 * Durations are in seconds (Framer Motion units). Easings are cubic-bezier
 * control-point tuples, also consumable as CSS via lib style helpers.
 */
import type { Variants, Transition } from 'framer-motion'

export const duration = {
  fast: 0.2,
  base: 0.45,
  slow: 0.8,
  cinematic: 1.2,
} as const

export type EaseTuple = [number, number, number, number]

export const ease = {
  /** default — decisive arrival, gentle overshoot */
  settle: [0.22, 1, 0.36, 1] as EaseTuple,
  /** entrances — fast in, long tail */
  entrance: [0.16, 1, 0.3, 1] as EaseTuple,
  /** drape — heavy, symmetric, like a curtain falling */
  drape: [0.83, 0, 0.17, 1] as EaseTuple,
} as const

/** CSS cubic-bezier() strings for use in inline styles / className vars. */
export const easeCss = {
  settle: 'cubic-bezier(0.22, 1, 0.36, 1)',
  entrance: 'cubic-bezier(0.16, 1, 0.3, 1)',
  drape: 'cubic-bezier(0.83, 0, 0.17, 1)',
} as const

export const transition = {
  base: { duration: duration.base, ease: ease.settle } satisfies Transition,
  slow: { duration: duration.slow, ease: ease.entrance } satisfies Transition,
  drape: {
    duration: duration.cinematic,
    ease: ease.drape,
  } satisfies Transition,
} as const

/* ---------------- Framer variants ---------------- */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: ease.entrance },
  },
}

/** Clip-path mask reveal — content slides up from behind an edge. */
export const revealMask: Variants = {
  hidden: {
    opacity: 1,
    clipPath: 'inset(100% 0 0 0)',
    y: 12,
  },
  visible: {
    clipPath: 'inset(0% 0 0 0)',
    y: 0,
    transition: { duration: duration.cinematic, ease: ease.drape },
  },
}

/** Parent orchestrator — stagger children on enter. */
export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

/** A denser stagger for word/char kinetic headlines. */
export const staggerTight: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.035 },
  },
}

/** Per-word/char item used by SplitText. */
export const wordReveal: Variants = {
  hidden: { opacity: 0, y: '0.5em', rotateX: 40 },
  visible: {
    opacity: 1,
    y: '0em',
    rotateX: 0,
    transition: { duration: duration.slow, ease: ease.entrance },
  },
}
