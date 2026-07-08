/** Global site configuration — the single source for brand copy & contact. */
export const site = {
  name: 'Curtaksh',
  tagline: 'Dressing windows in light',
  description:
    'Premium curtains, sheers, and blinds — engineered around real light. Curtaksh dresses windows in fabric that answers to the sun.',
  url: 'https://drape.example',
  locale: 'en-IN',
  currency: 'INR',
  contact: {
    email: 'atelier@drape.example',
    phone: '+1 (212) 555-0147',
    address: '84 Meridian Row, New York, NY 10013',
    hours: 'Tue–Sat, 10–6',
  },
  social: [
    { label: 'Instagram', href: 'https://instagram.com/drape' },
    { label: 'Pinterest', href: 'https://pinterest.com/drape' },
    { label: 'YouTube', href: 'https://youtube.com/@drape' },
  ],
  newsletter: {
    eyebrow: 'The Atelier Letter',
    heading: 'Light, in your inbox',
    blurb:
      'Seasonal fabric drops, styling notes, and early access to made-to-measure. No noise.',
    placeholder: 'you@email.com',
    cta: 'Join',
    success: 'Welcome in — check your inbox to confirm.',
  },
  footer: {
    signoff: 'Dress your windows in light.',
    storeLocator: { label: 'Find a showroom', href: '/contact' },
    payments: ['Visa', 'Mastercard', 'Amex', 'Apple Pay', 'Klarna'],
    press: ['Vogue Living', 'Dwell', 'Kinfolk', 'Architectural Digest'],
    legal: [
      { label: 'Privacy', href: '/about' },
      { label: 'Terms', href: '/about' },
      { label: 'Accessibility', href: '/about' },
      { label: 'Cookies', href: '/about' },
    ],
  },
} as const

export type SiteConfig = typeof site
