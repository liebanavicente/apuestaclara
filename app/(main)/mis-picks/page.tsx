import { createAdminClient } from '@/lib/supabase/admin'
import { getMissingSupabaseAdminConfig, hasSupabaseAdminConfig } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MisPicksClient } from './MisPicksClient'

export const metadata = { title: 'Mis picks — Gañanesbets' }

export default async function MisPicksPage({
  searchParams,
}: {
  searchParams: Promise<{ import?: string }>
}) {
  if (!hasSupabaseAdminConfig()) {
    const missing = getMissingSupabaseAdminConfig().join(', ')
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p className="mb-2 text-xs font-bold uppercase text-neon">Mis picks</p>
        <h1 className="font-display text-4xl text-white">Conecta Supabase para guardar picks</h1>
        <p className="mt-3 text-sm text-texto-secundario">
          Falta configuración de servidor: {missing}. Cuando esté en `.env.local` y en Vercel,
          esta pantalla cargará tus picks y permitirá publicar selecciones.
        </p>
      </main>
    )
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/mis-picks')

  const { import: importParam } = await searchParams

  const admin = createAdminClient()

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
