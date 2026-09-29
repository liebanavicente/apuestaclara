import { NextRequest, NextResponse } from 'next/server'
import { getFriend } from '@/lib/services/club.service'
import { setSessionCookie } from '@/lib/session'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { friendId, pin } = await req.json()
    if (!friendId) {
      return NextResponse.json({ error: 'Falta friendId' }, { status: 400 })
    }

    const friend = await getFriend(friendId)
    if (!friend) {
      return NextResponse.json({ error: 'Amigo no encontrado' }, { status: 404 })
    }

    if (friend.pin && friend.pin !== pin?.trim()) {
      return NextResponse.json({ error: 'PIN incorrecto' }, { status: 401 })
    }

    await setSessionCookie(friend.id)

    return NextResponse.json({
      id: friend.id,
      name: friend.name,
      avatarEmoji: friend.avatarEmoji,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error en login' }, { status: 500 })
  }
}
