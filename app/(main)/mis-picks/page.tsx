import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MisPicksClient } from './MisPicksClient'

export const metadata = { title: 'Mis picks — GañanesBets' }

export default async function MisPicksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/mis-picks')

  const admin = createAdminClient()

  const [{ data: picks }, { data: bankrollRow }] = await Promise.all([
    admin
      .from('picks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    admin
      .from('bankrolls')
      .select('*')
      .eq('user_id', user.id)
      .single(),
  ])

  const bankroll = bankrollRow?.bankroll ?? 1000

  return <MisPicksClient picks={picks ?? []} bankroll={bankroll} userId={user.id} />
}
