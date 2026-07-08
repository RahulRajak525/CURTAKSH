import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Link } from 'react-router-dom'
import { X, User, Heart, ShoppingBag } from 'lucide-react'
import { site } from '@/config/site'
import { primaryNav } from '@/config/navigation'
import { Container, Divider } from '@/components/ui'
import { LightScrubberInline } from '@/components/LightScrubberInline'
import { ease } from '@/lib/motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import type { StoreCounts } from '@/hooks/useStoreCounts'

/**
 * Full-screen mobile menu. Two fabric cover panels start closed (meeting at
 * center) and part outward — curtains opening — to reveal the menu; nav items
 * then rise in on a staggered mask. Under reduced-motion the panels are skipped
 * and content simply fades in. Includes an inline light scrubber and the
 * account / wishlist / cart row.
 */
export function MobileDrawer({
  open,
  onClose,
  counts,
}: {
  open: boolean
  onClose: () => void
  counts: StoreCounts
}) {
  const reduced = usePrefersReducedMotion()

  // Lock background scroll while open.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const list: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: reduced ? 0 : 0.42,
        staggerChildren: reduced ? 0.02 : 0.07,
      },
    },
  }
  const line: Variants = {
    hidden: { y: '115%' },
    visible: {
      y: '0%',
      transition: { duration: reduced ? 0.2 : 0.65, ease: ease.drape },
    },
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] lg:hidden"
          initial={reduced ? { opacity: 0 } : undefined}
          animate={reduced ? { opacity: 1 } : undefined}
          exit={reduced ? { opacity: 0 } : undefined}
          transition={{ duration: 0.2 }}
        >
          {/* Menu content (revealed as the curtains part) */}
          <div className="absolute inset-0 overflow-y-auto bg-bg">
            <Container className="flex min-h-full flex-col py-6">
              <div className="flex items-center justify-between">
                <span className="font-display text-2xl text-ink">
                  {site.name}
                </span>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/[0.06]"
                >
                  <X className="h-5 w-5" strokeWidth={1.6} />
                </button>
              </div>

              <motion.nav
                variants={list}
                initial="hidden"
                animate="visible"
                className="mt-10 flex flex-col gap-1"
              >
                {primaryNav.map((navItem) => (
                  <span key={navItem.label} className="block overflow-hidden py-1">
                    <motion.span variants={line} className="block">
                      <Link
                        to={navItem.href}
                        onClick={onClose}
                        className="font-display text-[2rem] leading-tight text-ink"
                      >
                        {navItem.label}
                      </Link>
                    </motion.span>
                  </span>
                ))}
              </motion.nav>

              <div className="mt-auto pt-10">
                <Divider className="mb-6" />
                <LightScrubberInline className="mb-8" />
                <div className="flex items-center gap-2">
                  <DrawerAction label="Account" onClick={onClose}>
                    <User className="h-[18px] w-[18px]" strokeWidth={1.6} />
                  </DrawerAction>
                  <DrawerAction
                    label="Wishlist"
                    count={counts.wishlist}
                    onClick={onClose}
                  >
                    <Heart className="h-[18px] w-[18px]" strokeWidth={1.6} />
                  </DrawerAction>
                  <DrawerAction label="Cart" count={counts.cart} onClick={onClose}>
                    <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.6} />
                  </DrawerAction>
                </div>
              </div>
            </Container>
          </div>

          {/* Curtain cover panels — part outward to reveal, close to dismiss. */}
          {!reduced &&
            (['left', 'right'] as const).map((side) => (
              <motion.div
                key={side}
                initial={{ x: '0%' }}
                animate={{ x: side === 'left' ? '-101%' : '101%' }}
                exit={{ x: '0%' }}
                transition={{ duration: 0.52, ease: ease.drape }}
                className="absolute top-0 z-10 h-full w-[50.5%]"
                style={{
                  [side]: 0,
                  backgroundColor: 'rgb(var(--surface-rgb))',
                  backgroundImage: `repeating-linear-gradient(90deg,
                    rgb(var(--surface-rgb)) 0px,
                    rgb(var(--surface-rgb)) 16px,
                    rgb(var(--line-rgb)) 17px,
                    rgb(var(--surface-rgb)) 34px)`,
                  boxShadow: 'inset 0 0 120px rgb(var(--shadow-color-rgb) / 0.18)',
                }}
              />
            ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function DrawerAction({
  label,
  count,
  onClick,
  children,
}: {
  label: string
  count?: number
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={count ? `${label} (${count})` : label}
      className="relative flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-line text-small text-ink transition-colors hover:bg-ink/[0.04]"
    >
      {children}
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] leading-none text-bg">
          {count}
        </span>
      )}
    </button>
  )
}
