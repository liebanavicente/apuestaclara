import { EmptyState } from '@/components/shared/EmptyState'
import type { UserRankingStats } from '@/types/ranking'

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-superficie-hover bg-carbon/40 px-3 py-2.5 text-center">
      <div className="text-lg font-black text-white">{value}</div>
      <div className="mt-0.5 text-[11px] text-texto-secundario">{label}</div>
    </div>
  )
}

export function UserStatsPanel({ stats }: { stats: UserRankingStats }) {
  const { totalResolved, totalWon, totalLost, winRate, currentStreak, bestStreak, form } = stats

  if (totalResolved === 0) {
    return (
      <EmptyState
        className="py-6"
        icon={<span className="text-3xl">📊</span>}
        title="Sin picks resueltos todavía"
        description="En cuanto se resuelva algún pick de este usuario, aquí aparecerán sus estadísticas."
      />
    )
  }

  const wonPct = totalResolved > 0 ? (totalWon / totalResolved) * 100 : 0
  const lostPct = 100 - wonPct

  return (
    <div className="space-y-4">
      {/* Stat tiles */}
      <div className="grid grid-cols-3 gap-2">
        <StatTile label="Predicciones" value={String(totalResolved)} />
        <StatTile label="Racha actual" value={currentStreak > 0 ? `🔥 ${currentStreak}` : '0'} />
        <StatTile label="Mejor racha" value={String(bestStreak)} />
      </div>

      {/* Win rate meter */}
      <div>
        <div className="mb-1.5 flex items-baseline justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-texto-secundario">% de acierto</span>
          <span className="text-sm font-black text-white">{winRate}%</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-superficie-hover">
          <div
            className="h-full rounded-full bg-ambar transition-[width] duration-500"
            style={{ width: `${winRate ?? 0}%` }}
            role="img"
            aria-label={`${winRate}% de acierto`}
          />
        </div>
      </div>

      {/* Won vs lost segmented bar */}
      <div>
        <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-texto-secundario">
          Aciertos vs fallos
        </div>
        <div className="flex h-3 w-full gap-0.5 overflow-hidden rounded-full">
          {totalWon > 0 && (
            <div className="h-full rounded-full bg-ambar" style={{ width: `${wonPct}%` }} />
          )}
          {totalLost > 0 && (
            <div className="h-full rounded-full bg-error" style={{ width: `${lostPct}%` }} />
          )}
        </div>
        <div className="mt-1.5 flex gap-4 text-xs text-texto-secundario">
          <span><span className="text-ambar">●</span> {totalWon} acierto{totalWon === 1 ? '' : 's'}</span>
          <span><span className="text-error">●</span> {totalLost} fallo{totalLost === 1 ? '' : 's'}</span>
        </div>
      </div>

      {/* Recent form */}
      <div>
        <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-texto-secundario">
          Forma reciente
        </div>
        <div className="flex items-center gap-1.5">
          {form.map((f, i) => (
            <div
              key={i}
              title={f.status === 'won' ? 'Acierto' : 'Fallo'}
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold text-[#0B1E3F] ${
                f.status === 'won' ? 'bg-ambar' : 'bg-error'
              }`}
            >
              {f.status === 'won' ? '✓' : '✗'}
            </div>
          ))}
          {form.length === 0 && <span className="text-xs text-texto-terciario">Sin histórico suficiente</span>}
        </div>
      </div>
    </div>
  )
}
