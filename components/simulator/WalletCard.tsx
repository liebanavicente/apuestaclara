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
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-teal-400" />
          <span className="font-semibold text-white">Cartera virtual</span>
        </div>
        <button
          onClick={onReset}
          disabled={resetting}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-orange-400 transition-colors disabled:opacity-40"
          title="Reiniciar a 1.000€"
        >
          <RotateCcw className={`h-3.5 w-3.5 ${resetting ? 'animate-spin' : ''}`} />
          Reiniciar
        </button>
      </div>

      <div className="mb-4">
        <p className="text-xs text-slate-500 mb-0.5">Saldo disponible</p>
        <p className="text-3xl font-black text-white">{wallet.balance.toFixed(2)}<span className="text-lg text-slate-400 font-normal ml-1">€</span></p>
        <p className="text-xs text-slate-600 mt-0.5">Empezaste con {wallet.starting_balance.toFixed(0)}€</p>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800">
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Apostado</p>
          <p className="text-sm font-semibold text-slate-300">{wallet.total_simulated_staked.toFixed(2)}€</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Beneficio</p>
          <p className={`text-sm font-semibold flex items-center gap-0.5 ${profitPositive ? 'text-green-400' : 'text-red-400'}`}>
            {profitPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {profitPositive ? '+' : ''}{wallet.total_simulated_profit.toFixed(2)}€
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-0.5">ROI</p>
          <p className={`text-sm font-semibold ${profitPositive ? 'text-green-400' : 'text-red-400'}`}>
            {profitPositive ? '+' : ''}{roi}%
          </p>
        </div>
      </div>
    </div>
  )
}
