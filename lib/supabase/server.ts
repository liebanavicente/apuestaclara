import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // When Supabase isn't configured, return a minimal stub so pages can render.
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      auth: {
        async getUser() {
          return { data: { user: null }, error: null }
        },
      },
    } as unknown as ReturnType<typeof createServerClient>
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server component — cookies are read-only in RSC, ignore
          }
        },
      },
    }
  )
}
