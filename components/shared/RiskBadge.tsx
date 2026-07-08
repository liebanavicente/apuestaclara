import { cn } from '@/lib/utils'

interface RiskBadgeProps {
  level: 'bajo' | 'medio' | 'alto' | string
  className?: string
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        level === 'bajo' && 'bg-green-500/20 text-green-300 border border-green-500/30',
        level === 'medio' && 'bg-ambar/20 text-ambar border border-ambar/30',
        level === 'alto' && 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
        className
      )}
    >
      Riesgo {level}
    </span>
  )
}
