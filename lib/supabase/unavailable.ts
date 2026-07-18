import { NextResponse } from 'next/server'
import { getMissingSupabaseAdminConfig, getMissingSupabasePublicConfig } from './config'

export function supabasePublicUnavailableResponse() {
  return NextResponse.json(
    {
      error: 'Supabase no está configurado',
      missing: getMissingSupabasePublicConfig(),
    },
    { status: 503 }
  )
}

export function supabaseAdminUnavailableResponse() {
  return NextResponse.json(
    {
      error: 'Supabase admin no está configurado',
      missing: getMissingSupabaseAdminConfig(),
    },
    { status: 503 }
  )
}
