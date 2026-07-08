import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Container, Label } from '@/components/ui'
import { ease } from '@/lib/motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/** On-brand 404: a pair of curtains drawn shut. The button parts them and
 *  returns home (reusing the curtain motif). */
export function NotFound() {
  const navigate = useNavigate()
  const reduced = usePrefersReducedMotion()
  const [opening, setOpening] = useState(false)

  const openHome = () => {
    if (reduced) {
      navigate('/')
      return
    }
    setOpening(true)
  }

  const panelStyle = (side: 'left' | 'right') => ({
    [side]: 0,
    backgroundColor: 'rgb(var(--surface-rgb))',
    backgroundImage: `
      linear-gradient(${side === 'left' ? '90deg' : '270deg'}, rgb(var(--ink-rgb) / 0.12), transparent 45%),
      repeating-linear-gradient(90deg,
        rgb(var(--surface-rgb)) 0px,
        rgb(var(--surface-rgb)) 18px,
        rgb(var(--line-rgb)) 19px,
        rgb(var(--surface-rgb)) 38px)`,
    boxShadow: 'inset 0 0 140px rgb(var(--shadow-color-rgb) / 0.16)',
  })

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* curtains */}
      {(['left', 'right'] as const).map((side) => (
        <motion.div
          key={side}
          className="absolute top-0 z-0 h-full w-[50.5%]"
          style={panelStyle(side)}
          initial={{ x: '0%' }}
          animate={{ x: opening ? (side === 'left' ? '-101%' : '101%') : '0%' }}
          transition={{ duration: 0.9, ease: ease.drape }}
          onAnimationComplete={() => {
            if (opening && side === 'left') navigate('/')
          }}
        />
      ))}

      {/* message */}
      <motion.div
        className="relative z-10 text-center"
        animate={{ opacity: opening ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <Container className="text-center">
          <Label className="text-muted">Error 404</Label>
          <p className="mt-6 font-display text-display-2 leading-none text-ink">
            This window leads nowhere
          </p>
          <p className="mx-auto mt-5 max-w-sm text-body text-muted">
            The page you’re after has moved on, or never hung here at all.
          </p>
          <button
            type="button"
            onClick={openHome}
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-small text-bg transition-colors hover:bg-ink/90"
          >
            Open the curtains
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </Container>
      </motion.div>
    </section>
  )
}
