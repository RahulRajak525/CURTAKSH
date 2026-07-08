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
 *   - enter: panels start CLOSED (covering) → animate to REVEALED (parted)
 *   - exit:  panels animate REVEALED → CLOSED
 * Because exit fully completes before the next enter begins, the crossover
 * happens while the screen is fully covered — so it reads as one continuous
 * curtain even though the page content swaps underneath.
 *
 * Under prefers-reduced-motion this degrades to a simple cross-fade.
 */

const PANEL_MS = 0.46

const rootVariants: Variants = { covering: {}, revealed: {} }

const panelVariants: Variants = {
  covering: { x: '0%', transition: { duration: PANEL_MS, ease: ease.drape } },
  revealed: (side: 'left' | 'right') => ({
    x: side === 'left' ? '-101%' : '101%',
    transition: { duration: PANEL_MS, ease: ease.drape },
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
          animation: 'drape-sheen 0.9s ease-out',
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
