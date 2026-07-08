import { Hero } from '@/components/marketing/Hero'
import { LiveMatchesDemo } from '@/components/marketing/LiveMatchesDemo'
import { HowItWorks } from '@/components/marketing/HowItWorks'
import { ScoringRanking } from '@/components/marketing/ScoringRanking'
import { FinalCta } from '@/components/marketing/FinalCta'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-carbon">
      <Hero />
      <LiveMatchesDemo />
      <HowItWorks />
      <ScoringRanking />
      <FinalCta />
    </div>
  )
}
