'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, TrendingUp, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PlanBadge } from '@/components/shared/PlanBadge'
import type { Profile } from '@/types/database'
import type { UserAccess } from '@/lib/access'

interface HeaderProps {
  profile?: Profile | null
  access?: UserAccess | null
  onSignOut?: () => void
}

const NAV_LINKS = [
  { href: '/generador', label: 'Generador' },
  { href: '/buscar-eventos', label: 'Eventos' },
  { href: '/simulador', label: 'Simulador' },
  { href: '/comunidad', label: 'Comunidad' },
  { href: '/premium', label: 'Premium' },
  { href: '/responsable', label: 'Juego responsable' },
]

export function Header({ profile, access, onSignOut }: HeaderProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  const planLabel = access?.isAdmin ? 'admin' : access?.isPremium ? 'premium' : 'free'

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <TrendingUp className="h-6 w-6 text-teal-400" />
            <span className="font-bold text-white text-lg tracking-tight">Apuesta Clara</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm transition-colors',
                  pathname.startsWith(href)
                    ? 'text-white bg-slate-800'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {profile ? (
              <div className="relative">
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
                >
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-7 h-7 rounded-full" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center text-xs font-bold text-white">
                      {(profile.username ?? profile.email).charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:block">{profile.username ?? profile.email.split('@')[0]}</span>
                  <PlanBadge plan={planLabel} />
                  <ChevronDown className="h-3 w-3 hidden sm:block" />
                </button>

                {accountOpen && (
                  <div className="absolute right-0 top-10 w-44 rounded-lg border border-slate-700 bg-slate-900 shadow-xl py-1 z-50">
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800" onClick={() => setAccountOpen(false)}>Dashboard</Link>
                    <Link href="/account" className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800" onClick={() => setAccountOpen(false)}>Mi cuenta</Link>
                    {access?.isAdmin && (
                      <Link href="/admin/debug" className="block px-4 py-2 text-sm text-purple-400 hover:text-purple-300 hover:bg-slate-800" onClick={() => setAccountOpen(false)}>Admin debug</Link>
                    )}
                    <hr className="border-slate-700 my-1" />
                    <button onClick={onSignOut} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-slate-800">
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5">
                  Entrar
                </Link>
                <Link href="/register" className="text-sm bg-teal-600 hover:bg-teal-500 text-white px-3 py-1.5 rounded-md transition-colors">
                  Registrarse
                </Link>
              </div>
            )}

            {/* Mobile burger */}
            <button
              className="lg:hidden p-1 text-slate-400 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950">
          <nav className="px-4 py-3 space-y-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'block px-3 py-2 rounded-md text-sm transition-colors',
                  pathname.startsWith(href)
                    ? 'text-white bg-slate-800'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                )}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
