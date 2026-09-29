'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X, UserPlus, Lock, Check, ArrowLeft } from 'lucide-react'

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
  const router = useRouter()
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-md anim-fade-in">
      <div
        className="relative w-full max-w-md rounded-3xl p-6 overflow-hidden bg-white/95 backdrop-blur-2xl border border-white/80 shadow-[0_24px_64px_rgba(15,23,42,0.18)]"
      >
        {/* Subtle accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />

        <div className="flex items-center justify-between mb-5 pt-1">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center">
              🐟
            </span>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Club Gañanes</h2>
              <p className="text-xs text-slate-500 font-medium">Elige quién eres para apostar y sumar puntos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PIN Prompt View */}
        {selectedFriend && (
          <div className="space-y-4 py-2 anim-slide-up">
            <div className="text-center">
              <span className="text-4xl inline-block mb-2 w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto border border-slate-200">
                {selectedFriend.avatarEmoji}
              </span>
              <h3 className="text-slate-900 font-extrabold text-base">{selectedFriend.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Introduce tu PIN de seguridad</p>
            </div>

            <form onSubmit={e => { e.preventDefault(); doLogin(selectedFriend.id, pinInput) }} className="space-y-3">
              <input
                type="password"
                maxLength={8}
                autoFocus
                placeholder="PIN de 4 dígitos"
                value={pinInput}
                onChange={e => setPinInput(e.target.value)}
                className="w-full text-center text-xl tracking-widest px-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-white transition-all font-mono"
              />

              {pinError && (
                <p className="text-xs text-rose-600 text-center font-semibold">{pinError}</p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedFriend(null)}
                  className="flex-1 py-2.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Entrar ✓
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Friend List or Add Form */}
        {!selectedFriend && (
          <>
            {!showAdd ? (
              <div className="space-y-3">
                <div className="max-h-64 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {loading ? (
                    <div className="py-10 text-center text-slate-400 text-xs font-medium">Cargando amigos...</div>
                  ) : friends.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 text-sm">
                      <p className="font-semibold text-slate-700 mb-1">Aún no hay amigos registrados</p>
                      <p className="text-xs text-slate-400">¡Sé el primero en apuntarte al club!</p>
                    </div>
                  ) : (
                    friends.map(f => {
                      const isCurrent = f.id === currentFriendId
                      return (
                        <button
                          key={f.id}
                          onClick={() => handleSelectFriend(f)}
                          className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all text-left ${
                            isCurrent
                              ? 'bg-amber-50/90 border border-amber-300 text-amber-950 shadow-xs'
                              : 'bg-slate-50 hover:bg-slate-100/90 border border-slate-200/70 text-slate-700 hover:text-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-2xl w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-xs border border-slate-200/60 shrink-0">
                              {f.avatarEmoji}
                            </span>
                            <div className="truncate">
                              <p className="font-extrabold text-sm text-slate-900 truncate">{f.name}</p>
                              {f.hasPin && (
                                <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                                  <Lock className="w-2.5 h-2.5" /> Con PIN
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-1.5 text-xs font-bold">
                            {isCurrent ? (
                              <span className="flex items-center gap-1 text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full text-[11px] font-bold">
                                <Check className="w-3 h-3" /> Activo
                              </span>
                            ) : (
                              <span className="text-slate-500 group-hover:text-slate-900">Entrar →</span>
                            )}
                          </div>
                        </button>
                      )
                    })
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setShowAdd(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-md shadow-slate-900/10 active:scale-98"
                  >
                    <UserPlus className="w-4 h-4" />
                    + Añadirme al grupo
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateFriend} className="space-y-4 anim-slide-up">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Tu nombre o apodo
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Miguel, Carlos, Guaje..."
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-slate-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Elige tu emoji
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {EMOJI_OPTIONS.map(em => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setNewEmoji(em)}
                        className={`text-xl p-2 rounded-2xl transition-all ${
                          newEmoji === em
                            ? 'bg-amber-100 border-2 border-amber-500 scale-105 shadow-xs'
                            : 'bg-slate-100 border border-slate-200/60 hover:bg-slate-200'
                        }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    PIN opcional <span className="text-slate-400 font-normal lowercase">(para proteger tu perfil)</span>
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="4 dígitos (opcional)"
                    value={newPin}
                    onChange={e => setNewPin(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-slate-500 focus:bg-white transition-all font-mono"
                  />
                </div>

                {addError && (
                  <p className="text-xs text-rose-600 text-center font-semibold">{addError}</p>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="flex-1 py-2.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Atrás
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-md active:scale-98"
                  >
                    {submitting ? 'Creando...' : 'Crear perfil ✓'}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}
