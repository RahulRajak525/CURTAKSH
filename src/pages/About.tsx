import { Container, Section, PageHero, Label, Reveal, Divider } from '@/components/ui'
import { content } from '@/config/content'
import { pexels } from '@/config/media'

export function About() {
  const about = content.about

  return (
    <>
      <PageHero
        eyebrow={about.hero.eyebrow}
        title={about.hero.title}
        intro={about.hero.sub}
        backgroundImage={pexels(35165092, 1600)}
      />

      {/* story */}
      <Section>
        <Container>
          <div className="mx-auto max-w-prose space-y-6">
            {about.story.map((para, i) => (
              <Reveal key={i} variant="fade">
                <p className="text-h4 font-normal leading-relaxed text-ink">
                  {para}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* values */}
      <Section className="border-y border-line bg-surface/40">
        <Container>
          <div className="grid gap-8 md:grid-cols-3">
            {about.values.map((v) => (
              <Reveal key={v.title} variant="fade">
                <div>
                  <Label className="mb-3 block text-accent">{v.title}</Label>
                  <p className="text-body leading-relaxed text-muted">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* milestones timeline */}
      <Section>
        <Container>
          <Reveal variant="fade">
            <h2 className="mb-14 font-display text-h1 text-ink">
              {about.milestonesTitle}
            </h2>
          </Reveal>

          <ol className="relative mx-auto max-w-2xl border-l border-line">
            {about.milestones.map((m) => (
              <Reveal key={m.year} variant="fade" className="block">
                <li className="relative pb-12 pl-8 last:pb-0">
                  {/* node */}
                  <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent" />
                  <span className="label text-muted">{m.year}</span>
                  <p className="mt-2 font-display text-h3 text-ink">{m.title}</p>
                  <p className="mt-2 max-w-md text-body text-muted">{m.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>

          <Divider className="my-16" />

          <Reveal variant="fade">
            <p className="mx-auto max-w-xl text-center font-display text-h2 italic text-ink">
              “The last 1 cm is where a room is made.”
            </p>
          </Reveal>
        </Container>
      </Section>
    </>
  )
}
