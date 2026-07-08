import type { HeaderStyle } from '@/types'

/**
 * Editorial copy for the standalone pages. Components read from here — no
 * hardcoded copy. India-first: distances in km, measurements in cm.
 */
export const content = {
  inspiration: {
    eyebrow: 'Lookbook',
    title: 'Rooms, dressed in light',
    intro:
      'Real windows, real light. Browse styled spaces and shop the pieces in each — filter by room or mood.',
    allLabel: 'All',
  },

  designService: {
    hero: {
      eyebrow: 'The Atelier',
      title: 'Your window, designed with you',
      sub: 'A personal Style Expert from first idea to final install — at home, in the showroom, or on a video call. No charge, no pressure.',
      cta: 'Book a consultation',
    },
    steps: [
      { n: '01', title: 'Book', body: 'Tell us about your windows and your light, and pick a time that suits.' },
      { n: '02', title: 'Consult', body: 'Your Style Expert brings swatches, measures on site, and listens.' },
      { n: '03', title: 'Design', body: 'We tailor fabric, function and finish to your room — and your budget.' },
      { n: '04', title: 'Installed', body: 'We cut, sew and fit everything for you, to the millimetre.' },
    ],
    includesTitle: 'What’s included',
    includes: [
      { title: 'Home visit', body: 'On-site measure and styling across your rooms.' },
      { title: 'Fabric library', body: 'Swatches to live with before you decide.' },
      { title: 'Light study', body: 'We map how your rooms change through the day.' },
      { title: '3D preview', body: 'See the drape in your space before you commit.' },
      { title: 'Made to measure', body: 'Cut and sewn to your exact windows.' },
      { title: 'Fitting', body: 'Professional install and a final dressing.' },
    ],
    projectsTitle: 'Recent projects',
    form: {
      title: 'Book your consultation',
      sub: 'We’ll be in touch within one working day.',
      projectTypes: [
        'Whole home',
        'Single room',
        'Curtains',
        'Shades',
        'Motorisation',
        'Trade / commercial',
      ],
      labels: {
        name: 'Full name',
        email: 'Email',
        phone: 'Phone',
        city: 'City',
        projectType: 'Project type',
        message: 'Tell us about your project',
        submit: 'Request consultation',
      },
      success: 'Thank you — your Style Expert will be in touch within one working day.',
    },
  },

  fabrics: {
    eyebrow: 'Materials',
    title: 'The Fabric Library',
    intro:
      'Every weave, weight and opacity — linen, silk voile, brushed wool and blackout velvet. Hover to move in close, and order a free swatch to live with.',
    filters: { material: 'Material', weight: 'Weight', opacity: 'Opacity' },
    orderSwatch: 'Order swatch',
    swatchSent: 'On its way',
    empty: 'No fabrics match those filters.',
  },

  measure: {
    eyebrow: 'Support · Guide',
    title: 'How to measure',
    intro:
      'Measure twice, order once. All measurements in centimetres — take your time, and reach us if in doubt.',
    steps: [
      { n: '01', title: 'Measure the width', body: 'Measure the track or rod end to end in cm. For curtains, add 15–20 cm each side of the window so they can stack back off the glass.' },
      { n: '02', title: 'Measure the drop', body: 'Measure in cm from the top of the track/rod to where you want the curtain to end — sill, below sill, or floor.' },
      { n: '03', title: 'Choose your pooling', body: 'For a tailored hang, finish 1 cm above the floor. For a relaxed pool, add 5–15 cm to the drop.' },
      { n: '04', title: 'Add header allowance', body: 'We add the right fullness and heading allowance for your chosen style — you only give us the finished size.' },
    ],
    helper: {
      title: 'Which header style?',
      sub: 'Answer two quick questions for a recommendation.',
      questions: [
        {
          id: 'look',
          label: 'Preferred look',
          options: [
            { value: 'relaxed', label: 'Relaxed' },
            { value: 'tailored', label: 'Tailored' },
          ],
        },
        {
          id: 'mount',
          label: 'Mounting on',
          options: [
            { value: 'rod', label: 'A rod' },
            { value: 'track', label: 'A track' },
          ],
        },
      ],
      resultLabel: 'We’d suggest',
    },
  },

  about: {
    hero: {
      eyebrow: 'Our story',
      title: 'We dress windows in light',
      sub: 'Curtaksh began with a simple obsession: that a curtain is not decoration, but an instrument for light.',
    },
    story: [
      'We started in a small atelier, frustrated that beautiful fabric was so often hung without thought for the light it would live in. So we began engineering drapes around the sun — testing weave, weight and opacity against real rooms at real hours.',
      'Today every piece is still cut, sewn and finished by hand, made to the millimetre for a single window. We measure, we advise, and we install — because the last 1 cm is where a room is made.',
    ],
    values: [
      { title: 'Craft', body: 'Cut and sewn by hand in small batches, finished to the millimetre.' },
      { title: 'Sustainability', body: 'OEKO-TEX® fabrics, low-impact dyes, and made-to-order so nothing is wasted.' },
      { title: 'Light, first', body: 'Every fabric is chosen for how it behaves in your room’s light, not just how it looks flat.' },
    ],
    milestonesTitle: 'Milestones',
    milestones: [
      { year: '2019', title: 'The first atelier', body: 'A two-person workroom and a single loom of Belgian linen.' },
      { year: '2021', title: 'Made to measure', body: 'We opened our first measuring-and-fitting service across the city.' },
      { year: '2023', title: 'The Light Engine', body: 'We began mapping fabric behaviour through the full arc of the day.' },
      { year: '2025', title: 'Four showrooms', body: 'Mumbai, Delhi, Bengaluru and Chennai — with nationwide fitting.' },
      { year: '2026', title: 'Design Service', body: 'A personal Style Expert for every window, at home or online.' },
    ],
  },

  contact: {
    eyebrow: 'Support',
    title: 'Talk to us',
    sub: 'Questions, orders, or a project in mind — reach the atelier, or find your nearest showroom.',
    topics: ['General enquiry', 'An existing order', 'Design service', 'Trade', 'Press'],
    labels: {
      name: 'Full name',
      email: 'Email',
      topic: 'Topic',
      message: 'Message',
      submit: 'Send message',
    },
    success: 'Thank you — we’ll reply within one working day.',
    storesTitle: 'Showrooms',
    storesNote: 'Free fitting within 30 km of every showroom.',
  },
} as const

/** "Which header style?" recommendation (used by the measure helper). */
export function recommendHeader(look: string, mount: string): HeaderStyle {
  if (look === 'tailored') return mount === 'track' ? 'pinch-pleat' : 'eyelet'
  return mount === 'track' ? 'rod-pocket' : 'tab-top'
}

export const HEADER_NOTES: Record<HeaderStyle, string> = {
  eyelet: 'Clean, even folds on a rod — modern and easy to draw.',
  'pinch-pleat': 'Tailored, structured pleats — the most formal hang.',
  'tab-top': 'Relaxed loops over a rod — casual and light.',
  'rod-pocket': 'Soft gathers on a track — understated and quiet.',
}
