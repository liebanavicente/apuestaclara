import { NextRequest, NextResponse } from 'next/server'
import { getFriends, createFriend, deleteFriend } from '@/lib/services/club.service'
import { cookies } from 'next/headers'
import { COOKIE_FRIEND_ID, setSessionCookie, getAdminFriend } from '@/lib/session'

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

    await setSessionCookie(friend.id)

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

export async function DELETE(req: NextRequest) {
  try {
    const admin = await getAdminFriend()
    if (!admin) {
      return NextResponse.json({ error: 'Solo el admin puede eliminar perfiles' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Falta id de amigo' }, { status: 400 })
    }
    if (id === admin.id) {
      return NextResponse.json({ error: 'No puedes eliminar tu propio perfil de admin' }, { status: 400 })
    }

    await deleteFriend(id)

    // If currently logged in as this friend, clear cookie
    const cookieStore = await cookies()
    if (cookieStore.get(COOKIE_FRIEND_ID)?.value?.split('.')[0] === id) {
      cookieStore.delete(COOKIE_FRIEND_ID)
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error al eliminar amigo' }, { status: 500 })
  }
}
