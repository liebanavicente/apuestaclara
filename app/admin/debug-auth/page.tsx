import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DebugAuthPage() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const profileRes = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()
  const profile = profileRes.data as { role: string; plan: string; premium_forever: boolean; premium_until: string | null } | null
  const profileError = profileRes.error

  if (profile?.role !== 'admin') redirect('/')

  const subRes = await supabase
    .from('subscribers')
    .select('id, stripe_customer_id, subscribed, subscription_status')
    .eq('user_id', user.id)
    .maybeSingle()
  const subscriber = subRes.data as { stripe_customer_id: string | null; subscribed: boolean; subscription_status: string | null } | null

  const info = {
    'Sesión existe': user ? 'Sí' : 'No',
    'user_id': user.id,
    'email': user.email,
    'provider': user.app_metadata?.provider,
    'profile existe': profile ? 'Sí' : 'No',
    'role': profile?.role,
    'plan': profile?.plan,
    'premium_forever': String(profile?.premium_forever),
    'subscriber existe': subscriber ? 'Sí' : 'No',
    'stripe_customer_id existe': subscriber?.stripe_customer_id ? 'Sí' : 'No',
    'subscribed': String(subscriber?.subscribed),
    'subscription_status': subscriber?.subscription_status ?? 'N/A',
    'último error auth': authError?.message ?? 'Ninguno',
    'error profile': profileError?.message ?? 'Ninguno',
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-white mb-6">Debug Auth</h1>
      <div className="rounded-xl border border-superficie-hover bg-superficie overflow-hidden mb-6">
        {Object.entries(info).map(([key, value]) => (
          <div key={key} className="flex justify-between px-4 py-2.5 border-b border-superficie-hover last:border-0">
            <span className="text-texto-secundario text-sm font-mono">{key}</span>
            <span className="text-texto text-sm font-mono">{String(value)}</span>
          </div>
        ))}
      </div>
      <form action="/api/admin/repair-profile" method="POST">
        <button className="bg-teal-600 hover:bg-teal-500 text-white font-medium px-5 py-2 rounded-lg transition-colors">
          Reparar mi perfil
        </button>
      </form>
    </div>
  )
}
