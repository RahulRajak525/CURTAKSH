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
    email: 'info@decorandblinds.com',
    phone: '+91 92662 33858',
    whatsapp: '+919266233858',
    address: 'Plot No. 1142/53, Saraswati Kunj, DLF Phase 5, Gurgaon 122009',
    hours: 'Mon–Sat, 10–7',
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
