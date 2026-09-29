'use client'
import { useState, useEffect } from 'react'
import { X, UserPlus, Lock, Check, ChevronRight, ArrowLeft } from 'lucide-react'

export interface FriendSummary {
  id: string
  name: string
  avatarEmoji: string
  hasPin: boolean
}

interface Props {
  isOpen: boolean
  onClose: () => void
  currentFriendId?: string | null
}

const EMOJI_OPTIONS = ['🐟', '🍺', '👑', '⚽', '🎯', '🔥', '🚀', '🥊', '🏆', '🎩', '🦁', '🦊']

export function FriendSelectorModal({ isOpen, onClose, currentFriendId }: Props) {
  const [friends, setFriends] = useState<FriendSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFriend, setSelectedFriend] = useState<FriendSummary | null>(null)
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState<string | null>(null)

  // New friend form
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmoji, setNewEmoji] = useState('🐟')
  const [newPin, setNewPin] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadFriends()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  async function loadFriends() {
    setLoading(true)
    try {
      const res = await fetch('/api/club/friends')
      if (res.ok) {
        const data = await res.json()
        setFriends(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSelectFriend(friend: FriendSummary) {
    if (friend.hasPin) {
      setSelectedFriend(friend)
      setPinInput('')
      setPinError(null)
      return
    }

    await doLogin(friend.id)
  }

  async function doLogin(friendId: string, pin?: string) {
    try {
      const res = await fetch('/api/club/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendId, pin }),
      })
      const data = await res.json()
      if (!res.ok) {
        setPinError(data.error || 'Error al iniciar sesión')
        return
      }
      onClose()
      window.location.reload()
    } catch {
      setPinError('Error de conexión')
    }
  }

  async function handleCreateFriend(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) {
      setAddError('Escribe tu nombre o apodo')
      return
    }
    setSubmitting(true)
    setAddError(null)

    try {
      const res = await fetch('/api/club/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          avatarEmoji: newEmoji,
          pin: newPin.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setAddError(data.error || 'No se pudo crear el perfil')
        setSubmitting(false)
        return
      }

      onClose()
      window.location.reload()
    } catch {
      setAddError('Error de red al crear el perfil')
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  const title = selectedFriend ? selectedFriend.name : showAdd ? 'Únete al club' : '¿Quién eres?'
  const subtitle = selectedFriend
    ? 'Introduce tu PIN'
    : showAdd
    ? 'Crea tu perfil en 10 segundos'
    : 'Elige tu nombre para hacer picks'

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4 bg-black/25 backdrop-blur-sm anim-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="friend-selector-title"
        onClick={e => e.stopPropagation()}
        className="relative w-full sm:max-w-md rounded-t-[28px] sm:rounded-[28px] p-5 sm:p-6 gb-glass-strong border border-white/70 shadow-[var(--gb-shadow-lg)] anim-scale-in max-h-[92vh] overflow-y-auto"
      >
        <div className="sm:hidden mx-auto -mt-1 mb-4 w-9 h-1 rounded-full bg-black/15" />

        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            {(selectedFriend || showAdd) && (
              <button
                onClick={() => (selectedFriend ? setSelectedFriend(null) : setShowAdd(false))}
                aria-label="Volver"
                className="w-8 h-8 -ml-1 rounded-full flex items-center justify-center text-ink-2 hover:bg-black/[0.05] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h2 id="friend-selector-title" className="text-xl font-semibold tracking-[-0.025em] text-ink">{title}</h2>
              <p className="text-sm text-ink-2">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-black/[0.05] text-ink-2 hover:bg-black/[0.08] transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PIN prompt */}
        {selectedFriend && (
          <form
            onSubmit={e => { e.preventDefault(); doLogin(selectedFriend.id, pinInput) }}
            className="space-y-4 anim-fade-in"
          >
            <span className="mx-auto w-16 h-16 rounded-full bg-black/[0.04] flex items-center justify-center text-3xl">
              {selectedFriend.avatarEmoji}
            </span>
            <input
              type="password"
              inputMode="numeric"
              maxLength={8}
              autoFocus
              placeholder="••••"
              aria-label="PIN"
              value={pinInput}
              onChange={e => setPinInput(e.target.value)}
              className="gb-input !h-14 text-center text-2xl tracking-[0.5em] font-mono"
            />
            {pinError && <p className="text-sm text-rose-600 text-center">{pinError}</p>}
            <button type="submit" className="gb-btn gb-btn-primary gb-btn-lg w-full">
              Entrar
            </button>
          </form>
        )}

        {/* Friend list */}
        {!selectedFriend && !showAdd && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-white/60 shadow-[0_0_0_0.5px_rgba(0,0,0,0.06)] divide-y divide-black/[0.06] max-h-72 overflow-y-auto">
              {loading ? (
                <div className="py-10 text-center text-ink-3 text-sm">Cargando…</div>
              ) : friends.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-ink font-medium">Aún no hay nadie</p>
                  <p className="text-sm text-ink-3 mt-0.5">¡Sé el primero en apuntarte!</p>
                </div>
              ) : (
                friends.map(f => {
                  const isCurrent = f.id === currentFriendId
                  return (
                    <button
                      key={f.id}
                      onClick={() => handleSelectFriend(f)}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-emerald-500/[0.07] active:bg-emerald-500/[0.12] transition-colors"
                    >
                      <span className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-black/[0.04] shrink-0">
                        {f.avatarEmoji}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-medium text-ink truncate">{f.name}</p>
                        {f.hasPin && (
                          <p className="flex items-center gap-1 text-xs text-ink-3">
                            <Lock className="w-3 h-3" /> Con PIN
                          </p>
                        )}
                      </div>
                      {isCurrent ? (
                        <span className="gb-chip gb-chip-green shrink-0">
                          <Check className="w-3 h-3" /> Activo
                        </span>
                      ) : (
                        <ChevronRight className="w-4 h-4 text-ink-3 shrink-0" />
                      )}
                    </button>
                  )
                })
              )}
            </div>

            <button onClick={() => setShowAdd(true)} className="gb-btn gb-btn-primary gb-btn-lg w-full">
              <UserPlus className="w-4 h-4" />
              Añadirme al grupo
            </button>
          </div>
        )}

        {/* Add friend form */}
        {!selectedFriend && showAdd && (
          <form onSubmit={handleCreateFriend} className="space-y-5 anim-fade-in">
            <div>
              <label htmlFor="new-friend-name" className="block text-sm font-medium text-ink mb-1.5">
                Nombre o apodo
              </label>
              <input
                id="new-friend-name"
                type="text"
                required
                autoFocus
                placeholder="Miguel, Carlos, Guaje…"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="gb-input"
              />
            </div>

            <div>
              <p className="block text-sm font-medium text-ink mb-1.5">Tu emoji</p>
              <div className="grid grid-cols-6 gap-1.5">
                {EMOJI_OPTIONS.map(em => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setNewEmoji(em)}
                    aria-pressed={newEmoji === em}
                    className={`aspect-square text-xl rounded-2xl flex items-center justify-center transition-all duration-200 ${
                      newEmoji === em
                        ? 'bg-white shadow-[0_0_0_2px_rgba(245,158,11,0.9),0_4px_12px_-4px_rgba(217,119,6,0.5)] scale-105'
                        : 'bg-black/[0.04] hover:bg-black/[0.07]'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="new-friend-pin" className="block text-sm font-medium text-ink mb-1.5">
                PIN <span className="text-ink-3 font-normal">· opcional</span>
              </label>
              <input
                id="new-friend-pin"
                type="password"
                inputMode="numeric"
                maxLength={6}
                placeholder="4 dígitos para proteger tu perfil"
                value={newPin}
                onChange={e => setNewPin(e.target.value)}
                className="gb-input font-mono"
              />
            </div>

            {addError && <p className="text-sm text-rose-600 text-center">{addError}</p>}

            <button type="submit" disabled={submitting} className="gb-btn gb-btn-primary gb-btn-lg w-full">
              {submitting ? 'Creando…' : 'Crear perfil'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
