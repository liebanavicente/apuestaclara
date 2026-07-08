import type { Metadata } from 'next'
import { Inter, Bebas_Neue, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const bebasNeue = Bebas_Neue({ subsets: ['latin'], weight: '400', variable: '--font-bebas-neue' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' })

export const metadata: Metadata = {
  title: 'GañanesBets — Analiza. Compara. Decide mejor.',
  description:
    'Herramienta de análisis orientativo de combinadas deportivas. Simula apuestas sin dinero real, consulta cuotas y gestiona el riesgo de forma responsable.',
  keywords: ['apuestas deportivas', 'análisis combinadas', 'simulador apuestas', 'cuotas deportivas'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${bebasNeue.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-950 text-white">
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  )
}
