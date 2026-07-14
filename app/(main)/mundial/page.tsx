import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getEvents } from '@/lib/services/odds.service'
import { redirect } from 'next/navigation'
import { WC_GROUPS, getGroupForMatch } from './groups'
import { MundialClient } from './MundialClient'
import { PorraFinalCard } from '@/components/porra/PorraFinalCard'
import type { NormalizedEvent } from '@/types/odds'

export const metadata = { title: 'Mundial 2026 — GañanesBets' }
export const revalidate = 300

export default async function MundialPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/mundial')

  const admin = createAdminClient()

  const [events, { data: myPicks }] = await Promise.all([
    getEvents('soccer_fifa_world_cup'),
    admin.from('picks').select('id,description,selection,odds,status,points').eq('user_id', user.id),
  ])

  // Assign each match to a group
  const matchesByGroup = new Map<string, NormalizedEvent[]>()
  const unassigned: NormalizedEvent[] = []

  for (const ev of events) {
    const groupId = getGroupForMatch(ev.home_team, ev.away_team)
    if (groupId) {
      const arr = matchesByGroup.get(groupId) ?? []
      arr.push(ev)
      matchesByGroup.set(groupId, arr)
    } else {
      unassigned.push(ev)
    }
  }

  return (
    <div>
      <div className="max-w-3xl mx-auto px-4 pt-8">
        <PorraFinalCard isLoggedIn={!!user} />
      </div>
      <MundialClient
        groups={WC_GROUPS}
        matchesByGroup={Object.fromEntries(matchesByGroup)}
        unassigned={unassigned}
        myPicks={myPicks ?? []}
      />
    </div>
  )
}
