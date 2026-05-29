import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()
  const supabaseCookies = allCookies.filter(c => c.name.includes('supabase') || c.name.includes('sb-'))

  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  return NextResponse.json({
    user: user ? { id: user.id, email: user.email } : null,
    error: error?.message,
    cookieCount: allCookies.length,
    supabaseCookies: supabaseCookies.map(c => ({
      name: c.name,
      valueLength: c.value.length,
      valueStart: c.value.substring(0, 20),
    })),
  })
}
