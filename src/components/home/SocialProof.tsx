import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { Container, Section, Label, Divider, Reveal } from '@/components/ui'
import { home } from '@/config/home'
import { site } from '@/config/site'
import { ease } from '@/lib/motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/utils'

export function SocialProof() {
  const { testimonials, eyebrow } = home.socialProof
  const reduced = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)

  const go = (dir: number) =>
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length)

  // auto-advance (paused under reduced-motion)
  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => go(1), 6000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, testimonials.length])

  const t = testimonials[index]

  return (
    <Section>
      <Container>
        <Reveal variant="fade">
          <Label className="mb-8 block text-center">{eyebrow}</Label>
        </Reveal>

        {/* press strip */}
        <Reveal
          variant="blur"
          delay={0.1}
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3"
        >
          {site.footer.press.map((p) => (
            <span key={p} className="font-display text-xl text-muted/70">
              {p}
            </span>
          ))}
        </Reveal>

        <Divider className="my-12" />

        {/* testimonial slider */}
        <Reveal variant="fade" delay={0.2} className="mx-auto max-w-3xl text-center">
          <Quote
            className="mx-auto mb-6 h-8 w-8 text-accent"
            strokeWidth={1.4}
          />
          <div className="min-h-[9rem]">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={index}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: ease.entrance }}
              >
                <p className="font-display text-h3 leading-[1.25] text-ink">
                  “{t.quote}”
                </p>
                <footer className="mt-6">
                  <span className="text-body text-ink">{t.name}</span>
                  <span className="text-body text-muted"> · {t.role}</span>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* controls */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={() => go(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-ink/[0.05]"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to testimonial ${i + 1}`}
                  aria-current={i === index}
                  onClick={() => setIndex(i)}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-fast',
                    i === index ? 'w-6 bg-ink' : 'w-1.5 bg-line',
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Next testimonial"
              onClick={() => go(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-ink/[0.05]"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
