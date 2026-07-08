import { TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getUserAccess } from '@/lib/access'
import { GeneradorClient } from './GeneradorClient'
import { ResponsibleNotice } from '@/components/shared/ResponsibleNotice'
import type { Subscriber } from '@/types/database'

export default async function GeneradorPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // MVP: premium gratis para todos
  let maxPicks = 6
  let isPremium = true

  if (user) {
    const [profileRes, subscriberRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', user.id).single(),
      supabase.from('subscribers').select('*').eq('user_id', user.id).maybeSingle(),
    ])
    const access = getUserAccess(profileRes.data as never, subscriberRes.data as Subscriber | null)
    maxPicks = access.limits.maxPicks
    isPremium = access.isPremium
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <TrendingUp className="h-6 w-6 text-teal-400" />
          <h1 className="text-2xl font-bold text-white">Generador de Combinadas</h1>
        </div>
        <p className="text-texto-secundario text-sm">Construye combinadas con cuotas reales. El análisis IA llega en la próxima fase.</p>
      </div>

      <ResponsibleNotice variant="compact" className="mb-6" />

      <GeneradorClient isLoggedIn={!!user} maxPicks={maxPicks} isPremium={isPremium} />
    </div>
  )
}
