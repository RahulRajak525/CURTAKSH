import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Heart, Search, Plus } from 'lucide-react'
import {
  Button,
  IconButton,
  Container,
  Section,
  GlassPanel,
  Badge,
  Label,
  Divider,
  Reveal,
  SplitText,
  Marquee,
} from '@/components/ui'
import { LightOrb } from '@/components/three/LightOrb'
import { ANCHORS, computeThemeVars } from '@/lib/theme'
import { site } from '@/config/site'

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-t border-line py-10">
      <Label className="mb-6 block">{title}</Label>
      {children}
    </div>
  )
}

/** A card whose CSS variables are locked to one anchor phase, so every primitive
 *  inside it renders in that phase regardless of the global light. */
function PhaseCard({ phase, label }: { phase: number; label: string }) {
  const style = computeThemeVars(phase) as unknown as CSSProperties
  return (
    <div
      style={style}
      className="overflow-hidden rounded-lg border border-line bg-surface p-6 text-ink shadow-soft"
    >
      <div className="flex items-baseline justify-between">
        <span className="font-display text-h4">{label}</span>
        <Label>{Math.round(phase * 100)}%</Label>
      </div>

      <p className="mt-3 text-small leading-relaxed text-muted">
        Sheer light and long shadow — the palette interpolated at phase{' '}
        {phase.toFixed(2)}.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button size="sm" variant="solid">
          Solid
        </Button>
        <Button size="sm" variant="outline">
          Outline
        </Button>
        <Button size="sm" variant="ghost">
          Ghost
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge variant="outline">Linen</Badge>
        <Badge variant="accent">Sheer</Badge>
        <Badge variant="solid">New</Badge>
      </div>

      <GlassPanel className="mt-5 p-4">
        <Label>Glass</Label>
        <p className="mt-2 text-small text-ink">Surface · 60% · blur 20</p>
      </GlassPanel>

      <div className="mt-5 flex items-center gap-2">
        {['--bg', '--surface', '--ink', '--line', '--accent', '--glow'].map(
          (v) => (
            <span
              key={v}
              title={v}
              className="h-6 w-6 rounded-full border border-line"
              style={{ background: `var(${v})` }}
            />
          ),
        )}
      </div>
    </div>
  )
}

/** Storybook-style route: every primitive, plus all four light phases side by
 *  side so the theme system is visually verifiable. */
export function KitchenSink() {
  return (
    <Section as="div" className="py-20">
      <Container>
      <div className="mb-4 flex items-center justify-between">
        <Label>{site.name} · Kitchen Sink</Label>
        <Link
          to="/"
          className="text-small text-muted transition-colors hover:text-ink"
        >
          ← Home
        </Link>
      </div>

      <SplitText
        as="h1"
        text="Quiet futurism, in parts"
        splitBy="char"
        className="font-display text-display-2 text-ink"
      />
      <p className="mt-4 max-w-prose text-body text-muted">
        Every primitive below is token-driven and re-lights with the global
        scrubber. The four cards further down lock to a fixed phase each.
      </p>

      {/* Typography */}
      <Block title="Type scale">
        <div className="space-y-3">
          <p className="font-display text-display-1 leading-none text-ink">
            Display 1
          </p>
          <p className="font-display text-display-2 text-ink">Display 2</p>
          <h1 className="text-h1 text-ink">Heading 1</h1>
          <h2 className="text-h2 text-ink">Heading 2</h2>
          <h3 className="text-h3 text-ink">Heading 3</h3>
          <h4 className="text-h4 text-ink">Heading 4</h4>
          <p className="text-body text-ink">
            Body — {site.description}
          </p>
          <p className="text-small text-muted">Small — supporting detail.</p>
          <Label>Label — Geist Mono · .15em</Label>
        </div>
      </Block>

      {/* Buttons */}
      <Block title="Buttons">
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="solid" iconRight={<ArrowRight className="h-4 w-4" />}>
            Solid
          </Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="solid" magnetic>
            Magnetic
          </Button>
          <Button variant="solid" size="lg">
            Large
          </Button>
          <Button variant="outline" size="sm">
            Small
          </Button>
          <Button variant="solid" disabled>
            Disabled
          </Button>
          <IconButton label="Add to wishlist" variant="outline">
            <Heart className="h-4 w-4" />
          </IconButton>
          <IconButton label="Search" variant="ghost">
            <Search className="h-4 w-4" />
          </IconButton>
          <IconButton label="Add" variant="solid">
            <Plus className="h-4 w-4" />
          </IconButton>
        </div>
      </Block>

      {/* Badges & labels */}
      <Block title="Badges & labels">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline">Outline</Badge>
          <Badge variant="solid">Solid</Badge>
          <Badge variant="accent">Accent</Badge>
          <Label>GSM 245</Label>
          <Divider orientation="vertical" className="h-5" />
          <Label>OEKO-TEX®</Label>
        </div>
      </Block>

      {/* Glass */}
      <Block title="Glass panel">
        <div className="relative overflow-hidden rounded-lg">
          <div
            className="absolute inset-0"
            style={{ background: 'var(--glow)', opacity: 0.35 }}
          />
          <div className="relative flex gap-4 p-8">
            <GlassPanel className="flex-1 p-6">
              <Label>Glassmorphism</Label>
              <p className="mt-2 text-body text-ink">
                Surface at 60% · backdrop-blur 20 · 1px line
              </p>
            </GlassPanel>
            <GlassPanel radius="xl" className="flex-1 p-6">
              <Label>Radius XL</Label>
              <p className="mt-2 text-body text-ink">Rounded 24</p>
            </GlassPanel>
          </div>
        </div>
      </Block>

      {/* Reveal & SplitText */}
      <Block title="Reveal / SplitText (scroll into view)">
        <Reveal variant="mask" className="mb-6">
          <p className="font-display text-h2 text-ink">
            This line masks up as it enters.
          </p>
        </Reveal>
        <Reveal variant="fade" delay={0.1}>
          <p className="text-body text-muted">And this one fades up after it.</p>
        </Reveal>
        <SplitText
          as="p"
          text="Word by word, the headline settles."
          splitBy="word"
          className="mt-6 font-display text-h3 text-ink"
        />
      </Block>

      {/* Marquee */}
      <Block title="Marquee">
        <Marquee speed={22} className="border-y border-line py-4">
          {['LINEN', 'SILK VOILE', 'MERINO WOOL', 'COTTON VELVET', 'BLACKOUT'].map(
            (t) => (
              <span key={t} className="label text-ink">
                {t}
              </span>
            ),
          )}
        </Marquee>
      </Block>

      {/* Three / R3F */}
      <Block title="React Three Fiber — light-reactive orb">
        <LightOrb className="h-64 w-full overflow-hidden rounded-lg border border-line bg-surface" />
      </Block>

      {/* All four phases */}
      <Block title="All four light phases (theme system verification)">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ANCHORS.map((a) => (
            <PhaseCard key={a.key} phase={a.phase} label={a.label} />
          ))}
        </div>
      </Block>
      </Container>
    </Section>
  )
}
