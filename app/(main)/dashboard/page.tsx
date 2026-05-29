import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getUserAccess } from '@/lib/access'
import { PlanBadge } from '@/components/shared/PlanBadge'
import { formatDate } from '@/lib/utils'
import { TrendingUp, Search, Play, Users, Star, BarChart3, Wallet } from 'lucide-react'
import type { Profile, Subscriber } from '@/types/database'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [profileRes, subscriberRes, walletRes, lastSimRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('user_id', user.id).single(),
    supabase.from('subscribers').select('*').eq('user_id', user.id).maybeSingle(),
    supabase.from('virtual_wallets').select('*').eq('user_id', user.id).maybeSingle(),
    supabase.from('simulations').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
  ])

  const profile = profileRes.data as Profile | null
  const subscriber = subscriberRes.data as Subscriber | null
  const wallet = walletRes.data as { balance: number; starting_balance: number } | null
  const lastSim = lastSimRes.data as { status: string; created_at: string } | null

  if (!profile) redirect('/login')

  const access = getUserAccess(profile, subscriber)
  const planLabel = access.isAdmin ? 'admin' : access.isPremium ? 'premium' : 'free'

  const generationsLeft = access.limits.maxDailyGenerations - (profile.daily_generations_used ?? 0)

  const quickLinks = [
    { href: '/generador', icon: TrendingUp, label: 'Crear combinada', color: 'teal' },
    { href: '/buscar-eventos', icon: Search, label: 'Buscar eventos', color: 'blue' },
    { href: '/simulador/nueva', icon: Play, label: 'Simular', color: 'green' },
    { href: '/comunidad', icon: Users, label: 'Comunidad', color: 'purple' },
    { href: '/premium', icon: Star, label: 'Premium', color: 'yellow' },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-white">
            Hola, {profile.username ?? profile.email.split('@')[0]}
          </h1>
          <PlanBadge plan={planLabel} />
        </div>
        <p className="text-slate-400 text-sm">Aquí tienes un resumen de tu actividad</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Plan actual',
            value: planLabel.charAt(0).toUpperCase() + planLabel.slice(1),
            icon: Star,
            sub: access.isPremium && profile.premium_until
              ? `Hasta ${formatDate(profile.premium_until)}`
              : access.isPremium ? 'Activo' : 'Gratis',
          },
          {
            label: 'Generaciones hoy',
            value: `${Math.max(0, generationsLeft)} restantes`,
            icon: TrendingUp,
            sub: `de ${access.limits.maxDailyGenerations} diarias`,
          },
          {
            label: 'Saldo simulador',
            value: wallet ? `${wallet.balance.toFixed(0)} 🪙` : '1.000 🪙',
            icon: Wallet,
            sub: 'monedas ficticias',
          },
          {
            label: 'Última simulación',
            value: lastSim ? lastSim.status : 'Ninguna',
            icon: BarChart3,
            sub: lastSim ? formatDate(lastSim.created_at) : 'Crea tu primera',
          },
        ].map(({ label, value, icon: Icon, sub }) => (
          <div key={label} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-4 w-4 text-teal-400" />
              <p className="text-xs text-slate-500">{label}</p>
            </div>
            <p className="text-lg font-bold text-white">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Accesos rápidos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {quickLinks.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/60 hover:border-teal-500/30 p-4 transition-all group"
            >
              <Icon className="h-6 w-6 text-teal-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs text-slate-300 text-center">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Premium upsell */}
      {!access.isPremium && (
        <div className="rounded-xl border border-teal-500/30 bg-teal-950/30 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-teal-300 font-semibold mb-1">Pasa a Premium — 4,99 €/mes</p>
            <p className="text-slate-400 text-sm">20 generaciones diarias, hasta 6 picks, análisis avanzado y más. Sin permanencia.</p>
            <p className="text-xs text-orange-400/80 mt-1">Premium no garantiza beneficios ni aumenta tus probabilidades reales.</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href="/redeem" className="text-sm text-teal-400 hover:text-teal-300 border border-teal-500/30 px-3 py-1.5 rounded-lg transition-colors">
              Código promo
            </Link>
            <Link href="/premium" className="text-sm bg-teal-600 hover:bg-teal-500 text-white px-4 py-1.5 rounded-lg transition-colors">
              Ver Premium
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
