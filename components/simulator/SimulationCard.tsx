'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp, CheckCircle, XCircle, Clock, Ban, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

const STATUS_CONFIG = {
  pending: { label: 'Pendiente', icon: Clock, color: 'text-ambar', bg: 'bg-ambar/10 border-ambar/20' },
  won:     { label: 'Ganada', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  lost:    { label: 'Perdida', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  void:    { label: 'Anulada', icon: Ban, color: 'text-texto-secundario', bg: 'bg-texto-terciario/10 border-superficie-hover/20' },
  cancelled: { label: 'Cancelada', icon: Ban, color: 'text-texto-secundario', bg: 'bg-texto-terciario/10 border-superficie-hover/20' },
}

interface SimPick {
  id: string
  event_name: string
  selection: string
  odds: number
  league_name: string | null
  commence_time: string
}

interface Simulation {
  id: string
  simulation_type: string
  status: 'pending' | 'won' | 'lost' | 'void' | 'cancelled'
  total_odds: number
  virtual_stake: number
  potential_virtual_return: number
  potential_virtual_profit: number
  created_at: string
  resolved_at: string | null
  simulation_picks: SimPick[]
}

interface Props {
  simulation: Simulation
  onResolved: () => void
}

export function SimulationCard({ simulation, onResolved }: Props) {
  const [open, setOpen] = useState(false)
  const [resolving, setResolving] = useState(false)
  const cfg = STATUS_CONFIG[simulation.status]
  const Icon = cfg.icon

  async function resolve(status: 'won' | 'lost' | 'void') {
    setResolving(true)
    try {
      await fetch(`/api/simulator/simulations/${simulation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      onResolved()
    } finally {
      setResolving(false)
    }
  }

  return (
    <div className="rounded-xl border border-superficie-hover bg-superficie/40 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-superficie-hover/30 transition-colors"
      >
        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} shrink-0`}>
          <Icon className="h-3 w-3" />
          {cfg.label}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white font-medium">
            {simulation.simulation_type === 'combinada' ? '⛓ Combinada' : '🎯 Simple'} · @{Number(simulation.total_odds).toFixed(2)}
          </p>
          <p className="text-xs text-texto-secundario">
            {Number(simulation.virtual_stake).toFixed(2)}€ →{' '}
            <span className="text-teal-400">{Number(simulation.potential_virtual_return).toFixed(2)}€</span>
            {' · '}{formatDistanceToNow(new Date(simulation.created_at), { addSuffix: true, locale: es })}
          </p>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-texto-secundario shrink-0" /> : <ChevronDown className="h-4 w-4 text-texto-secundario shrink-0" />}
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-superficie-hover pt-3 space-y-3">
          <div className="space-y-1.5">
            {simulation.simulation_picks.map(pick => (
              <div key={pick.id} className="flex items-center justify-between text-xs bg-superficie-hover/40 rounded-lg px-3 py-2">
                <div className="min-w-0">
                  <p className="text-white truncate">{pick.event_name}</p>
                  <p className="text-texto-secundario">{pick.league_name} · {pick.selection}</p>
                </div>
                <span className="text-texto-secundario font-semibold ml-2 shrink-0">@{Number(pick.odds).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {simulation.status === 'pending' && (
            <div>
              <p className="text-xs text-texto-secundario mb-2">¿Cómo quedó?</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => resolve('won')}
                  disabled={resolving}
                  className="flex items-center justify-center gap-1 text-xs py-2 rounded-lg bg-green-600/20 border border-green-500/30 text-green-400 hover:bg-green-600/40 transition-colors disabled:opacity-40"
                >
                  {resolving ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                  Ganada
                </button>
                <button
                  onClick={() => resolve('lost')}
                  disabled={resolving}
                  className="flex items-center justify-center gap-1 text-xs py-2 rounded-lg bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/40 transition-colors disabled:opacity-40"
                >
                  {resolving ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />}
                  Perdida
                </button>
                <button
                  onClick={() => resolve('void')}
                  disabled={resolving}
                  className="flex items-center justify-center gap-1 text-xs py-2 rounded-lg bg-superficie-hover/50 border border-superficie-hover/30 text-texto-secundario hover:bg-superficie-hover transition-colors disabled:opacity-40"
                >
                  <Ban className="h-3 w-3" />
                  Anular
                </button>
              </div>
            </div>
          )}

          {simulation.status === 'won' && (
            <p className="text-xs text-green-400 font-semibold">
              +{Number(simulation.potential_virtual_profit).toFixed(2)}€ añadidos a tu cartera
            </p>
          )}
          {simulation.status === 'lost' && (
            <p className="text-xs text-red-400 font-semibold">
              -{Number(simulation.virtual_stake).toFixed(2)}€ perdidos
            </p>
          )}
        </div>
      )}
    </div>
  )
}
