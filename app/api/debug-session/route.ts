import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  let profileAnon = null
  let profileAdmin = null
  let profileError = null

  if (user) {
    const anonRes = await supabase.from('profiles').select('*').eq('user_id', user.id).single()
    profileAnon = anonRes.data
    if (anonRes.error) profileError = anonRes.error.message

    const admin = createAdminClient()
    const adminRes = await admin.from('profiles').select('*').eq('user_id', user.id).single()
    profileAdmin = adminRes.data
  }

  return NextResponse.json({
    user: user ? { id: user.id, email: user.email } : null,
    authError: authError?.message,
    profileAnon,
    profileAdmin,
    profileError,
  })
}
