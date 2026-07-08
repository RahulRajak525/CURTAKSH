import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronDown, ArrowUpRight } from 'lucide-react'
import type { Fabric } from '@/types'
import { productPage } from '@/config/product'
import { ease } from '@/lib/motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/** Spec accordions with mono titles. Materials pulls the selected fabric's care
 *  bullets in; the rest are static config copy. */
export function ProductAccordions({ fabric }: { fabric?: Fabric }) {
  const [open, setOpen] = useState<string | null>('materials')
  const reduced = usePrefersReducedMotion()

  return (
    <div className="border-t border-line">
      {productPage.accordions.map((section) => {
        const isOpen = open === section.id
        return (
          <div key={section.id} className="border-b border-line">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : section.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between py-5 text-left"
            >
              <span className="label text-ink">{section.title}</span>
              <ChevronDown
                className={`h-4 w-4 text-muted transition-transform duration-base ${
                  isOpen ? 'rotate-180' : ''
                }`}
                strokeWidth={1.75}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: ease.settle }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 text-body text-muted">
                    <p>{section.body}</p>

                    {section.id === 'materials' && fabric && (
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {fabric.properties.map((p) => (
                          <li
                            key={p}
                            className="label rounded-full border border-line px-3 py-1 text-muted"
                          >
                            {p}
                          </li>
                        ))}
                        <li className="label rounded-full border border-line px-3 py-1 text-muted">
                          {fabric.weightGsm} gsm
                        </li>
                      </ul>
                    )}

                    {section.link && (
                      <Link
                        to={section.link.href}
                        className="mt-4 inline-flex items-center gap-1 text-small text-ink transition-colors hover:opacity-70"
                      >
                        {section.link.label}
                        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </Link>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
