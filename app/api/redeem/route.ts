import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Debes estar autenticado para canjear un código' }, { status: 401 })

  const { code } = await request.json()
  if (!code || typeof code !== 'string') return NextResponse.json({ error: 'Código inválido' }, { status: 400 })

  const admin = createAdminClient()

  // Fetch promo code
  const { data: promoCode, error: codeError } = await admin
    .from('promo_codes')
    .select('*')
    .eq('code', code.trim().toUpperCase())
    .eq('active', true)
    .single()

  if (codeError || !promoCode) {
    return NextResponse.json({ error: 'Código no válido o expirado' }, { status: 400 })
  }

  // Check expiry
  if (promoCode.expires_at && new Date(promoCode.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Este código ha expirado' }, { status: 400 })
  }

  // Check redemption limit
  if (promoCode.redemptions_count >= promoCode.max_redemptions) {
    return NextResponse.json({ error: 'Este código ya no tiene redenciones disponibles' }, { status: 400 })
  }

  // Check if user already redeemed this code
  const { data: existing } = await admin
    .from('promo_redemptions')
    .select('id')
    .eq('user_id', user.id)
    .eq('promo_code_id', promoCode.id)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'Ya has canjeado este código anteriormente' }, { status: 400 })
  }

  // Calculate premium_until
  const premiumUntil = new Date()
  premiumUntil.setDate(premiumUntil.getDate() + promoCode.duration_days)

  // Insert redemption
  await admin.from('promo_redemptions').insert({
    user_id: user.id,
    promo_code_id: promoCode.id,
    premium_until: premiumUntil.toISOString(),
  })

  // Increment redemption count
  await admin.from('promo_codes').update({
    redemptions_count: promoCode.redemptions_count + 1,
  }).eq('id', promoCode.id)

  // Update profile premium_until
  const { data: profile } = await admin.from('profiles').select('premium_until').eq('user_id', user.id).single()
  const existingUntil = profile?.premium_until ? new Date(profile.premium_until) : new Date()
  const newUntil = existingUntil > new Date() ? existingUntil : new Date()
  newUntil.setDate(newUntil.getDate() + promoCode.duration_days)

  await admin.from('profiles').update({
    plan: 'premium',
    premium_until: newUntil.toISOString(),
  }).eq('user_id', user.id)

  return NextResponse.json({ success: true, premium_until: newUntil.toISOString() })
}
