import { AnalizarClient } from './AnalizarClient'

export const metadata = { title: 'Análisis IA — GañanesBets' }

export default function AnalizarPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Análisis con IA</h1>
        <p className="text-texto-secundario text-sm">Razonamiento objetivo sobre tus selecciones. Factores a favor, en contra y por qué puede fallar cada pick.</p>
      </div>
      <AnalizarClient />
    </main>
  )
}
