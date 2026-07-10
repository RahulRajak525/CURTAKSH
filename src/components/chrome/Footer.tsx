import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Camera, Video, Bookmark, ArrowUpRight, MapPin, Phone } from 'lucide-react'
import { site } from '@/config/site'
import { footerNav } from '@/config/navigation'
import { Container, SlideButton, Label, Divider, Reveal } from '@/components/ui'

/** Newsletter capture — stubbed submit with a success state. */
function Newsletter() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const { newsletter } = site

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) return
    // Stub: no network. Pretend it worked.
    setDone(true)
  }

  return (
    <div className="w-full max-w-sm">
      <Label>{newsletter.eyebrow}</Label>
      <p className="mt-3 font-display text-h3 text-ink">{newsletter.heading}</p>
      <p className="mt-2 text-small text-muted">{newsletter.blurb}</p>

      {done ? (
        <p className="mt-5 text-small text-ink" role="status">
          {newsletter.success}
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-5 flex items-center gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={newsletter.placeholder}
            aria-label="Email address"
            className="h-11 flex-1 rounded-full border border-line bg-transparent px-4 text-small text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-ink"
          />
          <SlideButton type="submit" size="md">
            {newsletter.cta}
          </SlideButton>
        </form>
      )}
    </div>
  )
}

// lucide dropped brand marks; map socials to neutral, on-brand glyphs instead.
const socialIcons: Record<string, ReactNode> = {
  Instagram: <Camera className="h-[18px] w-[18px]" strokeWidth={1.6} />,
  YouTube: <Video className="h-[18px] w-[18px]" strokeWidth={1.6} />,
  Pinterest: <Bookmark className="h-[18px] w-[18px]" strokeWidth={1.6} />,
}

/**
 * Editorial, tall footer. Deeper surface tone (surface + an ink wash) that also
 * reacts to the Light Engine. Sign-off, newsletter, four config-sourced link
 * columns, contact/store-locator, social, payment/press strip and legal row.
 */
export function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden bg-surface">
      {/* deeper wash — reacts to the Light Engine via --ink */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-ink/[0.045]"
      />
      <div className="relative border-t border-line">
        <Container className="py-section">
          {/* Sign-off + newsletter */}
          <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-end">
            <Reveal variant="mask">
              <h2 className="max-w-xl font-display text-display-2 leading-[0.95] text-ink">
                {site.footer.signoff}
              </h2>
            </Reveal>
            <Newsletter />
          </div>

          <Divider className="my-14" />

          {/* Columns + contact */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-3 lg:grid-cols-6">
            {footerNav.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <Label as="h3" className="mb-4 block">
                  {col.title}
                </Label>
                <ul className="space-y-2.5">
                  {col.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.href}
                        className="text-small text-muted transition-colors duration-fast hover:text-ink"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            {/* Contact / store locator */}
            <div className="col-span-2">
              <Label as="h3" className="mb-4 block">
                Visit
              </Label>
              <address className="space-y-3 text-small not-italic text-muted">
                <p className="flex items-start gap-2">
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0 text-ink"
                    strokeWidth={1.6}
                  />
                  <span>
                    {site.contact.address}
                    <br />
                    {site.contact.hours}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-ink" strokeWidth={1.6} />
                  <a
                    href={`tel:${site.contact.phone.replace(/[^\d+]/g, '')}`}
                    className="transition-colors hover:text-ink"
                  >
                    {site.contact.phone}
                  </a>
                </p>
                <Link
                  to={site.footer.storeLocator.href}
                  className="inline-flex items-center gap-1 text-ink transition-colors hover:opacity-70"
                >
                  {site.footer.storeLocator.label}
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.6} />
                </Link>
              </address>
            </div>
          </div>

          <Divider className="my-12" />

          {/* Social + press */}
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="flex items-center gap-1.5">
              {site.social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  title={s.label}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-ink/[0.05]"
                >
                  {socialIcons[s.label] ?? (
                    <ArrowUpRight className="h-[18px] w-[18px]" strokeWidth={1.6} />
                  )}
                </a>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <Label className="text-muted/60">As seen in</Label>
              {site.footer.press.map((p) => (
                <span key={p} className="text-small text-muted">
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Payment / legal strip */}
          <div className="mt-12 flex flex-col-reverse items-start justify-between gap-6 border-t border-line pt-8 md:flex-row md:items-center">
            <p className="text-small text-muted">
              © {new Date().getFullYear()} {site.name}. {site.tagline}.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                {site.footer.payments.map((pay) => (
                  <span
                    key={pay}
                    className="rounded-sm border border-line px-2 py-1 text-[10px] uppercase tracking-wide text-muted"
                  >
                    {pay}
                  </span>
                ))}
              </div>
              <ul className="flex items-center gap-4">
                {site.footer.legal.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.href}
                      className="text-small text-muted transition-colors hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  )
}
