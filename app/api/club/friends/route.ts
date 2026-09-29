import { NextRequest, NextResponse } from 'next/server'
import { getFriends, createFriend } from '@/lib/services/club.service'
import { cookies } from 'next/headers'
import { COOKIE_FRIEND_ID } from '@/lib/session'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const friends = await getFriends()
  // Mask PINs in public list
  const safeFriends = friends.map(f => ({
    id: f.id,
    name: f.name,
    avatarEmoji: f.avatarEmoji,
    hasPin: !!f.pin,
    createdAt: f.createdAt,
  }))
  return NextResponse.json(safeFriends)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, avatarEmoji, pin } = body
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 })
    }

    const friend = await createFriend(name, avatarEmoji, pin)

    // Set active session cookie
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_FRIEND_ID, friend.id, {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
    })

    return NextResponse.json({
      id: friend.id,
      name: friend.name,
      avatarEmoji: friend.avatarEmoji,
      hasPin: !!friend.pin,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error al crear amigo' }, { status: 500 })
  }
}
