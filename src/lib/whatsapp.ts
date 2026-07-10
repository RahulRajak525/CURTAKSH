import { site } from '@/config/site'

/**
 * WhatsApp routing for contact & inquiry actions.
 *
 * A `wa.me` deep link is device-aware by design: it opens the native WhatsApp
 * app on mobile and WhatsApp Web / Desktop on a laptop — no branching needed.
 * Number is sourced from `site.contact.whatsapp` (digits only).
 */
export const whatsappNumber = site.contact.whatsapp.replace(/[^\d]/g, '')

/** Build a `wa.me` link to the store number, with an optional prefilled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

/**
 * Open WhatsApp (app on mobile, web/desktop on laptop) to the store number.
 * Call this synchronously inside a click/submit handler so the browser treats
 * it as a user gesture and doesn't block the new tab.
 */
export function openWhatsApp(message?: string): void {
  if (typeof window === 'undefined') return
  window.open(whatsappLink(message), '_blank', 'noopener,noreferrer')
}

/** Compose a readable WhatsApp message from labelled fields (blank fields skipped). */
export function composeWhatsappMessage(
  intro: string,
  fields: Array<[label: string, value: string | undefined]>,
): string {
  const lines = fields
    .filter(([, value]) => value && value.trim())
    .map(([label, value]) => `${label}: ${value!.trim()}`)
  return [intro, '', ...lines].join('\n')
}
