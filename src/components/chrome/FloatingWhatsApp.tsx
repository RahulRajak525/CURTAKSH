import { openWhatsApp } from '@/lib/whatsapp'
import { usePrefersReducedMotion } from '@/hooks'
import { cn } from '@/lib/utils'

/** WhatsApp brand glyph (lucide 1.x dropped brand marks). Green by default. */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.892c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.062 12.062 0 005.71 1.447h.006c6.585 0 11.946-5.335 11.949-11.893A11.821 11.821 0 0020.52 3.449" />
    </svg>
  )
}

/**
 * Persistent "contact us" affordance. A single tap opens WhatsApp — the native
 * app on mobile, WhatsApp Web / Desktop on a laptop (handled by the `wa.me`
 * deep link). Sits bottom-left so it clears the right-rail LightScrubber.
 */
export function FloatingWhatsApp() {
  const reduced = usePrefersReducedMotion()

  // Slow, weighted "drape" easing — the same curtain-falling curve used across
  // the site. Held instant under reduced-motion.
  const drape = 'cubic-bezier(0.83, 0, 0.17, 1)'

  return (
    <button
      type="button"
      onClick={() => openWhatsApp('Hi Curtaksh, I’d like to get in touch.')}
      aria-label="Contact us on WhatsApp"
      title="Chat on WhatsApp"
      className="glass group fixed bottom-6 left-6 z-40 flex h-12 items-center rounded-full border border-line pl-3.5 pr-3.5 text-small text-ink shadow-soft transition-transform duration-base ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03] active:scale-95"
    >
      <WhatsAppIcon className="h-5 w-5 shrink-0 text-[#25D366]" />
      {/* Reveal track: the pill grows to make room, in sync with the curtain. */}
      <span
        className={cn(
          'max-w-0 overflow-hidden opacity-0 transition-all group-hover:ml-2 group-hover:max-w-[9rem] group-hover:opacity-100',
        )}
        style={{
          transitionDuration: reduced ? '0ms' : '1100ms',
          transitionTimingFunction: drape,
        }}
      >
        {/* Curtain: text parts open from the centre outward (clip-path inset). */}
        <span
          className="block whitespace-nowrap [clip-path:inset(0_50%_0_50%)] transition-[clip-path] group-hover:[clip-path:inset(0_0%_0_0%)]"
          style={{
            transitionDuration: reduced ? '0ms' : '1100ms',
            transitionTimingFunction: drape,
            transitionDelay: reduced ? '0ms' : '160ms',
          }}
        >
          Chat with us
        </span>
      </span>
    </button>
  )
}
