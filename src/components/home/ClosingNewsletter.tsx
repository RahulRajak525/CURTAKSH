import { useState } from 'react'
import type { FormEvent } from 'react'
import { Check } from 'lucide-react'
import { Container, Reveal, Section, SlideButton, SplitText } from '@/components/ui'
import { getImageUrl } from '@/lib/getImageUrl'
import { home } from '@/config/home'
import { site } from '@/config/site'

/**
 * Closing call — a big Fraunces line over a Light-Engine-reactive gradient with
 * a stubbed email capture and a reassurance line.
 */
export function ClosingNewsletter() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const { closing } = home

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) return
    setDone(true) // stub
  }

  return (
    <Section className="relative overflow-hidden">
      {/* light-reactive gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(90% 120% at 50% 0%, rgb(var(--glow-rgb) / 0.45), transparent 55%), linear-gradient(to bottom, rgb(var(--surface-rgb) / 0.6), transparent)',
        }}
      />

      {/* curved band across the upper side */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 w-full sm:h-32 lg:h-40"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
      >
        {/* opaque page-bg fill so the area above the curve matches the
            section above (the glow gradient only shows below the curve) */}
        <path
          d="M0,44 C480,150 960,150 1440,44 L1440,0 L0,0 Z"
          fill="rgb(var(--bg-rgb))"
        />
        <path
          d="M0,44 C480,150 960,150 1440,44"
          fill="none"
          stroke="rgb(var(--accent-rgb) / 0.55)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* text — left */}
          <div className="text-center lg:text-left">
            <SplitText
              as="h2"
              text={closing.headline}
              splitBy="word"
              className="mx-auto block max-w-xl font-display text-display-1 leading-[0.92] text-ink lg:mx-0"
            />
            <Reveal variant="fade" delay={0.25}>
              <p className="mx-auto mt-6 max-w-md text-body text-muted lg:mx-0">
                {closing.sub}
              </p>
            </Reveal>

            {done ? (
              <p className="mt-9 inline-flex items-center gap-2 text-body text-ink">
                <Check className="h-5 w-5 text-accent" strokeWidth={2} />
                {site.newsletter.success}
              </p>
            ) : (
              <Reveal variant="fade" delay={0.4}>
              <form
                onSubmit={onSubmit}
                className="mx-auto mt-9 flex max-w-md items-center gap-2 lg:mx-0"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={site.newsletter.placeholder}
                  aria-label="Email address"
                  className="h-12 flex-1 rounded-full border border-line bg-bg/60 px-5 text-small text-ink outline-none backdrop-blur transition-colors placeholder:text-muted/70 focus:border-ink"
                />
                <SlideButton type="submit" size="lg">
                  {site.newsletter.cta}
                </SlideButton>
              </form>
              </Reveal>
            )}

            <Reveal variant="fade" delay={0.55}>
              <p className="label mx-auto mt-6 max-w-md text-muted/70 lg:mx-0">
                {closing.reassurance}
              </p>
            </Reveal>
          </div>

          {/* image — right */}
          <Reveal
            variant="right"
            delay={0.15}
            className="relative order-first mt-8 lg:order-none lg:mt-0"
          >
            <div className="mx-auto w-full max-w-[16rem] overflow-hidden rounded-2xl border border-line shadow-soft sm:max-w-xs lg:ml-auto lg:mr-0">
              <img
                src={getImageUrl(closing.image)}
                alt={closing.imageAlt}
                loading="lazy"
                className="aspect-[3/4] w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
