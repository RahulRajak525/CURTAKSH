import type { ReactNode } from "react";
import { Container } from "./Container";
import { Label } from "./Label";
import { SplitText } from "./SplitText";
import { getImageUrl } from "@/lib/getImageUrl";

/** Shared editorial page header: mono eyebrow, Fraunces title, intro line.
 *  Light-Engine-reactive by default (tokens). Pass `backgroundImage` for a
 *  photo-backed band (image + Light-Engine wash, matching the collection band). */
export function PageHero({
  eyebrow,
  title,
  intro,
  backgroundImage,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  backgroundImage?: string;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-line">
      {backgroundImage && (
        <>
          {/* hero texture */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundColor: "rgb(var(--surface-rgb))",
              backgroundImage: `url(${getImageUrl(backgroundImage)})`,
            }}
          />
          {/* Light-Engine-reactive wash keeps the copy readable */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(90% 120% at 20% 0%, rgb(var(--glow-rgb) / 0.4), transparent 55%), linear-gradient(to top, rgb(var(--bg-rgb)), rgb(var(--bg-rgb) / 0.55) 55%, rgb(var(--bg-rgb) / 0.2))",
            }}
          />
        </>
      )}
      <Container className="relative pb-14 pt-28">
        <Label className="mb-6 block">{eyebrow}</Label>
        <SplitText
          as="h2"
          text={title}
          className="block max-w-3xl font-display text-display-2 leading-[0.95] text-ink"
        />
        {intro && <p className="mt-6 max-w-xl text-body text-muted">{intro}</p>}
        {children}
      </Container>
    </header>
  );
}
