import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { useStores } from '@/hooks'
import { Container, Section, PageHero, Label, Reveal, Skeleton } from '@/components/ui'
import { ContactForm } from '@/components/contact/ContactForm'
import { content } from '@/config/content'
import { pexels } from '@/config/media'
import { site } from '@/config/site'

export function Contact() {
  const { data: stores, isLoading, error } = useStores()

  return (
    <>
      <PageHero
        eyebrow={content.contact.eyebrow}
        title={content.contact.title}
        intro={content.contact.sub}
        backgroundImage={pexels(953400, 1600)}
      />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
            {/* form */}
            <ContactForm />

            {/* contact details */}
            <aside className="flex flex-col gap-6">
              <div className="rounded-lg border border-line p-6">
                <Label className="mb-4 block">Reach us</Label>
                <ul className="space-y-4 text-small">
                  <li className="flex items-center gap-3">
                    <Phone className="h-4 w-4 shrink-0 text-ink" strokeWidth={1.6} />
                    <a href={`tel:${site.contact.phone.replace(/[^\d+]/g, '')}`} className="text-ink hover:opacity-70">
                      {site.contact.phone}
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="h-4 w-4 shrink-0 text-ink" strokeWidth={1.6} />
                    <a href={`mailto:${site.contact.email}`} className="text-ink hover:opacity-70">
                      {site.contact.email}
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <Clock className="h-4 w-4 shrink-0 text-ink" strokeWidth={1.6} />
                    <span className="text-muted">{site.contact.hours}</span>
                  </li>
                </ul>
              </div>
              <p className="text-small text-muted">{content.contact.storesNote}</p>
            </aside>
          </div>
        </Container>
      </Section>

      {/* store locator */}
      <Section className="border-t border-line pt-0">
        <Container>
          <Label className="mb-8 block pt-16">{content.contact.storesTitle}</Label>
          {error ? (
            <p className="text-body text-muted">
              We couldn’t load showrooms just now. Please refresh.
            </p>
          ) : isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {stores?.map((store) => (
                <Reveal key={store.id} variant="fade">
                  <div className="flex h-full flex-col rounded-lg border border-line p-6">
                    <p className="font-display text-h4 text-ink">{store.city}</p>
                    <p className="mt-3 flex items-start gap-2 text-small text-muted">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ink" strokeWidth={1.6} />
                      {store.address}
                    </p>
                    <p className="mt-3 text-small text-muted">{store.hours}</p>
                    <a
                      href={`tel:${store.phone.replace(/[^\d+]/g, '')}`}
                      className="mt-auto pt-4 text-small text-ink hover:opacity-70"
                    >
                      {store.phone}
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
