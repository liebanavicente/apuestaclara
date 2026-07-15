import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const hasNext = searchParams.has('next')
  const next = searchParams.get('next') ?? '/dashboard'
  // Callers that pass an explicit `next` (e.g. /porra's magic-link flow) have
  // their own inline error UI, so send failures back there instead of the
  // classic password login screen — which only confuses users who never had
  // a password to begin with.
  const failureRedirect = (message: string) =>
    hasNext ? `${origin}${next}?authError=1` : `${origin}/login?error=${encodeURIComponent(message)}`

  if (code) {
    const cookieStore = await cookies()
    const redirectUrl = `${origin}${next}`
    const response = NextResponse.redirect(redirectUrl)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return response
    }
    return NextResponse.redirect(failureRedirect(error.message))
  }

  return NextResponse.redirect(failureRedirect('no_code'))
}
