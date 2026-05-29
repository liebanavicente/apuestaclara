import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Untyped admin client for server-side operations — types checked at runtime via RLS bypass
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AdminClient = SupabaseClient<any>

export function createAdminClient(): AdminClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
