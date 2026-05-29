import { cn } from '@/lib/utils'

export function RealDataBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-teal-500/15 text-teal-400 border border-teal-500/25',
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
      Datos reales
    </span>
  )
}
