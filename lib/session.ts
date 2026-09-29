import { cookies } from 'next/headers'
import { getFriend, type Friend } from './services/club.service'

export const COOKIE_FRIEND_ID = 'gb_friend_id'

export async function getActiveFriend(): Promise<Friend | null> {
  try {
    const cookieStore = await cookies()
    const friendId = cookieStore.get(COOKIE_FRIEND_ID)?.value
    if (!friendId) return null
    return await getFriend(friendId)
  } catch {
    return null
  }
}
