import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { Search, Heart, ShoppingBag, User, Menu } from 'lucide-react'
import type { ReactNode } from 'react'
import { site } from '@/config/site'
import { primaryNav } from '@/config/navigation'
import { MegaMenu } from './MegaMenu'
import { MobileDrawer } from './MobileDrawer'
import { Container } from '@/components/ui'
import { useScrolled } from '@/hooks/useScrolled'
import { useStoreCounts } from '@/hooks/useStoreCounts'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { ease } from '@/lib/motion'
import { cn } from '@/lib/utils'

function IconAction({
  label,
  count,
  onClick,
  children,
}: {
  label: string
  count?: number
  onClick?: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={count ? `${label} (${count})` : label}
      title={label}
      onClick={onClick}
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors duration-fast hover:bg-ink/[0.06]"
    >
      {children}
      {count !== undefined && count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium leading-none text-bg">
          {count}
        </span>
      )}
    </button>
  )
}

/**
 * Sticky, state-reactive glass navbar.
 *  - transparent at the top of the page; condenses on scroll past ~80px
 *    (shrinks height, gains a glass background + hairline border, logo scales down)
 *  - primary nav from config, with mega-menus on Curtains & Shades
 *  - right-side search / wishlist / cart / account, badge counts from stubs
 *  - hamburger opens the full-screen mobile drawer under 1024px
 */
export function Navbar() {
  const scrolled = useScrolled(80)
  const [activeMega, setActiveMega] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const counts = useStoreCounts()
  const reduced = usePrefersReducedMotion()
  const location = useLocation()

  // Close menus on navigation.
  useEffect(() => {
    setActiveMega(null)
    setMobileOpen(false)
  }, [location.pathname])

  // Escape closes the open mega-menu.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveMega(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const solid = scrolled || activeMega !== null
  const t = reduced ? { duration: 0 } : { duration: 0.4, ease: ease.settle }
  const activeItem = primaryNav.find((i) => i.label === activeMega)

  return (
    <>
      <motion.header
        onMouseLeave={() => setActiveMega(null)}
        className={cn(
          'sticky top-0 z-40 w-full',
          'transition-[background-color,border-color,backdrop-filter] duration-base ease-settle',
          solid ? 'glass border-b border-line' : 'border-b border-transparent bg-transparent',
        )}
      >
        <motion.div animate={{ paddingTop: solid ? 12 : 22, paddingBottom: solid ? 12 : 22 }} transition={t}>
          <Container size="wide">
            <div className="flex items-center justify-between gap-6">
              {/* Wordmark */}
              <Link to="/" aria-label={`${site.name} — home`} className="shrink-0">
                <motion.span
                  animate={{ scale: solid ? 0.86 : 1 }}
                  transition={t}
                  className="block origin-left font-display text-2xl tracking-tight text-ink"
                >
                  {site.name}
                </motion.span>
              </Link>

              {/* Primary nav */}
              <nav className="hidden items-center gap-1 lg:flex">
                {primaryNav.map((navItem) => {
                  const isOpen = activeMega === navItem.label
                  return (
                    <Link
                      key={navItem.label}
                      to={navItem.href}
                      onMouseEnter={() =>
                        setActiveMega(navItem.mega ? navItem.label : null)
                      }
                      onFocus={() =>
                        setActiveMega(navItem.mega ? navItem.label : null)
                      }
                      aria-haspopup={navItem.mega ? 'true' : undefined}
                      aria-expanded={navItem.mega ? isOpen : undefined}
                      className={cn(
                        'rounded-full px-4 py-2 text-small transition-colors duration-fast hover:text-ink',
                        isOpen ? 'text-ink' : 'text-muted',
                      )}
                    >
                      {navItem.label}
                    </Link>
                  )
                })}
              </nav>

              {/* Utility */}
              <div className="flex items-center gap-0.5">
                <IconAction label="Search">
                  <Search className="h-[18px] w-[18px]" strokeWidth={1.6} />
                </IconAction>
                <IconAction label="Wishlist" count={counts.wishlist}>
                  <Heart className="h-[18px] w-[18px]" strokeWidth={1.6} />
                </IconAction>
                <IconAction label="Cart" count={counts.cart}>
                  <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.6} />
                </IconAction>
                <IconAction label="Account">
                  <User className="h-[18px] w-[18px]" strokeWidth={1.6} />
                </IconAction>
                <button
                  type="button"
                  aria-label="Open menu"
                  onClick={() => setMobileOpen(true)}
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors duration-fast hover:bg-ink/[0.06] lg:hidden"
                >
                  <Menu className="h-5 w-5" strokeWidth={1.6} />
                </button>
              </div>
            </div>
          </Container>
        </motion.div>

        {/* Mega-menu */}
        <AnimatePresence>
          {activeItem?.mega && (
            <MegaMenu
              key={activeItem.label}
              mega={activeItem.mega}
              onNavigate={() => setActiveMega(null)}
            />
          )}
        </AnimatePresence>
      </motion.header>

      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} counts={counts} />
    </>
  )
}
