'use client'
import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { TrendingUp, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { loginAction } from './actions'

function LoginInner() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/dashboard'
  const errorParam = searchParams.get('error')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-teal-400 mb-4">
            <TrendingUp className="h-6 w-6" />
            <span className="font-bold text-white text-xl">Apuesta Clara</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-1">Bienvenido de vuelta</h1>
          <p className="text-slate-400 text-sm">Accede a tu cuenta para continuar</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          {errorParam === 'credenciales' && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              Email o contraseña incorrectos
            </div>
          )}

          <form action={loginAction} className="space-y-4">
            <input type="hidden" name="redirect" value={redirect} />

            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                placeholder="tu@email.com"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-white placeholder-slate-500 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500/50"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-white placeholder-slate-500 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500/50 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <Link href="/reset-password" className="text-xs text-slate-500 hover:text-teal-400 transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              Entrar
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-sm mt-5">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-teal-400 hover:text-teal-300 transition-colors">
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  )
}

export function LoginForm() {
  return <Suspense><LoginInner /></Suspense>
}
