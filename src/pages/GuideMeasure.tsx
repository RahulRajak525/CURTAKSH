import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { HeaderStyle } from '@/types'
import { Container, Section, PageHero, Label, Reveal } from '@/components/ui'
import { HeaderStyleIcon } from '@/components/product/HeaderStyleIcon'
import { content, recommendHeader, HEADER_NOTES } from '@/config/content'
import { pexels } from '@/config/media'
import { HEADER_OPTIONS } from '@/config/product'
import { cn } from '@/lib/utils'

/** Simple window diagram with a labelled width and drop, in cm. */
function MeasureDiagram() {
  return (
    <svg
      viewBox="0 0 240 200"
      className="w-full text-ink"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      {/* rod */}
      <line x1="30" y1="30" x2="210" y2="30" strokeWidth="3" />
      {/* window */}
      <rect x="55" y="45" width="130" height="120" strokeWidth="1.5" className="text-line" stroke="currentColor" />
      <line x1="120" y1="45" x2="120" y2="165" strokeWidth="1" className="text-line" stroke="currentColor" />
      <line x1="55" y1="105" x2="185" y2="105" strokeWidth="1" className="text-line" stroke="currentColor" />
      {/* width measure */}
      <line x1="30" y1="180" x2="210" y2="180" strokeWidth="1" className="text-accent" stroke="currentColor" />
      <line x1="30" y1="174" x2="30" y2="186" strokeWidth="1" className="text-accent" stroke="currentColor" />
      <line x1="210" y1="174" x2="210" y2="186" strokeWidth="1" className="text-accent" stroke="currentColor" />
      {/* drop measure */}
      <line x1="222" y1="30" x2="222" y2="165" strokeWidth="1" className="text-accent" stroke="currentColor" />
      <line x1="216" y1="30" x2="228" y2="30" strokeWidth="1" className="text-accent" stroke="currentColor" />
      <line x1="216" y1="165" x2="228" y2="165" strokeWidth="1" className="text-accent" stroke="currentColor" />
    </svg>
  )
}

function HeaderHelper() {
  const helper = content.measure.helper
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const complete = helper.questions.every((q) => answers[q.id])
  const result: HeaderStyle | null = complete
    ? recommendHeader(answers.look, answers.mount)
    : null
  const resultOption = HEADER_OPTIONS.find((h) => h.value === result)

  return (
    <div className="rounded-xl border border-line bg-surface/50 p-8">
      <Label className="mb-2 block">{helper.title}</Label>
      <p className="mb-6 text-small text-muted">{helper.sub}</p>

      <div className="flex flex-col gap-5">
        {helper.questions.map((q) => (
          <div key={q.id}>
            <span className="mb-2 block text-small text-muted">{q.label}</span>
            <div className="flex gap-2">
              {q.options.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: o.value }))}
                  aria-pressed={answers[q.id] === o.value}
                  className={cn(
                    'rounded-full border px-4 py-2 text-small transition-colors',
                    answers[q.id] === o.value
                      ? 'border-ink bg-ink text-bg'
                      : 'border-line text-ink hover:border-ink/50',
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {resultOption && result && (
        <div className="mt-7 flex items-center gap-4 border-t border-line pt-6">
          <span className="text-ink">
            <HeaderStyleIcon type={result} />
          </span>
          <div>
            <span className="label text-muted">{helper.resultLabel}</span>
            <p className="font-display text-h4 text-ink">{resultOption.label}</p>
            <p className="mt-0.5 text-small text-muted">{HEADER_NOTES[result]}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export function GuideMeasure() {
  return (
    <>
      <PageHero
        eyebrow={content.measure.eyebrow}
        title={content.measure.title}
        intro={content.measure.intro}
        backgroundImage={pexels(28098308, 1600)}
      />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
            {/* steps */}
            <div>
              <ol className="flex flex-col gap-8">
                {content.measure.steps.map((step) => (
                  <Reveal key={step.n} variant="fade">
                    <li className="flex gap-5">
                      <span className="font-display text-h3 text-accent">
                        {step.n}
                      </span>
                      <div>
                        <p className="font-display text-h4 text-ink">
                          {step.title}
                        </p>
                        <p className="mt-2 text-body text-muted">{step.body}</p>
                      </div>
                    </li>
                  </Reveal>
                ))}
              </ol>
            </div>

            {/* diagram + helper (sticky) */}
            <div className="flex flex-col gap-10 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-xl border border-line bg-surface/50 p-8">
                <Label className="mb-4 block">Width × Drop, in cm</Label>
                <MeasureDiagram />
              </div>
              <HeaderHelper />
              <Link
                to="/design-service"
                className="inline-flex items-center gap-2 text-small text-ink transition-colors hover:opacity-70"
              >
                Still unsure? Book a free measure
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
