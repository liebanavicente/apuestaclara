import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { hasSupabasePublicConfig } from '@/lib/supabase/config'

export default async function DebugPage() {
  if (!hasSupabasePublicConfig()) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="mb-6 text-2xl font-bold text-white">Debug Sistema</h1>
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          Falta configurar Supabase antes de consultar tablas y sesión.
        </div>
      </main>
    )
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const profileRes2 = await supabase.from('profiles').select('role').eq('user_id', user.id).single()
  const profile = profileRes2.data as { role: string } | null
  if (profile?.role !== 'admin') redirect('/')

  // Check Supabase tables
  const tables = ['profiles', 'subscribers', 'promo_codes', 'virtual_wallets', 'simulations', 'community_picks']
  const tableStatus = await Promise.all(
    tables.map(async (t) => {
      const { count, error } = await supabase.from(t as 'profiles').select('*', { count: 'exact', head: true })
      return { table: t, count: count ?? 0, ok: !error, error: error?.message }
    })
  )

  const checks = {
    'Supabase URL': process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurado' : '❌ Falta NEXT_PUBLIC_SUPABASE_URL',
    'The Odds API Key': process.env.THE_ODDS_API_KEY ? '✅ Configurado' : '❌ Falta THE_ODDS_API_KEY',
    'OpenAI Key': process.env.OPENAI_API_KEY ? '✅ Configurado' : '❌ Falta OPENAI_API_KEY',
    'Stripe Secret': process.env.STRIPE_SECRET_KEY ? '✅ Configurado' : '❌ Falta STRIPE_SECRET_KEY',
    'Stripe Webhook Secret': process.env.STRIPE_WEBHOOK_SECRET ? '✅ Configurado' : '❌ Falta STRIPE_WEBHOOK_SECRET',
    'Stripe Price ID': process.env.STRIPE_PREMIUM_PRICE_ID ? '✅ Configurado' : '❌ Falta STRIPE_PREMIUM_PRICE_ID',
    'Site URL': process.env.NEXT_PUBLIC_SITE_URL ?? '❌ Falta NEXT_PUBLIC_SITE_URL',
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-white mb-6">Debug Sistema</h1>

      <h2 className="text-sm font-semibold text-texto-secundario uppercase tracking-wider mb-3">Variables de entorno</h2>
      <div className="rounded-xl border border-neon/10 bg-superficie overflow-hidden mb-8">
        {Object.entries(checks).map(([key, value]) => (
          <div key={key} className="flex justify-between px-4 py-2.5 border-b border-neon/10 last:border-0">
            <span className="text-texto-secundario text-sm font-mono">{key}</span>
            <span className={`text-sm font-mono ${value.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>{value}</span>
          </div>
        ))}
      </div>

      <h2 className="text-sm font-semibold text-texto-secundario uppercase tracking-wider mb-3">Tablas Supabase</h2>
      <div className="rounded-xl border border-neon/10 bg-superficie overflow-hidden">
        {tableStatus.map(({ table, count, ok, error }) => (
          <div key={table} className="flex justify-between items-center px-4 py-2.5 border-b border-neon/10 last:border-0">
            <span className="text-texto-secundario text-sm font-mono">{table}</span>
            <div className="flex items-center gap-3">
              <span className="text-texto-terciario text-xs">{count} registros</span>
              <span className={`text-xs font-medium ${ok ? 'text-green-400' : 'text-red-400'}`}>
                {ok ? '✅ OK' : `❌ ${error}`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
