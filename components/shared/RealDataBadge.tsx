import { cn } from '@/lib/utils'

export function RealDataBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-neon/10 text-neon border border-neon/25',
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" />
      Datos reales
    </span>
  )
}
