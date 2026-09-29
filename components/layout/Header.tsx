'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
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
  const accountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!accountOpen) return
    function onPointer(e: PointerEvent) {
      if (!accountRef.current?.contains(e.target as Node)) setAccountOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setAccountOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [accountOpen])

  return (
    <header className="sticky top-0 z-50 gb-glass-strong border-b border-black/[0.06]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between gap-4">

          <Link href="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="GañanesBets — inicio">
            <span className="w-8 h-8 rounded-[10px] bg-gradient-to-b from-amber-300 to-amber-500 flex items-center justify-center text-base shadow-[0_1px_2px_rgba(180,83,9,0.3),inset_0_1px_0_rgba(255,255,255,0.5)] group-hover:scale-105 transition-transform duration-300">
              🐟
            </span>
            <span className="font-semibold text-[15px] tracking-[-0.02em] text-ink">GañanesBets</span>
          </Link>

          <nav className="hidden md:flex gb-segmented" aria-label="Principal">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  data-active={active}
                  aria-current={active ? 'page' : undefined}
                  className="gb-segmented-item"
                >
                  <Icon className={cn('w-3.5 h-3.5', active ? 'text-amber-500' : 'text-ink-3')} />
                  {label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            {friend ? (
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setAccountOpen(o => !o)}
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                  className="gb-btn gb-btn-secondary gb-btn-sm pl-1.5 pr-2.5"
                >
                  <span className="w-6 h-6 rounded-full bg-black/[0.05] flex items-center justify-center text-sm leading-none">
                    {friend.avatarEmoji}
                  </span>
                  <span className="max-w-[7rem] truncate">{friend.name}</span>
                  <ChevronDown className={cn('w-3.5 h-3.5 text-ink-3 transition-transform duration-200', accountOpen && 'rotate-180')} />
                </button>

                {accountOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-11 w-60 rounded-2xl p-1.5 z-50 gb-glass-strong border border-white/70 shadow-[var(--gb-shadow-lg)] anim-scale-in origin-top-right"
                  >
                    <div className="flex items-center gap-3 px-3 py-2.5">
                      <span className="w-9 h-9 rounded-full bg-black/[0.05] flex items-center justify-center text-lg">
                        {friend.avatarEmoji}
                      </span>
                      <div className="min-w-0">
                        <p className="gb-eyebrow">Perfil activo</p>
                        <p className="text-sm font-semibold text-ink truncate">{friend.name}</p>
                      </div>
                    </div>
                    <div className="gb-divider mx-2 my-1" />
                    <MenuLink href="/dashboard" onClick={() => setAccountOpen(false)} icon={<Calendar className="w-4 h-4" />}>
                      Partidos y mis picks
                    </MenuLink>
                    <MenuLink href="/ranking" onClick={() => setAccountOpen(false)} icon={<Trophy className="w-4 h-4" />}>
                      Ranking
                    </MenuLink>
                    <button
                      role="menuitem"
                      onClick={() => { setAccountOpen(false); onOpenSelector?.() }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-ink hover:bg-black/[0.05] rounded-xl transition-colors text-left"
                    >
                      <UserCheck className="w-4 h-4 text-ink-3" /> Cambiar de amigo
                    </button>
                    <div className="gb-divider mx-2 my-1" />
                    <button
                      role="menuitem"
                      onClick={() => { setAccountOpen(false); onSignOut?.() }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-600 hover:bg-rose-500/[0.08] rounded-xl transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" /> Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={onOpenSelector} className="gb-btn gb-btn-primary gb-btn-sm">
                ¿Quién eres?
              </button>
            )}

            <button
              className="md:hidden w-9 h-9 flex items-center justify-center text-ink hover:bg-black/[0.05] rounded-full transition-colors"
              onClick={() => setMobileOpen(o => !o)}
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-black/[0.06] px-4 pt-2 pb-4 anim-fade-in">
          <nav className="flex flex-col" aria-label="Principal móvil">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] transition-colors',
                    active ? 'font-semibold text-ink bg-black/[0.05]' : 'text-ink-2 hover:bg-black/[0.04]'
                  )}
                >
                  <Icon className={cn('w-[18px] h-[18px]', active ? 'text-amber-500' : 'text-ink-3')} />
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}

function MenuLink({ href, onClick, icon, children }: { href: string; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onClick}
      className="flex items-center gap-2.5 px-3 py-2 text-sm text-ink hover:bg-black/[0.05] rounded-xl transition-colors [&>svg]:text-ink-3"
    >
      {icon}
      {children}
    </Link>
  )
}
