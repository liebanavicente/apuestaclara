import { notFound } from 'next/navigation'
import { getFriends, getPicks, getLeaderboard } from '@/lib/services/club.service'
import { getAdminFriend } from '@/lib/session'
import { AdminClient, type AdminFriend, type AdminPick } from './AdminClient'

export const metadata = { title: 'Admin — GañanesBets' }
export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const admin = await getAdminFriend()
  if (!admin) notFound()

  const [friends, picks, leaderboard] = await Promise.all([getFriends(), getPicks(), getLeaderboard()])
  const statsById = new Map(leaderboard.map(p => [p.id, p]))

  const adminFriends: AdminFriend[] = friends.map(f => {
    const s = statsById.get(f.id)
    return {
      id: f.id,
      name: f.name,
      avatarEmoji: f.avatarEmoji,
      hasPin: !!f.pin,
      createdAt: f.createdAt,
      points: s?.totalPoints ?? 0,
      picks: (s?.totalResolved ?? 0) + (s?.totalPending ?? 0),
    }
  })

  const adminPicks: AdminPick[] = picks.map(p => ({
    id: p.id,
    friendId: p.friendId,
    friendName: p.friendName,
    description: p.description,
    competition: p.competition,
    selection: p.selection,
    odds: p.odds,
    status: p.status,
    points: p.points,
    matchDate: p.matchDate,
    createdAt: p.createdAt,
  }))

  return <AdminClient adminId={admin.id} friends={adminFriends} picks={adminPicks} />
}
