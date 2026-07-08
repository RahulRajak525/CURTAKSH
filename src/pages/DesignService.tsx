import { Check } from "lucide-react";
import { useLooks } from "@/hooks";
import {
  Container,
  Section,
  Label,
  Button,
  Reveal,
  Divider,
} from "@/components/ui";
import { AppointmentForm } from "@/components/atelier/AppointmentForm";
import { useLenis } from "@/components/motion/SmoothScrollProvider";
import { getImageUrl } from "@/lib/getImageUrl";
import { content } from "@/config/content";
import { site } from "@/config/site";

export function DesignService() {
  const { data: looks } = useLooks();
  const lenis = useLenis();
  const ds = content.designService;

  const scrollToBook = () => {
    const el = document.getElementById("book");
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -80 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* hero */}
      <Section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 90% at 20% 0%, rgb(var(--glow-rgb) / 0.4), transparent 55%)",
          }}
        />
        <Container className="relative">
          <div className="max-w-2xl">
            {/* <Label className="mb-6 block">{ds.hero.eyebrow}</Label> */}
            <h1 className="font-display text-display-1 leading-[0.92] text-ink">
              {ds.hero.title}
            </h1>
            <p className="mt-6 max-w-md text-body text-muted">{ds.hero.sub}</p>
            <Button
              className="mt-8"
              variant="solid"
              size="lg"
              magnetic
              onClick={scrollToBook}
            >
              {ds.hero.cta}
            </Button>
          </div>
        </Container>
      </Section>

      {/* how it works */}
      <Section className="border-y border-line bg-surface/40">
        <Container>
          <Label className="mb-12 block">How it works</Label>
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {ds.steps.map((step, i) => (
              <Reveal key={step.n} variant="fade" delay={i * 0.06}>
                <div>
                  <span className="font-display text-h1 text-accent">
                    {step.n}
                  </span>
                  <p className="mt-3 font-display text-h4 text-ink">
                    {step.title}
                  </p>
                  <p className="mt-2 text-small leading-relaxed text-muted">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* what's included */}
      <Section>
        <Container>
          <Reveal variant="fade">
            <h2 className="mb-10 font-display text-h1 text-ink">
              {ds.includesTitle}
            </h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ds.includes.map((item) => (
              <Reveal key={item.title} variant="fade">
                <div className="flex gap-3 rounded-lg border border-line p-5">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.2} />
                  </span>
                  <div>
                    <p className="text-body text-ink">{item.title}</p>
                    <p className="mt-1 text-small text-muted">{item.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* recent projects */}
      {looks && looks.length > 0 && (
        <Section className="pt-0">
          <Container>
            <Label className="mb-8 block">{ds.projectsTitle}</Label>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {looks.slice(0, 6).map((look) => (
                <Reveal key={look.id} variant="fade">
                  <div
                    className="aspect-[4/3] overflow-hidden rounded-lg border border-line"
                    style={{
                      backgroundColor: "rgb(var(--ink-rgb) / 0.06)",
                      backgroundImage: `url(${getImageUrl(look.image)})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    role="img"
                    aria-label={look.alt}
                  />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* book */}
      <Section id="book" className="border-t border-line">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <Label className="mb-4 block">{ds.form.title}</Label>
              <h2 className="font-display text-h1 leading-tight text-ink">
                {ds.form.sub}
              </h2>
              <Divider className="my-8" />
              <dl className="space-y-4 text-small">
                <div>
                  <dt className="text-muted">Call</dt>
                  <dd className="text-ink">{site.contact.phone}</dd>
                </div>
                <div>
                  <dt className="text-muted">Email</dt>
                  <dd className="text-ink">{site.contact.email}</dd>
                </div>
                <div>
                  <dt className="text-muted">Hours</dt>
                  <dd className="text-ink">{site.contact.hours}</dd>
                </div>
              </dl>
            </div>
            <AppointmentForm />
          </div>
        </Container>
      </Section>
    </>
  );
}
