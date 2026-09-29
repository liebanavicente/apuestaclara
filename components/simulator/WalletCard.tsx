'use client'
import { Coins, RotateCcw, TrendingUp, TrendingDown } from 'lucide-react'

interface Wallet {
  balance: number
  starting_balance: number
  total_simulated_staked: number
  total_simulated_profit: number
}

interface Props {
  wallet: Wallet
  onReset: () => void
  resetting: boolean
}

export function WalletCard({ wallet, onReset, resetting }: Props) {
  const roi = wallet.total_simulated_staked > 0
    ? ((wallet.total_simulated_profit / wallet.total_simulated_staked) * 100).toFixed(1)
    : '0.0'
  const profitPositive = wallet.total_simulated_profit >= 0

  return (
    <div className="rounded-xl gb-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-amber-600" />
          <span className="font-semibold text-ink">Cartera virtual</span>
        </div>
        <button
          onClick={onReset}
          disabled={resetting}
          className="flex items-center gap-1.5 text-xs text-ink-3 hover:text-orange-600 transition-colors disabled:opacity-40"
          title="Reiniciar a 1.000€"
        >
          <RotateCcw className={`h-3.5 w-3.5 ${resetting ? 'animate-spin' : ''}`} />
          Reiniciar
        </button>
      </div>

      <div className="mb-4">
        <p className="text-xs text-ink-3 mb-0.5">Saldo disponible</p>
        <p className="text-3xl font-black text-ink">{wallet.balance.toFixed(2)}<span className="text-lg text-ink-2 font-normal ml-1">€</span></p>
        <p className="text-xs text-ink-3 mt-0.5">Empezaste con {wallet.starting_balance.toFixed(0)}€</p>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-black/[0.06]">
        <div>
          <p className="text-xs text-ink-3 mb-0.5">Apostado</p>
          <p className="text-sm font-semibold text-ink-2">{wallet.total_simulated_staked.toFixed(2)}€</p>
        </div>
        <div>
          <p className="text-xs text-ink-3 mb-0.5">Beneficio</p>
          <p className={`text-sm font-semibold flex items-center gap-0.5 ${profitPositive ? 'text-green-600' : 'text-red-600'}`}>
            {profitPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {profitPositive ? '+' : ''}{wallet.total_simulated_profit.toFixed(2)}€
          </p>
        </div>
        <div>
          <p className="text-xs text-ink-3 mb-0.5">ROI</p>
          <p className={`text-sm font-semibold ${profitPositive ? 'text-green-600' : 'text-red-600'}`}>
            {profitPositive ? '+' : ''}{roi}%
          </p>
        </div>
      </div>
    </div>
  )
}
