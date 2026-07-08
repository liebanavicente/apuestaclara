'use client'
import { useState, useEffect, useCallback } from 'react'
import { Plus, BarChart3, TrendingUp, TrendingDown, Target, Percent, LogIn } from 'lucide-react'
import Link from 'next/link'
import { WalletCard } from '@/components/simulator/WalletCard'
import { SimulationCard } from '@/components/simulator/SimulationCard'
import { NewSimulationModal } from '@/components/simulator/NewSimulationModal'

interface Wallet {
  balance: number
  starting_balance: number
  total_simulated_staked: number
  total_simulated_profit: number
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
  simulation_picks: any[]
}

export function SimuladorClient({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [simulations, setSimulations] = useState<Simulation[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [resetting, setResetting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'pending' | 'resolved' | 'stats'>('pending')

  const load = useCallback(async () => {
    if (!isLoggedIn) { setLoading(false); return }
    setLoading(true)
    try {
      const [walletRes, simsRes] = await Promise.all([
        fetch('/api/simulator/wallet'),
        fetch('/api/simulator/simulations?limit=50'),
      ])
      if (walletRes.ok) setWallet(await walletRes.json())
      if (simsRes.ok) {
        const d = await simsRes.json()
        setSimulations(d.simulations)
        setTotal(d.total)
      }
    } finally {
      setLoading(false)
    }
  }, [isLoggedIn])

  useEffect(() => { load() }, [load])

  async function handleReset() {
    if (!confirm('¿Reiniciar cartera a 1.000€? Perderás tu historial de saldo.')) return
    setResetting(true)
    const res = await fetch('/api/simulator/wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reset' }),
    })
    if (res.ok) setWallet(await res.json())
    setResetting(false)
  }

  // Stats
  const resolved = simulations.filter(s => s.status !== 'pending' && s.status !== 'cancelled')
  const won = resolved.filter(s => s.status === 'won').length
  const lost = resolved.filter(s => s.status === 'lost').length
  const winRate = resolved.length > 0 ? ((won / resolved.length) * 100).toFixed(0) : '—'
  const avgOdds = simulations.length > 0
    ? (simulations.reduce((a, s) => a + Number(s.total_odds), 0) / simulations.length).toFixed(2)
    : '—'

  const pending = simulations.filter(s => s.status === 'pending')
  const resolvedList = simulations.filter(s => s.status !== 'pending')

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: wallet + stats */}
      <div className="space-y-4">
        {wallet ? (
          <WalletCard wallet={wallet} onReset={handleReset} resetting={resetting} />
        ) : (
          <div className="rounded-xl border border-superficie-hover bg-superficie/50 p-5 animate-pulse h-40" />
        )}

        {/* Quick stats */}
        <div className="rounded-xl border border-superficie-hover bg-superficie/50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="h-4 w-4 text-teal-400" />
            <span className="text-sm font-semibold text-white">Estadísticas</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Total sims.', value: total.toString(), icon: Target, color: 'text-texto-secundario' },
              { label: '% acierto', value: `${winRate}%`, icon: Percent, color: won > lost ? 'text-green-400' : 'text-red-400' },
              { label: 'Ganadas', value: won.toString(), icon: TrendingUp, color: 'text-green-400' },
              { label: 'Perdidas', value: lost.toString(), icon: TrendingDown, color: 'text-red-400' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-superficie-hover/40 rounded-lg p-2.5">
                <div className="flex items-center gap-1 mb-1">
                  <Icon className={`h-3 w-3 ${color}`} />
                  <span className="text-xs text-texto-secundario">{label}</span>
                </div>
                <p className={`text-lg font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>
          {simulations.length > 0 && (
            <div className="mt-3 pt-3 border-t border-superficie-hover">
              <p className="text-xs text-texto-secundario">Cuota media</p>
              <p className="text-sm font-semibold text-texto-secundario">{avgOdds}</p>
            </div>
          )}
        </div>

        {isLoggedIn ? (
          <button
            onClick={() => setShowModal(true)}
            disabled={!wallet}
            className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nueva simulación
          </button>
        ) : (
          <Link
            href="/register"
            className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            <LogIn className="h-4 w-4" />
            Crear cuenta para simular
          </Link>
        )}

        <p className="text-xs text-texto-terciario text-center">
          Dinero ficticio. Simular no garantiza resultados reales.
        </p>
      </div>

      {/* Right: simulations list */}
      <div className="lg:col-span-2">
        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-superficie/50 rounded-xl p-1 border border-superficie-hover">
          {([
            { id: 'pending', label: `Pendientes (${pending.length})` },
            { id: 'resolved', label: `Resueltas (${resolvedList.length})` },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 text-sm py-2 rounded-lg transition-colors ${
                activeTab === tab.id ? 'bg-teal-600 text-white' : 'text-texto-secundario hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-xl border border-superficie-hover h-16 animate-pulse bg-superficie/40" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {activeTab === 'pending' && (
              pending.length === 0 ? (
                <div className="rounded-xl border border-superficie-hover bg-superficie/30 p-12 text-center">
                  <Target className="h-10 w-10 text-texto-terciario mx-auto mb-3" />
                  <p className="text-texto-secundario font-medium">Sin simulaciones pendientes</p>
                  <p className="text-texto-terciario text-sm mt-1">Pulsa "Nueva simulación" para empezar.</p>
                </div>
              ) : (
                pending.map(sim => (
                  <SimulationCard key={sim.id} simulation={sim} onResolved={load} />
                ))
              )
            )}
            {activeTab === 'resolved' && (
              resolvedList.length === 0 ? (
                <div className="rounded-xl border border-superficie-hover bg-superficie/30 p-12 text-center">
                  <p className="text-texto-secundario">Aún no has resuelto ninguna simulación.</p>
                </div>
              ) : (
                resolvedList.map(sim => (
                  <SimulationCard key={sim.id} simulation={sim} onResolved={load} />
                ))
              )
            )}
          </div>
        )}
      </div>

      {showModal && wallet && (
        <NewSimulationModal
          balance={wallet.balance}
          onClose={() => setShowModal(false)}
          onCreated={() => { setShowModal(false); load() }}
        />
      )}
    </div>
  )
}
