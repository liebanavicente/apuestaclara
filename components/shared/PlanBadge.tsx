'use client'
import { cn } from '@/lib/utils'

interface PlanBadgeProps {
  plan: 'free' | 'premium' | 'admin'
  className?: string
}

export function PlanBadge({ plan, className }: PlanBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        plan === 'admin' && 'bg-purple-500/20 text-purple-700 border border-purple-500/30',
        plan === 'premium' && 'bg-ink/20 text-amber-700 border border-amber-500/30',
        plan === 'free' && 'bg-slate-500/20 text-ink-2 border border-black/[0.18]',
        className
      )}
    >
      {plan === 'admin' ? 'Admin' : plan === 'premium' ? 'Premium' : 'Free'}
    </span>
  )
}
