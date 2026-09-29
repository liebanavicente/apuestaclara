import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { IntroSplash, INTRO_BOOT_SCRIPT } from '@/components/layout/IntroSplash'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'GañanesBets — Quien pierda paga las birras',
  description:
    'Club de pronósticos entre amigos sobre LaLiga y Champions League con cuotas reales. Sin dinero real: el último paga la ronda.',
}

export const viewport: Viewport = {
  themeColor: '#f5f5f7',
  colorScheme: 'light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the boot script adds intro classes to <html> before hydration
    <html lang="es" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_BOOT_SCRIPT }} />
        <link rel="preload" href="/img/bg-web.jpg" as="image" />
      </head>
      <body className="min-h-full bg-canvas text-ink">
        <IntroSplash />
        <div className="gb-mesh" aria-hidden="true" />
        <div className="relative z-10 min-h-full">
          <ErrorBoundary>{children}</ErrorBoundary>
        </div>
      </body>
    </html>
  )
}
