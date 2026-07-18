import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getMissingSupabaseAdminConfig, hasSupabaseAdminConfig } from '@/lib/supabase/config'
import { getEvents } from '@/lib/services/odds.service'
import { redirect } from 'next/navigation'
import { WC_GROUPS, getGroupForMatch } from './groups'
import { MundialClient } from './MundialClient'
import type { NormalizedEvent } from '@/types/odds'

export const metadata = { title: 'Mundial 2026 — Gañanesbets' }
export const revalidate = 300

export default async function MundialPage() {
  if (!hasSupabaseAdminConfig()) {
    const missing = getMissingSupabaseAdminConfig().join(', ')
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p className="mb-2 text-xs font-bold uppercase text-neon">Mundial 2026</p>
        <h1 className="font-display text-4xl text-white">Conecta Supabase para activar picks</h1>
        <p className="mt-3 text-sm text-texto-secundario">
          Falta configuración de servidor: {missing}. El calendario se puede consultar, pero
          para guardar y resolver picks hace falta la clave admin de Supabase.
        </p>
      </main>
    )
  }

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
    <MundialClient
      groups={WC_GROUPS}
      matchesByGroup={Object.fromEntries(matchesByGroup)}
      unassigned={unassigned}
      myPicks={myPicks ?? []}
    />
  )
}
