import { Hero } from '@/components/home/Hero'
import { MarqueeStrip } from '@/components/home/MarqueeStrip'
import { ShopByCategory } from '@/components/home/ShopByCategory'
import { FeaturedCollection } from '@/components/home/FeaturedCollection'
import { ProductShowcase } from '@/components/home/ProductShowcase'
import { FabricOfLight } from '@/components/home/FabricOfLight'
import { DrapeReveal } from '@/components/home/DrapeReveal'
import { Materials } from '@/components/home/Materials'
import { Atelier } from '@/components/home/Atelier'
import { SocialProof } from '@/components/home/SocialProof'
import { ClosingNewsletter } from '@/components/home/ClosingNewsletter'

/**
 * The cinematic homepage. Hero cloth reacts to the cursor + Light scrubber;
 * every section below reveals on scroll and pulls its content through services.
 */
export function Home() {
  return (
    <>
      <Hero />
      <MarqueeStrip />
      <ShopByCategory />
      <FeaturedCollection />
      <ProductShowcase />
      <FabricOfLight />
      <DrapeReveal />
      <Materials />
      <Atelier />
      <SocialProof />
      <ClosingNewsletter />
    </>
  )
}
