import Link from 'next/link'
import { TrendingUp } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-carbon flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-black text-teal-500/30 mb-4">404</p>
        <h1 className="text-2xl font-bold text-white mb-2">Página no encontrada</h1>
        <p className="text-texto-secundario mb-8">Esta página no existe o ha sido movida.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          <TrendingUp className="h-4 w-4" />
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
