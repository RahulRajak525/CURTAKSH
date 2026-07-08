/**
 * Homepage editorial copy. Components pull from here — no hardcoded copy.
 * India-first: distances in km, prices in ₹ (see lib/format).
 */
export const home = {
  hero: {
    eyebrow: 'The Living Window',
    headline: 'Light, tailored to your window.',
    sub: 'Made-to-measure curtains, sheers and shades — engineered around the real light in your room. Drag the sun to see them answer.',
    ctas: [
      { label: 'Explore Collections', href: '/collections', variant: 'solid' as const },
      { label: 'Book the Atelier', href: '/design-service', variant: 'outline' as const },
    ],
  },

  proofPoints: [
    'Free swatches',
    'Made to measure',
    'Free design consultation',
    'Delivered across India',
    'Installed by our team',
  ],
  proofPointsTitle: 'The made-to-measure promise',

  categories: {
    eyebrow: 'Shop by category',
    title: 'Find your fabric',
  },

  featured: {
    eyebrow: 'Featured collection',
    cta: 'Explore the collection',
    fallbackLine: 'A collection tuned to the light of your room.',
  },

  showcase: {
    eyebrow: 'Made to Measure',
    title: 'Cut, sewn and finished to your window',
    empty: 'New pieces are being cut. Check back shortly.',
  },

  drapeReveal: {
    eyebrow: 'Before / After',
    headline: 'See the difference a drape makes.',
    sub: 'Pull the handle across a bare, glaring window and watch the room soften — warmer light, quieter glare, a space you want to be in.',
    bareLabel: 'Bare window',
    dressedLabel: 'Dressed in Curtaksh',
  },

  materials: {
    eyebrow: 'Materials',
    headline: 'Feel the fabric.',
    sub: 'Hover a swatch to move in close — every weave, weight and finish, in macro.',
  },

  atelier: {
    eyebrow: 'The Atelier',
    title: 'Design Service',
    sub: 'A personal Style Expert, from first idea to final install — at home or in the showroom.',
    steps: [
      {
        n: '01',
        title: 'Book',
        body: 'Tell us about your windows and your light. Pick a time that suits — virtual, in-home, or in the showroom.',
      },
      {
        n: '02',
        title: 'Consult',
        body: 'Your Style Expert brings swatches and measures on site, then tailors fabric, function and finish to your room.',
      },
      {
        n: '03',
        title: 'Installed',
        body: 'We cut, sew and hang everything for you — delivered and fitted across India, to the millimetre.',
      },
    ],
    cta: { label: 'Book a consultation', href: '/design-service' },
  },

  socialProof: {
    eyebrow: 'In good company',
    testimonials: [
      {
        quote:
          'The team measured, advised and installed in a week. The living room finally feels like dusk even at noon — exactly what we wanted.',
        name: 'Ananya Rao',
        role: 'Bengaluru',
      },
      {
        quote:
          'I dragged the light slider on the site and knew instantly. The sheers glow the same way in our home. Extraordinary attention to light.',
        name: 'Kabir Menon',
        role: 'Mumbai',
      },
      {
        quote:
          'Free swatches arrived in two days, the consultation was genuinely useful, and the blackout drapes are flawless. Worth every rupee.',
        name: 'Meera Iyer',
        role: 'Chennai',
      },
    ],
  },

  closing: {
    headline: 'Dress your windows in light.',
    sub: 'Order free swatches, or book a consultation with our atelier. No pressure — just better light.',
    reassurance: 'Free swatches, delivered across India. Made to measure, installed by our team.',
  },
} as const
