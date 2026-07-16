import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { cn } from '@/lib/utils'
import { duration, ease } from '@/lib/motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

type RevealVariant = 'mask' | 'fade' | 'left' | 'right' | 'blur'

/**
 * Plays a one-shot reveal when the element scrolls into view. Uses Framer's
 * `whileInView` (IntersectionObserver under the hood). Under reduced-motion the
 * content renders immediately with no animation.
 *
 * Variants: 'mask' (clip-path wipe up), 'fade' (rise + fade), 'left'/'right'
 * (slide in from that side), 'blur' (materialise out of nowhere).
 */
export function Reveal({
  variant = 'mask',
  delay = 0,
  once = true,
  className,
  children,
}: {
  variant?: RevealVariant
  delay?: number
  once?: boolean
  className?: string
  children: ReactNode
}) {
  const reduced = usePrefersReducedMotion()
  if (reduced) return <div className={className}>{children}</div>

  const entrance = { duration: duration.slow, ease: ease.entrance, delay }
  const byVariant: Record<RevealVariant, Variants> = {
    fade: {
      hidden: { opacity: 0, y: 24 },
      visible: { opacity: 1, y: 0, transition: entrance },
    },
    left: {
      hidden: { opacity: 0, x: -56 },
      visible: { opacity: 1, x: 0, transition: entrance },
    },
    right: {
      hidden: { opacity: 0, x: 56 },
      visible: { opacity: 1, x: 0, transition: entrance },
    },
    blur: {
      hidden: { opacity: 0, scale: 0.96, filter: 'blur(12px)' },
      visible: {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        transition: entrance,
      },
    },
    mask: {
      hidden: { clipPath: 'inset(100% 0 0 0)', y: 14 },
      visible: {
        clipPath: 'inset(0% 0 0 0)',
        y: 0,
        transition: { duration: duration.cinematic, ease: ease.drape, delay },
      },
    },
  }
  const variants = byVariant[variant]

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-10% 0px -10% 0px' }}
      variants={variants}
      style={{ willChange: 'transform, clip-path, opacity, filter' }}
    >
      {children}
    </motion.div>
  )
}
