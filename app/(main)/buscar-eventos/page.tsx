import { Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { hasSupabasePublicConfig } from '@/lib/supabase/config'
import { EventsClient } from './EventsClient'
import { ResponsibleNotice } from '@/components/shared/ResponsibleNotice'

export default async function BuscarEventosPage() {
  const supabase = hasSupabasePublicConfig() ? await createClient() : null
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Search className="h-6 w-6 text-neon" />
          <h1 className="text-2xl font-bold text-white">Buscar Eventos</h1>
        </div>
        <p className="text-texto-secundario text-sm">Cuotas reales de múltiples casas de apuestas. Añade picks a tu selección.</p>
      </div>

      <ResponsibleNotice variant="compact" className="mb-6" />

      <EventsClient isLoggedIn={!!user} />
    </div>
  )
}
