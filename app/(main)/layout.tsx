import { HeaderWrapper } from '@/components/layout/HeaderWrapper'
import { Footer } from '@/components/layout/Footer'
import { getActiveFriend } from '@/lib/session'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const activeFriend = await getActiveFriend()

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 relative selection:bg-amber-100 selection:text-amber-900">
      <div className="gb-mesh" aria-hidden="true" />
      <div className="relative z-10 flex flex-col flex-1">
        <HeaderWrapper friend={activeFriend} />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}
