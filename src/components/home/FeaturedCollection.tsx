import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCollections } from '@/hooks'
import { Label, Skeleton } from '@/components/ui'
import { getImageUrl } from '@/lib/getImageUrl'
import { home } from '@/config/home'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * Full-bleed cinematic band telling one collection's story. The background
 * parallaxes on scroll and the text is briefly pinned (GSAP ScrollTrigger,
 * synced to Lenis via the app's scrollerProxy). Static under reduced-motion.
 */
export function FeaturedCollection() {
  const { data, isLoading } = useCollections({ featured: true })
  const featured = data?.[0]
  const reduced = usePrefersReducedMotion()

  const sectionRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced || !featured) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bgRef.current,
        { yPercent: -12 },
        {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
      ScrollTrigger.create({
        trigger: textRef.current,
        start: 'center center',
        end: '+=35%',
        pin: true,
        pinSpacing: false,
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [reduced, featured])

  if (isLoading) {
    return (
      <div className="px-gutter py-10">
        <Skeleton className="h-[70vh] w-full rounded-lg" />
      </div>
    )
  }
  if (!featured) return null

  return (
    <div
      ref={sectionRef}
      className="relative flex h-[86vh] min-h-[520px] items-center justify-center overflow-hidden"
    >
      {/* parallax background (oversized for travel room) */}
      <div
        ref={bgRef}
        aria-hidden="true"
        className="absolute inset-x-0 -top-[12%] h-[124%]"
        style={{
          backgroundColor: 'rgb(var(--ink-rgb) / 0.9)',
          backgroundImage: `linear-gradient(to bottom, rgb(0 0 0 / 0.45), rgb(0 0 0 / 0.55)), url(${getImageUrl(
            featured.heroImage,
          )})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div ref={textRef} className="relative z-10 max-w-2xl px-gutter text-center">
        <Label className="mb-5 block text-white/70">{home.featured.eyebrow}</Label>
        <h2 className="font-display text-display-2 leading-[0.95] text-white">
          {featured.name}
        </h2>
        <p className="mx-auto mt-5 max-w-md text-body text-white/80">
          {featured.tagline}. {featured.description}
        </p>
        <Link
          to={`/collections/${featured.slug}`}
          className="mt-9 inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3 text-small text-white transition-colors duration-fast hover:bg-white hover:text-ink"
        >
          {home.featured.cta}
          <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
        </Link>
      </div>
    </div>
  )
}
