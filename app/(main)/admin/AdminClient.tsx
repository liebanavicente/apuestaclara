'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Check, X, RotateCcw, Wand2, Loader2, Lock, ShieldCheck } from 'lucide-react'

export interface AdminFriend {
  id: string
  name: string
  avatarEmoji: string
  hasPin: boolean
  createdAt: string
  points: number
  picks: number
}

export interface AdminPick {
  id: string
  friendId: string
  friendName: string
  description: string
  competition: string
  selection: string
  odds: number
  status: 'pending' | 'won' | 'lost' | 'void'
  points: number
  matchDate?: string
  createdAt: string
}

interface Props {
  adminId: string
  friends: AdminFriend[]
  picks: AdminPick[]
}

const EMOJI_OPTIONS = ['🐟', '🍺', '👑', '⚽', '🎯', '🔥', '🚀', '🥊', '🏆', '🎩', '🦁', '🦊']

type Tab = 'friends' | 'picks'
type PickFilter = 'pending' | 'resolved' | 'all'

function fmtDate(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export function AdminClient({ adminId, friends, picks }: Props) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [tab, setTab] = useState<Tab>('friends')
  const [filter, setFilter] = useState<PickFilter>('pending')
  const [busy, setBusy] = useState<string | null>(null)
  const [message, setMessage] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null)

  async function call(key: string, url: string, init: RequestInit, okText: string) {
    setBusy(key)
    setMessage(null)
    try {
      const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...init })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Algo ha fallado')
      setMessage({ tone: 'ok', text: okText })
      startTransition(() => router.refresh())
      return data
    } catch (err) {
      setMessage({ tone: 'error', text: err instanceof Error ? err.message : 'Algo ha fallado' })
      return null
    } finally {
      setBusy(null)
    }
  }

  async function autoResolve() {
    const data = await call('auto', '/api/admin/auto-resolve', { method: 'POST' }, 'Resolución automática lanzada')
    if (data) {
      setMessage({ tone: 'ok', text: `Resolución automática: ${data.resolved ?? 0} resueltos, ${data.failed ?? 0} fallidos` })
    }
  }

  const pendingCount = picks.filter(p => p.status === 'pending').length
  const visiblePicks = picks.filter(p =>
    filter === 'all' ? true : filter === 'pending' ? p.status === 'pending' : p.status !== 'pending'
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 anim-fade-in">
        <div>
          <p className="gb-eyebrow mb-1.5 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Panel de control
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-[-0.04em] text-ink">Admin</h1>
          <p className="text-ink-2 text-[15px] mt-2">
            {friends.length} gañanes · {picks.length} picks · {pendingCount} pendientes
          </p>
        </div>
        <button onClick={autoResolve} disabled={busy === 'auto'} className="gb-btn gb-btn-secondary self-start sm:self-auto">
          {busy === 'auto' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4 text-amber-500" />}
          Resolver automáticamente
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="gb-segmented">
          <button className="gb-segmented-item" data-active={tab === 'friends'} onClick={() => setTab('friends')}>
            Amigos
          </button>
          <button className="gb-segmented-item" data-active={tab === 'picks'} onClick={() => setTab('picks')}>
            Picks
          </button>
        </div>
        {tab === 'picks' && (
          <div className="gb-segmented">
            {(['pending', 'resolved', 'all'] as const).map(f => (
              <button key={f} className="gb-segmented-item !px-3" data-active={filter === f} onClick={() => setFilter(f)}>
                {f === 'pending' ? 'Pendientes' : f === 'resolved' ? 'Resueltos' : 'Todos'}
              </button>
            ))}
          </div>
        )}
      </div>

      {message && (
        <div
          role="status"
          className={`mb-4 rounded-2xl px-4 py-3 text-sm flex items-center justify-between gap-3 anim-fade-in ${
            message.tone === 'ok' ? 'bg-emerald-500/10 text-emerald-800' : 'bg-rose-500/10 text-rose-700'
          }`}
        >
          {message.text}
          <button onClick={() => setMessage(null)} aria-label="Cerrar aviso" className="opacity-60 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {tab === 'friends' ? (
        <div className="gb-card rounded-3xl overflow-hidden divide-y divide-black/[0.06]">
          {friends.length === 0 && <p className="p-6 text-center text-ink-3 text-sm">No hay amigos registrados.</p>}
          {friends.map(f => (
            <FriendRow
              key={f.id}
              friend={f}
              isSelf={f.id === adminId}
              busy={busy}
              onSave={(update) =>
                call(`save-${f.id}`, `/api/club/admin/friends/${f.id}`, { method: 'PATCH', body: JSON.stringify(update) }, `${f.name} actualizado`)
              }
              onDelete={() =>
                call(`del-${f.id}`, `/api/club/admin/friends/${f.id}`, { method: 'DELETE' }, `${f.name} eliminado junto con sus picks`)
              }
            />
          ))}
        </div>
      ) : (
        <div className="gb-card rounded-3xl overflow-hidden divide-y divide-black/[0.06]">
          {visiblePicks.length === 0 && <p className="p-6 text-center text-ink-3 text-sm">No hay picks en esta vista.</p>}
          {visiblePicks.map(p => (
            <PickRow
              key={p.id}
              pick={p}
              busy={busy}
              onStatus={(status) =>
                call(`st-${p.id}`, `/api/club/admin/picks/${p.id}`, { method: 'PATCH', body: JSON.stringify({ status }) }, 'Pick actualizado')
              }
              onDelete={() => call(`delp-${p.id}`, `/api/club/admin/picks/${p.id}`, { method: 'DELETE' }, 'Pick eliminado')}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function FriendRow({
  friend, isSelf, busy, onSave, onDelete,
}: {
  friend: AdminFriend
  isSelf: boolean
  busy: string | null
  onSave: (update: { name?: string; avatarEmoji?: string; pin?: string; removePin?: boolean }) => Promise<unknown>
  onDelete: () => Promise<unknown>
}) {
  const [editing, setEditing] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [name, setName] = useState(friend.name)
  const [emoji, setEmoji] = useState(friend.avatarEmoji)
  const [pin, setPin] = useState('')

  async function save(extra?: { removePin?: boolean }) {
    const res = await onSave({ name, avatarEmoji: emoji, pin: pin || undefined, ...extra })
    if (res) { setEditing(false); setPin('') }
  }

  return (
    <div className="px-4 sm:px-5 py-3.5">
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-full bg-black/[0.04] flex items-center justify-center text-xl shrink-0">
          {friend.avatarEmoji}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[15px] font-semibold text-ink truncate">{friend.name}</p>
            {isSelf && <span className="gb-chip gb-chip-amber">Admin</span>}
            {friend.hasPin && <Lock className="w-3 h-3 text-ink-3 shrink-0" aria-label="Con PIN" />}
          </div>
          <p className="text-xs text-ink-3 truncate">
            {friend.picks} picks · <span className="tabular-nums">{friend.points.toFixed(2)}</span> pts · desde {fmtDate(friend.createdAt)} ·{' '}
            <span className="font-mono">{friend.id}</span>
          </p>
        </div>

        {!confirming ? (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => { setEditing(e => !e); setConfirming(false) }}
              aria-label={`Editar ${friend.name}`}
              className="w-9 h-9 rounded-full flex items-center justify-center text-ink-2 hover:bg-black/[0.05] transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>
            {!isSelf && (
              <button
                onClick={() => { setConfirming(true); setEditing(false) }}
                aria-label={`Eliminar ${friend.name}`}
                className="w-9 h-9 rounded-full flex items-center justify-center text-rose-600 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 shrink-0 anim-fade-in">
            <button onClick={() => setConfirming(false)} className="gb-btn gb-btn-ghost gb-btn-sm">
              Cancelar
            </button>
            <button
              onClick={onDelete}
              disabled={busy === `del-${friend.id}`}
              className="gb-btn gb-btn-sm bg-rose-600 text-white hover:bg-rose-700"
            >
              {busy === `del-${friend.id}` ? 'Eliminando…' : 'Eliminar'}
            </button>
          </div>
        )}
      </div>

      {confirming && (
        <p className="text-sm text-rose-700 mt-2 sm:pl-[3.25rem]">
          Se eliminará a {friend.name} y sus {friend.picks} picks. No se puede deshacer.
        </p>
      )}

      {editing && (
        <div className="mt-4 sm:pl-[3.25rem] space-y-3 anim-fade-in">
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-sm font-medium text-ink mb-1.5">Nombre</span>
              <input className="gb-input" value={name} onChange={e => setName(e.target.value)} />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-ink mb-1.5">
                {friend.hasPin ? 'Nuevo PIN' : 'Poner PIN'} <span className="text-ink-3 font-normal">· opcional</span>
              </span>
              <input
                className="gb-input font-mono"
                type="password"
                inputMode="numeric"
                maxLength={6}
                placeholder="4–6 dígitos"
                value={pin}
                onChange={e => setPin(e.target.value)}
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {EMOJI_OPTIONS.map(em => (
              <button
                key={em}
                type="button"
                onClick={() => setEmoji(em)}
                aria-pressed={emoji === em}
                className={`w-10 h-10 text-lg rounded-xl flex items-center justify-center transition-all ${
                  emoji === em ? 'bg-white shadow-[0_0_0_2px_rgba(245,158,11,0.9)]' : 'bg-black/[0.04] hover:bg-black/[0.07]'
                }`}
              >
                {em}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => save()} disabled={busy === `save-${friend.id}`} className="gb-btn gb-btn-primary gb-btn-sm">
              {busy === `save-${friend.id}` ? 'Guardando…' : 'Guardar'}
            </button>
            <button onClick={() => setEditing(false)} className="gb-btn gb-btn-ghost gb-btn-sm">
              Cancelar
            </button>
            {friend.hasPin && !isSelf && (
              <button onClick={() => save({ removePin: true })} className="gb-btn gb-btn-ghost gb-btn-sm !text-rose-600 ml-auto">
                Quitar PIN
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const STATUS_CHIP: Record<AdminPick['status'], { cls: string; label: string }> = {
  pending: { cls: 'gb-chip-amber', label: 'Pendiente' },
  won: { cls: 'gb-chip-green', label: 'Ganado' },
  lost: { cls: 'gb-chip-red', label: 'Perdido' },
  void: { cls: '', label: 'Anulado' },
}

function PickRow({
  pick, busy, onStatus, onDelete,
}: {
  pick: AdminPick
  busy: string | null
  onStatus: (status: 'won' | 'lost' | 'pending') => Promise<unknown>
  onDelete: () => Promise<unknown>
}) {
  const [confirming, setConfirming] = useState(false)
  const chip = STATUS_CHIP[pick.status]
  const working = busy === `st-${pick.id}` || busy === `delp-${pick.id}`

  return (
    <div className="px-4 sm:px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-[15px] font-semibold text-ink truncate">{pick.description}</p>
          <span className={`gb-chip shrink-0 ${chip.cls}`}>{chip.label}</span>
        </div>
        <p className="text-sm text-ink-2 truncate">
          {pick.friendName} · {pick.selection} @ <span className="tabular-nums">{pick.odds.toFixed(2)}</span>
          {pick.status === 'won' && <span className="text-emerald-600 font-medium tabular-nums"> · +{pick.points.toFixed(2)}</span>}
        </p>
        <p className="text-xs text-ink-3">
          {pick.competition} · partido {fmtDate(pick.matchDate)} · hecho {fmtDate(pick.createdAt)}
        </p>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {working && <Loader2 className="w-4 h-4 animate-spin text-ink-3" />}
        {confirming ? (
          <>
            <button onClick={() => setConfirming(false)} className="gb-btn gb-btn-ghost gb-btn-sm">Cancelar</button>
            <button onClick={onDelete} disabled={working} className="gb-btn gb-btn-sm bg-rose-600 text-white hover:bg-rose-700">
              Borrar pick
            </button>
          </>
        ) : (
          <>
            {pick.status !== 'won' && (
              <button onClick={() => onStatus('won')} disabled={working} className="gb-btn gb-btn-sm gb-btn-secondary !text-emerald-700">
                <Check className="w-3.5 h-3.5" /> Ganado
              </button>
            )}
            {pick.status !== 'lost' && (
              <button onClick={() => onStatus('lost')} disabled={working} className="gb-btn gb-btn-sm gb-btn-secondary !text-rose-600">
                <X className="w-3.5 h-3.5" /> Perdido
              </button>
            )}
            {pick.status !== 'pending' && (
              <button
                onClick={() => onStatus('pending')}
                disabled={working}
                aria-label="Volver a pendiente"
                title="Volver a pendiente"
                className="w-8 h-8 rounded-full flex items-center justify-center text-ink-2 hover:bg-black/[0.05]"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setConfirming(true)}
              aria-label="Borrar pick"
              className="w-8 h-8 rounded-full flex items-center justify-center text-rose-600 hover:bg-rose-500/10"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
