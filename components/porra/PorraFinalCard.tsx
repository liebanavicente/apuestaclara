'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { GoalStepper } from './GoalStepper'
import { Confetti } from '@/components/marketing/Confetti'
import {
  BASE_FINAL_POINTS,
  FINAL_MULTIPLIER,
  isFinalLocked,
  opponentLabel,
  validateFinalPredictionInput,
} from '@/lib/porra'
import type { FinalMatchInfo, FinalPrediction } from '@/types/porra'
import { cn } from '@/lib/utils'

interface Props {
  isLoggedIn: boolean
}

export function PorraFinalCard({ isLoggedIn }: Props) {
  const [loading, setLoading] = useState(isLoggedIn)
  const [matchInfo, setMatchInfo] = useState<FinalMatchInfo | null>(null)
  const [prediction, setPrediction] = useState<FinalPrediction | null>(null)
  const [goalsSpain, setGoalsSpain] = useState(0)
  const [goalsRival, setGoalsRival] = useState(0)
  const [penaltyWinner, setPenaltyWinner] = useState<'espana' | 'rival' | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmingReplace, setConfirmingReplace] = useState(false)
  const [justSaved, setJustSaved] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) return
    fetch('/api/porra-final')
      .then(r => r.json())
      .then(data => {
        setMatchInfo(data.matchInfo)
        if (data.myPrediction) {
          setPrediction(data.myPrediction)
          setGoalsSpain(data.myPrediction.goals_spain)
          setGoalsRival(data.myPrediction.goals_rival)
          setPenaltyWinner(data.myPrediction.penalty_winner)
        }
      })
      .catch(() => setError('No se pudo cargar la porra'))
      .finally(() => setLoading(false))
  }, [isLoggedIn])

  const locked = matchInfo ? isFinalLocked(matchInfo.kickoff_at) : false
  const isDraw = goalsSpain === goalsRival
  const hasChanges =
    !prediction ||
    prediction.goals_spain !== goalsSpain ||
    prediction.goals_rival !== goalsRival ||
    (prediction.penalty_winner ?? null) !== penaltyWinner

  async function handleSave() {
    if (prediction && hasChanges && !confirmingReplace) {
      setConfirmingReplace(true)
      return
    }
    setConfirmingReplace(false)
    setError(null)

    const effectivePenalty = isDraw ? penaltyWinner : null
    const validation = validateFinalPredictionInput({
      goals_spain: goalsSpain,
      goals_rival: goalsRival,
      penalty_winner: effectivePenalty,
    })
    if (!validation.valid) {
      setError(validation.error!)
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/porra-final', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goals_spain: goalsSpain, goals_rival: goalsRival, penalty_winner: effectivePenalty }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'No se pudo guardar')
        setSaving(false)
        return
      }
      setPrediction(data.prediction)
      setJustSaved(true)
      setTimeout(() => setJustSaved(false), 3000)
    } catch {
      setError('No se pudo guardar. Inténtalo de nuevo.')
    }
    setSaving(false)
  }

  return (
    <section className="relative z-0 overflow-hidden rounded-3xl border border-amarillo/20">
      <div
        className="absolute inset-0 -z-20"
        style={{ background: 'linear-gradient(135deg, #7A0C1E 0%, #4a0f24 45%, #0B1E3F 100%)' }}
      />
      <div className="flag-watermark pointer-events-none absolute inset-0 -z-10" />
      {justSaved && <Confetti density={30} />}

      <div className="relative p-4 sm:p-10">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-4xl tracking-wide text-white sm:text-5xl">
            🇪🇸 Porra de la gran final
          </h2>

          <p className="mt-3 text-lg font-semibold text-texto-secundario sm:text-xl">
            {loading ? 'España vs. …' : matchInfo ? `España ${opponentLabel(matchInfo)}` : 'España vs. Rival por confirmar'}
          </p>

          <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-amarillo/40 bg-amarillo/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[1.5px] text-amarillo">
            Resultado exacto: cuota x{FINAL_MULTIPLIER}
          </span>

          <p className="mx-auto mt-4 max-w-md text-sm text-texto-secundario sm:text-base">
            Acierta el marcador exacto de la final y multiplica por {FINAL_MULTIPLIER} tu cuota o
            puntuación de esa apuesta ({BASE_FINAL_POINTS} → {BASE_FINAL_POINTS * FINAL_MULTIPLIER} pts).
          </p>

          {!isLoggedIn ? (
            <div className="mt-8">
              <Link
                href="/login?redirect=/mundial"
                className="shine-btn inline-block rounded-xl bg-rojo px-8 py-3.5 font-bold text-white transition-transform hover:scale-105"
              >
                Entrar para hacer tu porra
              </Link>
            </div>
          ) : loading ? (
            <div className="mt-10 flex justify-center gap-6">
              <div className="skeleton-shimmer h-20 w-20 rounded-2xl" />
              <div className="skeleton-shimmer h-20 w-20 rounded-2xl" />
            </div>
          ) : locked ? (
            <div className="mt-8 rounded-2xl border border-superficie-hover bg-superficie/70 p-6">
              <p className="mb-3 text-sm font-bold uppercase tracking-wider text-error">🔒 Pronósticos cerrados</p>
              {prediction ? (
                <>
                  <p className="font-mono text-3xl font-bold text-white">
                    España {prediction.goals_spain} – {prediction.goals_rival} Rival
                  </p>
                  {prediction.penalty_winner && (
                    <p className="mt-2 text-sm text-texto-secundario">
                      Penaltis: {prediction.penalty_winner === 'espana' ? 'gana España' : 'gana el rival'}
                    </p>
                  )}
                  <p className="mt-3 text-xs text-texto-secundario">
                    Estado:{' '}
                    {prediction.status === 'pending' ? 'pendiente de resolver' : prediction.status === 'won' ? `¡Acertaste! +${prediction.points} pts` : 'no acertaste el marcador exacto'}
                  </p>
                </>
              ) : (
                <p className="text-texto-secundario">No hiciste un pronóstico para la final.</p>
              )}
            </div>
          ) : (
            <div className="mt-8">
              <div className="flex items-center justify-center gap-3 sm:gap-8">
                <GoalStepper label="España" value={goalsSpain} onChange={setGoalsSpain} disabled={saving} />
                <span className="mb-6 hidden font-display text-3xl text-texto-secundario sm:block">–</span>
                <GoalStepper label="Rival" value={goalsRival} onChange={setGoalsRival} disabled={saving} />
              </div>

              {isDraw && (
                <div className="mt-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-texto-secundario">
                    Si hay empate, ¿quién gana en penaltis? (opcional)
                  </p>
                  <div className="flex justify-center gap-3">
                    {(['espana', 'rival'] as const).map(who => (
                      <button
                        key={who}
                        type="button"
                        onClick={() => setPenaltyWinner(prev => (prev === who ? null : who))}
                        disabled={saving}
                        className={cn(
                          'rounded-lg border px-4 py-2 text-sm font-semibold transition-colors',
                          penaltyWinner === who
                            ? 'border-amarillo bg-amarillo text-[#0B1E3F]'
                            : 'border-superficie-hover text-texto-secundario hover:border-amarillo/60 hover:text-amarillo'
                        )}
                      >
                        {who === 'espana' ? '🇪🇸 España' : 'Rival'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {error && <p className="mt-4 text-sm font-semibold text-error">{error}</p>}

              {justSaved && (
                <div className="mt-6 rounded-2xl border border-neon/40 bg-neon/10 p-5">
                  <p className="font-bold text-white">✅ Tu porra se ha guardado correctamente</p>
                  <p className="mt-2 font-mono text-2xl font-bold text-white">
                    Tu pronóstico: España {goalsSpain} – {goalsRival} Rival
                  </p>
                  <p className="mt-1 text-sm text-amarillo">Premio por resultado exacto: x{FINAL_MULTIPLIER}</p>
                </div>
              )}

              {confirmingReplace && (
                <div className="mt-6 rounded-xl border border-amarillo/40 bg-amarillo/10 p-4 text-sm text-white">
                  <p className="mb-3">
                    Ya tienes un pronóstico guardado ({prediction!.goals_spain}–{prediction!.goals_rival}). ¿Reemplazarlo por{' '}
                    {goalsSpain}–{goalsRival}?
                  </p>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={handleSave}
                      className="rounded-lg bg-amarillo px-4 py-2 font-bold text-[#0B1E3F]"
                    >
                      Confirmar y reemplazar
                    </button>
                    <button
                      onClick={() => setConfirmingReplace(false)}
                      className="rounded-lg border border-superficie-hover px-4 py-2 text-texto-secundario"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {!confirmingReplace && (
                <button
                  onClick={handleSave}
                  disabled={saving || (!!prediction && !hasChanges)}
                  className="shine-btn mt-8 w-full rounded-xl bg-rojo px-8 py-4 text-lg font-bold text-white shadow-[0_0_30px_rgba(198,11,30,0.4)] transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 sm:w-auto"
                >
                  {saving ? 'Guardando…' : 'Guardar mi porra 🇪🇸'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
