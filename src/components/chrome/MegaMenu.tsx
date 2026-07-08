import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import type { MegaMenu as MegaMenuData } from '@/config/navigation'
import { Container, GlassPanel, Label } from '@/components/ui'
import { ease, duration } from '@/lib/motion'
import { getImageUrl } from '@/lib/getImageUrl'

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: ease.entrance },
  },
}

/**
 * Full-width mega-menu panel. Opens with a downward "unfurl" (scaleY from the
 * top + fade); columns and items stagger in. Purely presentational — the parent
 * Navbar owns open/close state and mounts this inside <AnimatePresence>.
 */
export function MegaMenu({
  mega,
  onNavigate,
}: {
  mega: MegaMenuData
  onNavigate: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0.88, y: -8 }}
      animate={{ opacity: 1, scaleY: 1, y: 0 }}
      exit={{ opacity: 0, scaleY: 0.92, y: -8 }}
      transition={{ duration: duration.base, ease: ease.entrance }}
      style={{ transformOrigin: 'top' }}
      className="absolute inset-x-0 top-full"
    >
      <GlassPanel className="rounded-none border-x-0 border-t-0 bg-surface/95 shadow-soft">
        <Container className="py-10">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4 lg:grid-cols-6"
          >
            {mega.columns.map((col) => (
              <div key={col.title}>
                <Label as="h3" className="mb-4 block">
                  {col.title}
                </Label>
                <ul className="space-y-2.5">
                  {col.items.map((navItem) => (
                    <motion.li key={navItem.label} variants={item}>
                      <Link
                        to={navItem.href}
                        onClick={onNavigate}
                        className="group/link inline-flex items-center gap-1.5 text-body text-muted transition-all duration-base ease-settle hover:translate-x-1 hover:text-ink"
                      >
                        <span className="relative">
                          {navItem.label}
                          <span
                            aria-hidden
                            className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-ink transition-transform duration-base ease-settle group-hover/link:scale-x-100"
                          />
                        </span>
                        <ArrowRight
                          aria-hidden
                          className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-base ease-settle group-hover/link:translate-x-0 group-hover/link:opacity-100"
                          strokeWidth={1.75}
                        />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Featured visual tile */}
            <motion.div variants={item} className="col-span-2">
              <Link
                to={mega.feature.href}
                onClick={onNavigate}
                className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-lg border border-line p-6"
                style={{
                  backgroundColor: 'rgb(var(--ink-rgb) / 0.06)',
                  backgroundImage: `linear-gradient(to top, rgb(var(--ink-rgb) / 0.55), transparent 60%), url(${getImageUrl(
                    mega.feature.image,
                  )})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="relative">
                  <Label className="text-bg/80">Featured</Label>
                  <p className="mt-1 font-display text-h4 text-bg">
                    {mega.feature.label}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-small text-bg/80">
                    {mega.feature.caption}
                    <ArrowUpRight
                      className="h-3.5 w-3.5 transition-transform duration-base ease-settle group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={1.75}
                    />
                  </p>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </Container>
      </GlassPanel>
    </motion.div>
  )
}
