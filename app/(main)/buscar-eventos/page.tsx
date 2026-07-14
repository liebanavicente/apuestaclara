import { Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { EventsClient } from './EventsClient'
import { ResponsibleNotice } from '@/components/shared/ResponsibleNotice'

export default async function BuscarEventosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Search className="h-6 w-6 text-teal-400" />
          <h1 className="text-2xl font-bold text-white">Buscar Eventos</h1>
        </div>
        <p className="text-slate-400 text-sm">Cuotas reales de múltiples casas de apuestas. Añade picks a tu selección.</p>
      </div>

      <ResponsibleNotice variant="compact" className="mb-6" />

      <EventsClient isLoggedIn={!!user} />
    </div>
  )
}
