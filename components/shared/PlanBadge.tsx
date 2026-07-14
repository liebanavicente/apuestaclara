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
        plan === 'admin' && 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
        plan === 'premium' && 'bg-teal-500/20 text-teal-300 border border-teal-500/30',
        plan === 'free' && 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
        className
      )}
    >
      {plan === 'admin' ? 'Admin' : plan === 'premium' ? 'Premium' : 'Free'}
    </span>
  )
}
