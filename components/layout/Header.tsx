'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, ChevronDown, Activity } from 'lucide-react'
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

export function Header({ profile, access, onSignOut }: HeaderProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 glass">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
              <Activity className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="font-display font-bold text-foreground text-lg tracking-tight">
              Gañanes<span className="text-primary">Bets</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'px-3.5 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname.startsWith(href)
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {profile ? (
              <div className="relative">
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="flex items-center gap-2 text-sm text-foreground/90 hover:text-foreground transition-colors min-h-11"
                >
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url || "/placeholder.svg"} alt="" className="w-8 h-8 rounded-full ring-1 ring-border" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                      {(profile.username ?? profile.email).charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:block font-medium">{profile.username ?? profile.email.split('@')[0]}</span>
                  <ChevronDown className="h-3.5 w-3.5 hidden sm:block text-muted-foreground" />
                </button>

                {accountOpen && (
                  <div className="absolute right-0 top-12 w-48 rounded-xl border border-border bg-popover shadow-2xl py-1.5 z-50">
                    <Link href="/dashboard" className="block px-4 py-2.5 text-sm text-popover-foreground/80 hover:text-foreground hover:bg-secondary" onClick={() => setAccountOpen(false)}>Dashboard</Link>
                    <Link href="/mis-picks" className="block px-4 py-2.5 text-sm text-popover-foreground/80 hover:text-foreground hover:bg-secondary" onClick={() => setAccountOpen(false)}>Mis picks</Link>
                    <Link href="/ranking" className="block px-4 py-2.5 text-sm text-popover-foreground/80 hover:text-foreground hover:bg-secondary" onClick={() => setAccountOpen(false)}>Ranking</Link>
                    <Link href="/account" className="block px-4 py-2.5 text-sm text-popover-foreground/80 hover:text-foreground hover:bg-secondary" onClick={() => setAccountOpen(false)}>Mi cuenta</Link>
                    {access?.isAdmin && (<>
                      <Link href="/admin/resolver" className="block px-4 py-2.5 text-sm text-accent hover:bg-secondary" onClick={() => setAccountOpen(false)}>Auto-resolver</Link>
                      <Link href="/admin/debug" className="block px-4 py-2.5 text-sm text-accent hover:bg-secondary" onClick={() => setAccountOpen(false)}>Admin debug</Link>
                    </>)}
                    <hr className="border-border my-1.5" />
                    <button onClick={onSignOut} className="w-full text-left px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary">
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link href="/login?redirect=/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 min-h-11 flex items-center">
                  Entrar
                </Link>
                <Link href="/register?redirect=/dashboard" className="text-sm bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded-lg transition-colors shadow-lg shadow-primary/20 min-h-11 flex items-center">
                  Empezar gratis
                </Link>
              </div>
            )}

            {/* Mobile burger */}
            <button
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground min-h-11 min-w-11 flex items-center justify-center"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menú"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-popover">
          <nav className="px-4 py-3 space-y-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'block px-3 py-3 rounded-lg text-sm font-medium transition-colors',
                  pathname.startsWith(href)
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
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
