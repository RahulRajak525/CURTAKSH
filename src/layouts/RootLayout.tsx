import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { LightProvider } from '@/components/motion/LightProvider'
import {
  SmoothScrollProvider,
  useLenis,
} from '@/components/motion/SmoothScrollProvider'
import { FilmGrain } from '@/components/motion/FilmGrain'
import { PageTransition } from '@/components/motion/PageTransition'
import { LightScrubber } from '@/components/LightScrubber'
import { Navbar } from '@/components/chrome/Navbar'
import { Footer } from '@/components/chrome/Footer'
import { FloatingWhatsApp } from '@/components/chrome/FloatingWhatsApp'
import { ScrollToTop } from '@/components/chrome/ScrollToTop'

import { Home } from '@/pages/Home'
import { NotFound } from '@/pages/NotFound'

// Every other route is code-split. Home + NotFound stay eager (fast first paint
// / cheap fallback); KitchenSink + the cloth hero keep three.js out of the
// initial bundle.
const named = <T,>(p: Promise<Record<string, T>>, key: string) =>
  p.then((m) => ({ default: m[key] as React.ComponentType }))

const Collections = lazy(() => named(import('@/pages/Collections'), 'Collections'))
const CollectionDetail = lazy(() => named(import('@/pages/CollectionDetail'), 'CollectionDetail'))
const ProductDetail = lazy(() => named(import('@/pages/ProductDetail'), 'ProductDetail'))
const Fabrics = lazy(() => named(import('@/pages/Fabrics'), 'Fabrics'))
const Inspiration = lazy(() => named(import('@/pages/Inspiration'), 'Inspiration'))
const DesignService = lazy(() => named(import('@/pages/DesignService'), 'DesignService'))
const GuideMeasure = lazy(() => named(import('@/pages/GuideMeasure'), 'GuideMeasure'))
const About = lazy(() => named(import('@/pages/About'), 'About'))
const Contact = lazy(() => named(import('@/pages/Contact'), 'Contact'))
const KitchenSink = lazy(() => named(import('@/pages/KitchenSink'), 'KitchenSink'))

/**
 * The routed shell. Global chrome (Navbar, Footer, light scrubber, grain)
 * persists while <PageTransition> plays the curtain animation between routes.
 * Scroll resets to top and Lenis/ScrollTrigger are refreshed on each change.
 */
function AppShell() {
  const location = useLocation()
  const lenis = useLenis()

  // Reset scroll to top on route change — hidden behind the closing curtain.
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
  }, [location.pathname, lenis])

  // Once the outgoing page has fully exited and the DOM has swapped, recompute
  // scroll bounds so scroll-driven animations stay in sync.
  const onTransitioned = () => {
    lenis?.resize()
    ScrollTrigger.refresh()
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-bg text-ink">
      <Navbar />
      <main className="relative flex-1">
        <AnimatePresence mode="wait" onExitComplete={onTransitioned}>
          <PageTransition key={location.pathname}>
            {/* One Suspense covers all code-split routes; the curtain covers the
                brief load, so a null fallback is invisible. */}
            <Suspense fallback={null}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/collections/:slug" element={<CollectionDetail />} />
                <Route path="/products/:slug" element={<ProductDetail />} />
                <Route path="/fabrics" element={<Fabrics />} />
                <Route path="/inspiration" element={<Inspiration />} />
                <Route path="/design-service" element={<DesignService />} />
                <Route path="/guide/measure" element={<GuideMeasure />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/kitchen-sink" element={<KitchenSink />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
      <LightScrubber />
      <FloatingWhatsApp />
      <ScrollToTop />
      <FilmGrain />
    </div>
  )
}

export function RootLayout() {
  return (
    <LightProvider>
      <SmoothScrollProvider>
        <AppShell />
      </SmoothScrollProvider>
    </LightProvider>
  )
}
