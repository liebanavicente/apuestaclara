import { HeaderWrapper } from '@/components/layout/HeaderWrapper'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { hasSupabaseAdminConfig, hasSupabasePublicConfig } from '@/lib/supabase/config'
import { getUserAccess } from '@/lib/access'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = hasSupabasePublicConfig() ? await createClient() : null
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } }

  let profile = null

  if (user && hasSupabaseAdminConfig()) {
    const admin = createAdminClient()
    const { data } = await admin.from('profiles').select('*').eq('user_id', user.id).single()
    profile = data
  }

  const access = getUserAccess(profile, null)

  return (
    <div className="min-h-screen flex flex-col bg-carbon text-white">
      <HeaderWrapper profile={profile} access={access} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
