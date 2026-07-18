import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { getMissingSupabaseAdminConfig } from './config'

// Untyped admin client for server-side operations — types checked at runtime via RLS bypass
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AdminClient = SupabaseClient<any>

export function createAdminClient(): AdminClient {
  const missing = getMissingSupabaseAdminConfig()
  if (missing.length > 0) {
    throw new Error(`Supabase admin config missing: ${missing.join(', ')}`)
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
