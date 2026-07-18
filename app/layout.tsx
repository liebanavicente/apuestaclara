import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'ApuestaClara — Analiza. Compara. Decide mejor.',
  description:
    'Herramienta de análisis orientativo de combinadas deportivas. Simula apuestas sin dinero real, consulta cuotas y gestiona el riesgo de forma responsable.',
  keywords: ['apuestas deportivas', 'análisis combinadas', 'simulador apuestas', 'cuotas deportivas'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-carbon text-white">
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  )
}
