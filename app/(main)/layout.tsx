import { HeaderWrapper } from '@/components/layout/HeaderWrapper'
import { Footer } from '@/components/layout/Footer'
import { PromoBanner } from '@/components/layout/PromoBanner'
import { createClient } from '@/lib/supabase/server'
import { getUserAccess } from '@/lib/access'
import type { Subscriber } from '@/types/database'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  let subscriber: Subscriber | null = null
  let access = null

  if (user) {
    const [profileRes, subscriberRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', user.id).single(),
      supabase.from('subscribers').select('*').eq('user_id', user.id).single(),
    ])
    profile = profileRes.data
    subscriber = subscriberRes.data
    access = getUserAccess(profile, subscriber)
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <PromoBanner isPremium={access?.isPremium} />
      <HeaderWrapper profile={profile} access={access} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
