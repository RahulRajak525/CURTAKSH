import { useNavigate } from 'react-router-dom'
import { CalendarCheck, MessagesSquare, PackageCheck } from 'lucide-react'
import type { ReactNode } from 'react'
import { Container, Section, Label, Button, Reveal } from '@/components/ui'
import { home } from '@/config/home'

const stepIcons: ReactNode[] = [
  <CalendarCheck key="1" className="h-5 w-5" strokeWidth={1.6} />,
  <MessagesSquare key="2" className="h-5 w-5" strokeWidth={1.6} />,
  <PackageCheck key="3" className="h-5 w-5" strokeWidth={1.6} />,
]

/** The Atelier / Design Service pitch: Book → Consult → Installed. Booking is stubbed. */
export function Atelier() {
  const navigate = useNavigate()
  const { atelier } = home

  return (
    <Section className="border-y border-line bg-surface/40">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <Reveal variant="fade">
            <Label className="mb-4 block">{atelier.eyebrow}</Label>
            <h2 className="font-display text-display-2 leading-[0.95] text-ink">
              {atelier.title}
            </h2>
            <p className="mt-5 max-w-md text-body text-muted">{atelier.sub}</p>
            <Button
              className="mt-8"
              variant="solid"
              magnetic
              onClick={() => navigate(atelier.cta.href)}
            >
              {atelier.cta.label}
            </Button>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-3">
            {atelier.steps.map((step, i) => (
              <Reveal key={step.n} variant="fade" delay={i * 0.08}>
                <div className="flex h-full flex-col rounded-lg border border-line bg-bg p-6 shadow-soft">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/[0.05] text-ink">
                      {stepIcons[i]}
                    </span>
                    <Label className="text-muted/50">{step.n}</Label>
                  </div>
                  <p className="mt-5 font-display text-h4 text-ink">
                    {step.title}
                  </p>
                  <p className="mt-2 text-small leading-relaxed text-muted">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
