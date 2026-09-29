import { HeaderWrapper } from '@/components/layout/HeaderWrapper'
import { Footer } from '@/components/layout/Footer'
import { getActiveFriend } from '@/lib/session'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const activeFriend = await getActiveFriend()

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWrapper friend={activeFriend} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
