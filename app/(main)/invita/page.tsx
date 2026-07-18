import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Share2, Trophy } from 'lucide-react'
import { InvitaClient } from './InvitaClient'

export default async function InvitaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/invita')

  const admin = createAdminClient()

  // Get or create referral link
  const linkRes = await admin
    .from('referral_links')
    .select('referral_code')
    .eq('user_id', user.id)
    .maybeSingle()

  let referralCode: string | null = linkRes.data?.referral_code ?? null

  if (!referralCode) {
    const code = `${user.id.slice(0, 8).toUpperCase()}`
    await admin.from('referral_links').insert({ user_id: user.id, referral_code: code })
    referralCode = code
  }

  // Campaign stats
  const campaignRes = await admin
    .from('referral_campaigns')
    .select('max_rewards, rewards_given')
    .eq('slug', 'embajadores-lanzamiento')
    .single()
  const campaign = campaignRes.data as { max_rewards: number; rewards_given: number } | null

  // User's validated referrals
  const referralsRes = await admin
    .from('referrals')
    .select('*', { count: 'exact', head: true })
    .eq('referrer_user_id', user.id)
    .eq('status', 'validated')
  const myReferrals: number = referralsRes.count ?? 0

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const referralUrl = `${siteUrl}/register?ref=${referralCode ?? ''}`
  const remaining = campaign ? campaign.max_rewards - campaign.rewards_given : 100

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
      <div className="flex items-center gap-3 mb-6">
        <Share2 className="h-6 w-6 text-neon" />
        <h1 className="text-2xl font-bold text-white">Invita y gana Premium</h1>
      </div>

      <div className="rounded-xl border border-neon/30 bg-neon/10 p-5 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="h-4 w-4 text-neon" />
          <p className="text-neon font-semibold">Primeros 100 Embajadores</p>
        </div>
        <p className="text-texto-secundario text-sm leading-relaxed">
          Comparte tu enlace personal. Por cada usuario que se registre con tu enlace,
          recibes 30 días de Premium gratis (mientras queden plazas disponibles).
        </p>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-2xl font-black text-white">{Math.max(0, remaining)}</span>
          <span className="text-texto-secundario text-sm">plazas restantes de 100</span>
        </div>
      </div>

      <InvitaClient referralUrl={referralUrl} myReferrals={myReferrals ?? 0} />
    </div>
  )
}
