import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { getFriend, type Friend } from './services/club.service'

export const COOKIE_FRIEND_ID = 'gb_friend_id'

const SESSION_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

// Friend ids with admin powers. Override with CLUB_ADMIN_IDS="id1,id2".
const DEFAULT_ADMIN_IDS = ['mike_i3bc']

function adminIds(): string[] {
  const env = process.env.CLUB_ADMIN_IDS
  return env ? env.split(',').map(s => s.trim()).filter(Boolean) : DEFAULT_ADMIN_IDS
}

// Admins must protect their profile with a PIN, otherwise anyone could pick it.
export function isClubAdmin(friend: Pick<Friend, 'id' | 'pin'> | null | undefined): boolean {
  return !!friend && !!friend.pin && adminIds().includes(friend.id)
}

function sessionSecret(): string {
  const secret = process.env.CLUB_SESSION_SECRET || process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  if (secret) return secret
  if (process.env.NODE_ENV === 'production') throw new Error('CLUB_SESSION_SECRET no configurado')
  return 'gananesbets-dev-secret'
}

function sign(friendId: string): string {
  return createHmac('sha256', sessionSecret()).update(friendId).digest('base64url')
}

function verify(friendId: string, signature: string): boolean {
  const expected = Buffer.from(sign(friendId))
  const given = Buffer.from(signature)
  return expected.length === given.length && timingSafeEqual(expected, given)
}

export async function setSessionCookie(friendId: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_FRIEND_ID, `${friendId}.${sign(friendId)}`, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_MAX_AGE,
    sameSite: 'lax',
  })
}

export async function getActiveFriend(): Promise<Friend | null> {
  try {
    const cookieStore = await cookies()
    const value = cookieStore.get(COOKIE_FRIEND_ID)?.value
    if (!value) return null

    const dot = value.lastIndexOf('.')
    if (dot === -1) {
      // Legacy unsigned cookie: only trusted for profiles without a PIN,
      // which anyone can select anyway. PIN profiles must log in again.
      const friend = await getFriend(value)
      return friend && !friend.pin ? friend : null
    }

    const friendId = value.slice(0, dot)
    if (!verify(friendId, value.slice(dot + 1))) return null
    return await getFriend(friendId)
  } catch {
    return null
  }
}

export async function getAdminFriend(): Promise<Friend | null> {
  const friend = await getActiveFriend()
  return isClubAdmin(friend) ? friend : null
}
