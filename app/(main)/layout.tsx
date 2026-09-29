import { HeaderWrapper } from '@/components/layout/HeaderWrapper'
import { Footer } from '@/components/layout/Footer'
import { getActiveFriend, isClubAdmin } from '@/lib/session'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const activeFriend = await getActiveFriend()

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWrapper friend={activeFriend} isAdmin={isClubAdmin(activeFriend)} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
