import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'))
  if (!process.env.STRIPE_SECRET_KEY) return NextResponse.json({ error: 'Stripe no configurado' }, { status: 500 })

  const { data: subscriber } = await supabase
    .from('subscribers')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!subscriber?.stripe_customer_id) {
    return NextResponse.redirect(new URL('/premium', process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'))
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  const session = await stripe.billingPortal.sessions.create({
    customer: subscriber.stripe_customer_id,
    return_url: `${siteUrl}/account`,
  })

  return NextResponse.redirect(session.url)
}
