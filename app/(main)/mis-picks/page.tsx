import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MisPicksClient } from './MisPicksClient'

export const metadata = { title: 'Mis picks — ApuestaClara' }

export default async function MisPicksPage({
  searchParams,
}: {
  searchParams: Promise<{ import?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/mis-picks')

  const admin = createAdminClient()
  const { import: importParam } = await searchParams

  const { data: picks } = await admin
    .from('picks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const totalPoints = (picks ?? []).reduce((sum: number, p: any) => sum + (p.points ?? 0), 0)

  let importedLegs: { description: string; selection: string; odds: number }[] | null = null
  if (importParam) {
    try {
      const raw = JSON.parse(decodeURIComponent(importParam))
      if (Array.isArray(raw) && raw.length > 0) {
        importedLegs = raw.map((p: any) => ({
          description: p.event_name ?? p.description ?? '',
          selection: p.selection ?? '',
          odds: Number(p.odds) || 1.5,
        }))
      }
    } catch {}
  }

  return (
    <MisPicksClient
      picks={picks ?? []}
      totalPoints={totalPoints}
      userId={user.id}
      importedLegs={importedLegs}
    />
  )
}
