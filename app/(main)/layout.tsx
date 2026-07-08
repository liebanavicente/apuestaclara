import { HeaderWrapper } from '@/components/layout/HeaderWrapper'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null

  if (user) {
    const admin = createAdminClient()
    const { data } = await admin.from('profiles').select('*').eq('user_id', user.id).single()
    profile = data
  }

  return (
    <div className="min-h-screen flex flex-col bg-carbon text-white">
      <HeaderWrapper profile={profile} access={null} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
