import { createBrowserClient } from '@supabase/ssr'
import { getMissingSupabasePublicConfig } from './config'

export function createClient() {
  const missing = getMissingSupabasePublicConfig()
  if (missing.length > 0) {
    throw new Error(`Supabase public config missing: ${missing.join(', ')}`)
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
