import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  const admin = createAdminClient()

  async function syncSubscription(sub: Stripe.Subscription) {
    const userId = sub.metadata?.user_id ?? (sub.customer as string)
    const customerId = sub.customer as string
    const firstItem = sub.items.data[0]

    // Stripe v22+: current_period is on the subscription item
    const periodStart = firstItem?.current_period_start
    const periodEnd = firstItem?.current_period_end

    await admin.from('subscribers').upsert({
      user_id: userId,
      email: '',
      stripe_customer_id: customerId,
      stripe_subscription_id: sub.id,
      subscribed: sub.status === 'active',
      subscription_status: sub.status,
      price_id: firstItem?.price.id,
      current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      cancel_at_period_end: sub.cancel_at_period_end,
    }, { onConflict: 'user_id' })

    // Update profile plan
    if (sub.status === 'active') {
      await admin.from('profiles').update({ plan: 'premium', premium_until: null })
        .eq('user_id', userId)
    } else if (['canceled', 'unpaid', 'past_due'].includes(sub.status)) {
      await admin.from('profiles').update({ plan: 'free' }).eq('user_id', userId)
    }
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      await syncSubscription(event.data.object as Stripe.Subscription)
      break

    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.mode === 'subscription' && session.subscription) {
        const sub = await stripe.subscriptions.retrieve(session.subscription as string)
        await syncSubscription(sub)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
