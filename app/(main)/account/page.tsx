import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getUserAccess } from '@/lib/access'
import { PlanBadge } from '@/components/shared/PlanBadge'
import { formatDate } from '@/lib/utils'
import { Settings, CreditCard, Gift, Share2, LogOut } from 'lucide-react'
import type { Profile, Subscriber } from '@/types/database'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [profileRes, subscriberRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('user_id', user.id).single(),
    supabase.from('subscribers').select('*').eq('user_id', user.id).maybeSingle(),
  ])

  const profile = profileRes.data as Profile | null
  const subscriber = subscriberRes.data as Subscriber | null

  if (!profile) redirect('/login')

  const access = getUserAccess(profile, subscriber)
  const planLabel = access.isAdmin ? 'admin' : access.isPremium ? 'premium' : 'free'

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="h-6 w-6 text-neon" />
        <h1 className="text-2xl font-bold text-white">Mi cuenta</h1>
      </div>

      {/* Profile */}
      <div className="rounded-xl border border-neon/10 bg-superficie/80 p-6 mb-4">
        <div className="flex items-center gap-4 mb-4">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-14 h-14 rounded-full" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-neon flex items-center justify-center text-xl font-bold text-white">
              {(profile.username ?? profile.email).charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-white font-semibold text-lg">@{profile.username ?? 'usuario'}</p>
            <p className="text-texto-secundario text-sm">{profile.email}</p>
          </div>
          <PlanBadge plan={planLabel} className="ml-auto" />
        </div>
      </div>

      {/* Subscription */}
      <div className="rounded-xl border border-neon/10 bg-superficie/80 p-6 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="h-4 w-4 text-neon" />
          <h2 className="text-white font-semibold">Suscripción</h2>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-texto-secundario">Plan</span>
            <PlanBadge plan={planLabel} />
          </div>
          {subscriber?.subscribed && (
            <>
              <div className="flex justify-between">
                <span className="text-texto-secundario">Estado</span>
                <span className="text-green-400">{subscriber.subscription_status}</span>
              </div>
              {subscriber.current_period_end && (
                <div className="flex justify-between">
                  <span className="text-texto-secundario">Próximo cargo</span>
                  <span className="text-texto-secundario">{formatDate(subscriber.current_period_end)}</span>
                </div>
              )}
            </>
          )}
          {profile.premium_until && !subscriber?.subscribed && (
            <div className="flex justify-between">
              <span className="text-texto-secundario">Premium hasta</span>
              <span className="text-neon">{formatDate(profile.premium_until)}</span>
            </div>
          )}
          {profile.premium_forever && (
            <div className="flex justify-between">
              <span className="text-texto-secundario">Premium forever</span>
              <span className="text-purple-300">Sí</span>
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-4">
          {!access.isPremium && (
            <Link href="/premium" className="text-sm bg-neon hover:brightness-110 text-carbon px-4 py-2 rounded-lg transition-colors">
              Activar Premium
            </Link>
          )}
          {subscriber?.subscribed && subscriber.stripe_customer_id && (
            <form action="/api/stripe/portal" method="POST">
              <button className="text-sm border border-slate-600 hover:border-slate-400 text-texto-secundario hover:text-white px-4 py-2 rounded-lg transition-colors">
                Gestionar suscripción
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Promo & referral */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Link href="/redeem" className="rounded-xl border border-neon/10 bg-superficie/80 hover:border-neon/30 p-5 transition-colors flex items-center gap-3">
          <Gift className="h-5 w-5 text-neon shrink-0" />
          <div>
            <p className="text-white font-medium text-sm">Canjear código</p>
            <p className="text-texto-terciario text-xs">Activa Premium con un código promo</p>
          </div>
        </Link>
        <Link href="/invita" className="rounded-xl border border-neon/10 bg-superficie/80 hover:border-neon/30 p-5 transition-colors flex items-center gap-3">
          <Share2 className="h-5 w-5 text-neon shrink-0" />
          <div>
            <p className="text-white font-medium text-sm">Invita y gana</p>
            <p className="text-texto-terciario text-xs">30 días Premium por cada referido</p>
          </div>
        </Link>
      </div>

      {/* Sign out */}
      <form action="/api/auth/signout" method="POST">
        <button className="w-full flex items-center justify-center gap-2 border border-red-500/30 text-red-400 hover:text-red-300 hover:border-red-400/50 py-2.5 rounded-lg transition-colors text-sm">
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </form>
    </div>
  )
}
