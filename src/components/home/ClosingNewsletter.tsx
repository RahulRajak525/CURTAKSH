import { useState } from 'react'
import type { FormEvent } from 'react'
import { Check } from 'lucide-react'
import { Container, Section, Button } from '@/components/ui'
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
      <Container className="relative text-center">
        <h2 className="mx-auto max-w-3xl font-display text-display-1 leading-[0.92] text-ink">
          {closing.headline}
        </h2>
        <p className="mx-auto mt-6 max-w-md text-body text-muted">
          {closing.sub}
        </p>

        {done ? (
          <p className="mx-auto mt-9 inline-flex items-center gap-2 text-body text-ink">
            <Check className="h-5 w-5 text-accent" strokeWidth={2} />
            {site.newsletter.success}
          </p>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mx-auto mt-9 flex max-w-md items-center gap-2"
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
            <Button type="submit" variant="solid" size="lg">
              {site.newsletter.cta}
            </Button>
          </form>
        )}

        <p className="label mx-auto mt-6 max-w-md text-muted/70">
          {closing.reassurance}
        </p>
      </Container>
    </Section>
  )
}
