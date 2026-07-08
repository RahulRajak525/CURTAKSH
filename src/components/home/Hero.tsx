import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { Button, Container, GlassPanel, Label, SplitText } from "@/components/ui";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { home } from "@/config/home";

// Lazy so three.js + the sim only load when the live hero is actually used.
const ClothCurtainsHero = lazy(
  () => import("@/components/three/ClothCurtainsHero"),
);

/**
 * A token-driven "window framed by curtains" rendered in pure CSS. Serves three
 * roles: the Suspense poster while the 3D loads, the backdrop behind the canvas
 * (which is alpha), and the full static hero on mobile / reduced-motion.
 */
function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="absolute inset-0 bg-bg">
      {/* window light */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(115% 75% at 50% 32%, rgb(var(--glow-rgb) / 0.6), transparent 58%)",
        }}
      />
      {/* side curtain panels with pleats */}
      {/* {(["left", "right"] as const).map((side) => (
        <div
          key={side}
          className="absolute top-0 h-full w-[34%]"
          style={{
            [side]: 0,
            backgroundColor: "rgb(var(--surface-rgb))",
            backgroundImage: `
              linear-gradient(${side === "left" ? "90deg" : "270deg"}, transparent, rgb(var(--bg-rgb)) 96%),
              repeating-linear-gradient(90deg,
                rgb(var(--surface-rgb)) 0px,
                rgb(var(--surface-rgb)) 22px,
                rgb(var(--line-rgb)) 23px,
                rgb(var(--surface-rgb)) 46px)`,
            maskImage: `linear-gradient(${side === "left" ? "90deg" : "270deg"}, black 55%, transparent)`,
            WebkitMaskImage: `linear-gradient(${side === "left" ? "90deg" : "270deg"}, black 55%, transparent)`,
            boxShadow: "inset 0 0 140px rgb(var(--shadow-color-rgb) / 0.15)",
          }}
        />
      ))} */}
      {/* floor grounding */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background:
            "linear-gradient(to top, rgb(var(--bg-rgb)), transparent)",
        }}
      />
    </div>
  );
}

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const use3D = !reduced && !isMobile;

  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);

  // Pause the sim when the hero scrolls offscreen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const { hero } = home;

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[90svh] min-h-[620px] w-full items-center overflow-hidden"
    >
      <HeroBackdrop />

      {use3D && (
        <Suspense fallback={null}>
          <ClothCurtainsHero active={inView} />
        </Suspense>
      )}

      {/* Overlay — pointer-events off so cursor-wind reaches the canvas;
          re-enabled on the interactive controls. */}
      <Container size="wide" className="pointer-events-none relative z-10">
        <div className="flex items-center justify-between gap-12">
          <div className="max-w-2xl">
            <Label className="mb-6 block">{hero.eyebrow}</Label>
            <SplitText
              as="h3"
              text={hero.headline}
              splitBy="word"
              className="block font-display text-display-1 leading-[0.92] text-ink"
            />
            <p className="mt-7 max-w-md text-body text-muted">{hero.sub}</p>
            <div className="pointer-events-auto mt-10 flex flex-wrap gap-4">
              {hero.ctas.map((cta) => (
                <Button
                  key={cta.label}
                  variant={cta.variant}
                  magnetic
                  onClick={() => navigate(cta.href)}
                >
                  {cta.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Right-side proof card — balances the composition on wide screens */}
          <aside className="pointer-events-auto hidden w-[290px] shrink-0 xl:block">
            <GlassPanel className="bg-surface/70 p-7 shadow-soft">
              <Label className="block">{home.proofPointsTitle}</Label>
              <ul className="mt-6 space-y-4">
                {home.proofPoints.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-3 text-body text-ink"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                      <Check className="h-3 w-3" strokeWidth={2.5} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </GlassPanel>
          </aside>
        </div>
      </Container>
    </section>
  );
}
