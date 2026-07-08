import { createClient } from '@/lib/supabase/server'
import { SimuladorClient } from './SimuladorClient'

export const metadata = { title: 'Simulador — GañanesBets' }

export default async function SimuladorPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Simulador sin dinero</h1>
        <p className="text-texto-secundario text-sm">Practica con dinero ficticio. Sin riesgo real, sin dinero real.</p>
      </div>
      <SimuladorClient isLoggedIn={!!user} />
    </main>
  )
}
