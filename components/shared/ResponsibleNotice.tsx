import { cn } from '@/lib/utils'

interface ResponsibleNoticeProps {
  variant?: 'default' | 'compact'
  className?: string
}

export function ResponsibleNotice({ variant = 'default', className }: ResponsibleNoticeProps) {
  if (variant === 'compact') {
    return (
      <p className={cn('text-xs text-orange-400/80 text-center', className)}>
        Las predicciones son orientativas y pueden fallar. Apostar implica riesgo. +18
      </p>
    )
  }

  return (
    <div className={cn('rounded-lg border border-orange-500/30 bg-orange-500/10 p-4', className)}>
      <p className="text-sm text-orange-300 font-medium mb-1">Aviso importante</p>
      <p className="text-xs text-orange-200/80 leading-relaxed">
        Las predicciones son orientativas y pueden fallar. Apostar implica riesgo de pérdida económica.
        Esta herramienta no garantiza beneficios ni aciertos. Solo mayores de 18 años.
      </p>
    </div>
  )
}
