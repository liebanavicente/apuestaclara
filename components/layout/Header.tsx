'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, UserCheck, ChevronDown, Trophy, Calendar, BookOpen, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Friend } from '@/lib/services/club.service'

interface HeaderProps {
  friend?: Friend | null
  profile?: any
  access?: any
  onSignOut?: () => void
  onOpenSelector?: () => void
}

const NAV_LINKS = [
  { href: '/dashboard', label: 'Partidos', icon: Calendar },
  { href: '/ranking', label: 'Ranking', icon: Trophy },
  { href: '/reglas', label: 'Reglas', icon: BookOpen },
]

export function Header({ friend, onSignOut, onOpenSelector }: HeaderProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/75 backdrop-blur-2xl border-b border-slate-200/60 shadow-[0_2px_12px_rgba(15,23,42,0.02)] transition-all">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Logo — Apple clean typography */}
          <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl shadow-xs group-hover:scale-105 transition-transform">
              🐟
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-[15px] tracking-tight">GañanesBets</span>
                <span className="hidden sm:inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
                  Club
                </span>
              </div>
              <span className="hidden sm:block text-[11px] text-slate-400 font-medium tracking-tight">
                LaLiga & Champions League
              </span>
            </div>
          </Link>

          {/* Desktop nav — Apple segmented frosted pill */}
          <nav className="hidden md:flex items-center rounded-full p-1 bg-slate-100/80 border border-slate-200/70 shadow-inner">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200',
                    active
                      ? 'bg-white text-slate-900 shadow-[0_2px_8px_rgba(15,23,42,0.08)] border border-slate-200/80'
                      : 'text-slate-500 hover:text-slate-900'
                  )}
                >
                  <Icon className={cn('w-3.5 h-3.5', active ? 'text-amber-500' : 'text-slate-400')} />
                  <span>{label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Right side — Friend Profile or Login */}
          <div className="flex items-center gap-2">
            {friend ? (
              <div className="relative">
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white border border-slate-200/90 shadow-xs hover:shadow-sm transition-all"
                >
                  <span className="text-lg leading-none">{friend.avatarEmoji}</span>
                  <span className="font-bold text-xs text-slate-800">{friend.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {accountOpen && (
                  <div className="absolute right-0 top-11 w-56 rounded-2xl p-1.5 z-50 bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-2xl anim-slide-up">
                    <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 mb-1">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Perfil activo</p>
                      <p className="text-slate-900 font-extrabold text-sm truncate flex items-center gap-1.5 mt-0.5">
                        <span>{friend.avatarEmoji}</span> {friend.name}
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 rounded-xl transition-colors"
                        onClick={() => setAccountOpen(false)}
                      >
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> Partidos y mis picks
                      </Link>
                      <Link
                        href="/ranking"
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 rounded-xl transition-colors"
                        onClick={() => setAccountOpen(false)}
                      >
                        <Trophy className="w-3.5 h-3.5 text-amber-500" /> Ver Ranking
                      </Link>
                      <button
                        onClick={() => { setAccountOpen(false); onOpenSelector?.() }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50/80 rounded-xl transition-colors text-left"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-amber-600" /> Cambiar de amigo
                      </button>
                    </div>

                    <div className="my-1 border-t border-slate-100" />
                    <button
                      onClick={() => { setAccountOpen(false); onSignOut?.() }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50/70 rounded-xl transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-500" /> Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenSelector}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md shadow-slate-900/10 hover:shadow-lg transition-all active:scale-95"
              >
                <span>🐟</span> ¿Quién eres? / Entrar
              </button>
            )}

            {/* Mobile burger */}
            <button
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Abrir menú"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-2xl p-4 space-y-2 anim-slide-up">
          <nav className="space-y-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all',
                    active
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 text-slate-900'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
