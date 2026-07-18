'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, ChevronDown, Waves } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Profile } from '@/types/database'
import type { UserAccess } from '@/lib/access'

interface HeaderProps {
  profile?: Profile | null
  access?: UserAccess | null
  onSignOut?: () => void
}

const NAV_LINKS = [
  { href: '/dashboard', label: 'Partidos' },
  { href: '/mundial', label: 'Mundial' },
  { href: '/ranking', label: 'Ranking' },
  { href: '/reglas', label: 'Reglas' },
  { href: '/herramientas', label: 'Herramientas' },
]

const TAGLINES = [
  'lee la marea antes del pick',
  'cuotas claras, riesgo controlado',
  'mercado limpio, decisiones rápidas',
  'sin dinero real, con ranking real',
  'predicción social sin ruido',
]

const TAGLINE = TAGLINES[0]

export function Header({ profile, access, onSignOut }: HeaderProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  return (
    <header className="glass sticky top-0 z-50 border-b border-neon/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <span className="grid h-9 w-9 place-items-center rounded-md border border-neon/20 bg-neon/10 text-neon transition-colors group-hover:bg-neon group-hover:text-carbon">
              <Waves className="h-5 w-5" />
            </span>
            <div className="hidden sm:block">
              <span className="text-lg font-black tracking-tight text-white">ApuestaClara</span>
              <span className="block text-xs leading-none text-neon/70">{TAGLINE}</span>
            </div>
            <span className="text-lg font-black text-white sm:hidden">ApuestaClara</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm transition-colors',
                  pathname.startsWith(href)
                    ? 'bg-neon/10 font-medium text-neon'
                    : 'text-texto-secundario hover:text-white hover:bg-superficie-hover/60'
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
                  className="flex items-center gap-2 text-sm text-texto-secundario hover:text-white transition-colors"
                >
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-7 h-7 rounded-full" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-neon flex items-center justify-center text-xs font-black text-white">
                      {(profile.username ?? profile.email).charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:block font-medium">{profile.username ?? profile.email.split('@')[0]}</span>
                  <ChevronDown className="h-3 w-3 hidden sm:block" />
                </button>

                {accountOpen && (
                  <div className="absolute right-0 top-10 w-44 rounded-xl border border-superficie-hover bg-superficie shadow-2xl py-1 z-50">
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-texto-secundario hover:text-white hover:bg-superficie-hover" onClick={() => setAccountOpen(false)}>Dashboard</Link>
                    <Link href="/mis-picks" className="block px-4 py-2 text-sm text-texto-secundario hover:text-white hover:bg-superficie-hover" onClick={() => setAccountOpen(false)}>Mis picks</Link>
                    <Link href="/ranking" className="block px-4 py-2 text-sm text-texto-secundario hover:text-white hover:bg-superficie-hover" onClick={() => setAccountOpen(false)}>Ranking</Link>
                    <Link href="/account" className="block px-4 py-2 text-sm text-texto-secundario hover:text-white hover:bg-superficie-hover" onClick={() => setAccountOpen(false)}>Mi cuenta</Link>
                    {access?.isAdmin && (<>
                      <Link href="/admin/resolver" className="block px-4 py-2 text-sm text-ambar hover:text-ambar hover:bg-superficie-hover" onClick={() => setAccountOpen(false)}>Auto-resolver</Link>
                      <Link href="/admin/debug" className="block px-4 py-2 text-sm text-ambar hover:text-ambar hover:bg-superficie-hover" onClick={() => setAccountOpen(false)}>Admin debug</Link>
                    </>)}
                    <hr className="border-superficie-hover my-1" />
                    <button onClick={onSignOut} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-superficie-hover">
                      Salir 👋
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login?redirect=/dashboard" className="text-sm text-texto-secundario hover:text-white transition-colors px-3 py-1.5">
                  Entrar
                </Link>
                <Link href="/register?redirect=/dashboard" className="shine-btn rounded-md bg-neon px-3 py-1.5 text-sm font-black text-carbon transition-all hover:brightness-110">
                  Únete
                </Link>
              </div>
            )}

            {/* Mobile burger */}
            <button
              className="lg:hidden p-1 text-texto-secundario hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-superficie-hover bg-carbon">
          <nav className="px-4 py-3 space-y-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'block px-3 py-2 rounded-md text-sm transition-colors',
                  pathname.startsWith(href)
                    ? 'text-neon bg-neon/10 font-medium'
                    : 'text-texto-secundario hover:text-white hover:bg-superficie-hover/60'
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
