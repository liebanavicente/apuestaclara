import { cn } from '@/lib/utils'

export function RealDataBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-ink/15 text-amber-600 border border-amber-500/25',
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
      Datos reales
    </span>
  )
}
