import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { ease } from '@/lib/motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * The signature route transition. Two fabric-toned curtain panels sweep in from
 * the edges to meet at center over the outgoing page (draw closed), then part
 * outward to reveal the incoming page. Total ≈ 900ms on the "drape" easing.
 *
 * Mechanics: this component is the keyed child of an <AnimatePresence mode="wait">.
 *   - enter: panels render already CLOSED (covering), hold a beat, → part slowly open
 *   - exit:  panels snap CLOSED instantly (no visible "drawing closed" sweep)
 * So on both a fresh load/refresh AND a route change, the page appears with the
 * curtains already shut and the only motion you see is the slow, smooth reveal.
 * (mode="wait" means the incoming page mounts in its closed state behind the
 * covered screen, so the content swap is never visible.)
 *
 * Under prefers-reduced-motion this degrades to a simple cross-fade.
 */

/** Parting open — slow and smooth, the only visible motion. */
const OPEN_MS = 1.7
/** Hold fully closed for a beat before parting, so the closed state registers. */
const OPEN_DELAY = 0.35

const rootVariants: Variants = { covering: {}, revealed: {} }

const panelVariants: Variants = {
  // Closed: instant, so leaving a page never shows a draw-closed animation —
  // the next page is simply already shut when it appears.
  covering: { x: '0%', transition: { duration: 0 } },
  revealed: (side: 'left' | 'right') => ({
    x: side === 'left' ? '-101%' : '101%',
    transition: { duration: OPEN_MS, delay: OPEN_DELAY, ease: ease.settle },
  }),
}

function CurtainPanel({ side }: { side: 'left' | 'right' }) {
  return (
    <motion.div
      custom={side}
      variants={panelVariants}
      className="absolute top-0 h-full w-[50.5%] overflow-hidden"
      style={{
        [side]: 0,
        // Vertical pleats in fabric tones + a soft directional shade toward the seam.
        backgroundImage: `
          linear-gradient(${side === 'left' ? '90deg' : '270deg'}, rgb(var(--ink-rgb) / 0.10), transparent 42%),
          repeating-linear-gradient(90deg,
            rgb(var(--surface-rgb)) 0px,
            rgb(var(--surface-rgb)) 16px,
            rgb(var(--line-rgb)) 17px,
            rgb(var(--surface-rgb)) 34px)`,
        backgroundColor: 'rgb(var(--surface-rgb))',
        boxShadow: 'inset 0 0 120px rgb(var(--shadow-color-rgb) / 0.18)',
      }}
    >
      {/* faint sheen sweep */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 h-2/5"
        style={{
          background:
            'linear-gradient(180deg, transparent, rgb(var(--glow-rgb) / 0.35), transparent)',
          animation: 'drape-sheen 1.9s ease-out 0.35s',
        }}
      />
    </motion.div>
  )
}

export function PageTransition({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion()

  if (reduced) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={rootVariants}
      initial="covering"
      animate="revealed"
      exit="covering"
    >
      {children}

      {/* Curtain overlay — transient; ignores pointer events. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[300]"
      >
        <CurtainPanel side="left" />
        <CurtainPanel side="right" />
      </div>
    </motion.div>
  )
}
