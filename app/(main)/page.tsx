import { Hero } from '@/components/home/Hero'
import { DashboardPreview } from '@/components/home/DashboardPreview'
import { Stats } from '@/components/home/Stats'
import { HowItWorks } from '@/components/home/HowItWorks'
import { FeaturedMatches } from '@/components/home/FeaturedMatches'
import { Testimonials } from '@/components/home/Testimonials'
import { Pricing } from '@/components/home/Pricing'
import { FAQ } from '@/components/home/FAQ'
import { FinalCTA } from '@/components/home/FinalCTA'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <DashboardPreview />
      <Stats />
      <HowItWorks />
      <FeaturedMatches />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </div>
  )
}
