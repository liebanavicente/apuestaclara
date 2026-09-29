'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X, UserPlus, Lock, Check } from 'lucide-react'

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
      router.refresh()
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
      router.refresh()
    } catch {
      setAddError('Error de red')
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md anim-fade-in">
      <div className="relative w-full max-w-md rounded-3xl p-6 overflow-hidden"
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
        }}>

        {/* Top gold bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🐟</span>
            <div>
              <h2 className="text-lg font-black text-white">Club Gañanes</h2>
              <p className="text-xs text-white/40">Elige quién eres para apostar y sumar puntos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PIN Prompt View */}
        {selectedFriend && (
          <div className="space-y-4 py-2 anim-slide-up">
            <div className="text-center">
              <span className="text-4xl inline-block mb-2">{selectedFriend.avatarEmoji}</span>
              <h3 className="text-white font-bold text-lg">{selectedFriend.name}</h3>
              <p className="text-xs text-white/40 mt-1">Este perfil tiene PIN de seguridad</p>
            </div>

            <form onSubmit={e => { e.preventDefault(); doLogin(selectedFriend.id, pinInput) }} className="space-y-3">
              <input
                type="password"
                maxLength={8}
                autoFocus
                placeholder="Introduce tu PIN"
                value={pinInput}
                onChange={e => setPinInput(e.target.value)}
                className="w-full text-center text-lg tracking-widest px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-yellow-400"
              />

              {pinError && (
                <p className="text-xs text-red-400 text-center font-medium">{pinError}</p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedFriend(null)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white text-xs font-semibold"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black text-xs transition-colors"
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
                    <div className="py-8 text-center text-white/30 text-sm">Cargando amigos...</div>
                  ) : friends.length === 0 ? (
                    <div className="py-8 text-center text-white/40 text-sm">
                      <p className="mb-2">Aún no hay amigos registrados</p>
                      <p className="text-xs text-white/30">¡Sé el primero en apuntarte!</p>
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
                              ? 'bg-yellow-500/15 border border-yellow-500/40 text-white'
                              : 'bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] text-white/80 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-2xl w-9 h-9 rounded-xl flex items-center justify-center bg-white/[0.06] shrink-0">
                              {f.avatarEmoji}
                            </span>
                            <div className="truncate">
                              <p className="font-bold text-sm text-white truncate">{f.name}</p>
                              {f.hasPin && (
                                <span className="flex items-center gap-1 text-[10px] text-white/30">
                                  <Lock className="w-2.5 h-2.5" /> Con PIN
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-yellow-400">
                            {isCurrent ? (
                              <span className="flex items-center gap-1 text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full text-[11px]">
                                <Check className="w-3 h-3" /> Activo
                              </span>
                            ) : (
                              <span>Entrar →</span>
                            )}
                          </div>
                        </button>
                      )
                    })
                  )}
                </div>

                <div className="pt-2 border-t border-white/10">
                  <button
                    onClick={() => setShowAdd(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black text-sm transition-colors shadow-lg shadow-yellow-500/15"
                  >
                    <UserPlus className="w-4 h-4" />
                    + Añadirme al grupo
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateFriend} className="space-y-4 anim-slide-up">
                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-1.5">
                    Tu nombre o apodo
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Miguel, Carlos, Guaje..."
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-1.5">
                    Elige tu emoji
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {EMOJI_OPTIONS.map(em => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setNewEmoji(em)}
                        className={`text-xl p-2 rounded-xl transition-all ${
                          newEmoji === em
                            ? 'bg-yellow-400/20 border-2 border-yellow-400 scale-105'
                            : 'bg-white/5 border border-white/5 hover:bg-white/10'
                        }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-1">
                    PIN opcional <span className="text-white/30 font-normal">(para que nadie apueste por ti)</span>
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="4 dígitos (opcional)"
                    value={newPin}
                    onChange={e => setNewPin(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-yellow-400"
                  />
                </div>

                {addError && (
                  <p className="text-xs text-red-400 text-center font-medium">{addError}</p>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white text-xs font-semibold"
                  >
                    Atrás
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-slate-950 font-black text-xs transition-colors"
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
