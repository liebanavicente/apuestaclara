import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' })

export const metadata: Metadata = {
  title: 'GañanesBets — Predicciones de fútbol con datos',
  description:
    'Plataforma de predicciones de fútbol impulsada por datos. Analiza partidos del Mundial y la Champions, compite con tu grupo y mide tu rendimiento. Sin dinero real.',
  keywords: ['predicciones fútbol', 'análisis deportivo', 'mundial', 'champions', 'estadísticas fútbol', 'quiniela'],
  generator: 'v0.app',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0b1220',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased bg-background`}>
      <body className="min-h-full bg-background text-foreground font-sans">
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  )
}
