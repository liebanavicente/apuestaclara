import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login?redirect=/premium', process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'))
  }

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PREMIUM_PRICE_ID) {
    return NextResponse.json({ error: 'Stripe no está configurado' }, { status: 500 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  try {
    // Get or create Stripe customer
    const { data: subscriber } = await supabase
      .from('subscribers')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle()

    let customerId = subscriber?.stripe_customer_id
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id },
      })
      customerId = customer.id
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: process.env.STRIPE_PREMIUM_PRICE_ID, quantity: 1 }],
      mode: 'subscription',
      success_url: `${siteUrl}/dashboard?premium=success`,
      cancel_url: `${siteUrl}/premium?cancelled=true`,
      metadata: { user_id: user.id },
    })

    return NextResponse.redirect(session.url!)
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'No se ha podido iniciar el pago. Inténtalo de nuevo.' }, { status: 500 })
  }
}
