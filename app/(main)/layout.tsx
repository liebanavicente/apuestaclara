import { HeaderWrapper } from '@/components/layout/HeaderWrapper'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  let isAdmin = false

  if (user) {
    const admin = createAdminClient()
    const { data } = await admin.from('profiles').select('*').eq('user_id', user.id).single()
    profile = data
    isAdmin = data?.role === 'admin'
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#07080F] text-white relative">
      <div className="gb-mesh" aria-hidden="true" />
      <div className="relative z-10 flex flex-col flex-1">
        <HeaderWrapper profile={profile} access={isAdmin ? { isAdmin: true, isPremium: true } as any : null} />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}
