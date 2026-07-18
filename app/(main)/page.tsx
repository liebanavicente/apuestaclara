import { Hero } from '@/components/marketing/Hero'
import { LiveMatchesDemo } from '@/components/marketing/LiveMatchesDemo'
import { HowItWorks } from '@/components/marketing/HowItWorks'
import { GananesbetsSystem } from '@/components/marketing/GananesbetsSystem'
import { ScoringRanking } from '@/components/marketing/ScoringRanking'
import { FinalCta } from '@/components/marketing/FinalCta'
import { getMultipleSportsEvents } from '@/lib/services/odds.service'

export const revalidate = 300

export default async function HomePage() {
  const events = await getMultipleSportsEvents(['soccer_fifa_world_cup', 'soccer_uefa_champs_league'])
  const upcoming = events.filter(e => new Date(e.commence_time) > new Date())

  return (
    <div className="min-h-screen bg-carbon">
      <Hero />
      <GananesbetsSystem />
      <LiveMatchesDemo matches={upcoming} />
      <HowItWorks />
      <ScoringRanking />
      <FinalCta />
    </div>
  )
}
