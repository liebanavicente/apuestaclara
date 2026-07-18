import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { hasSupabaseAdminConfig } from '@/lib/supabase/config'
import { supabaseAdminUnavailableResponse } from '@/lib/supabase/unavailable'
import { NextResponse } from 'next/server'
import { ADMIN_EMAIL } from '@/lib/utils'

export async function POST() {
  if (!hasSupabaseAdminConfig()) return supabaseAdminUnavailableResponse()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()

  const isAdmin = user.email === ADMIN_EMAIL

  await admin.from('profiles').upsert({
    user_id: user.id,
    email: user.email ?? '',
    plan: isAdmin ? 'premium' : 'free',
    role: isAdmin ? 'admin' : 'user',
    premium_forever: isAdmin,
  }, { onConflict: 'user_id' })

  return NextResponse.redirect(new URL('/admin/debug-auth', process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'))
}
