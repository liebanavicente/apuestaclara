import { NextRequest, NextResponse } from 'next/server'
import { getFriend, getPinLockSeconds, registerPinFailure, clearPinFailures } from '@/lib/services/club.service'
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

    if (friend.pin) {
      const lockedFor = await getPinLockSeconds(friend.id)
      if (lockedFor > 0) {
        const minutes = Math.ceil(lockedFor / 60)
        return NextResponse.json(
          { error: `Demasiados intentos. Prueba de nuevo en ${minutes} min.` },
          { status: 429, headers: { 'Retry-After': String(lockedFor) } }
        )
      }
      if (friend.pin !== (typeof pin === 'string' ? pin.trim() : '')) {
        const left = await registerPinFailure(friend.id)
        const error = left > 0
          ? `PIN incorrecto. Te quedan ${left} ${left === 1 ? 'intento' : 'intentos'}.`
          : 'PIN incorrecto. Perfil bloqueado 15 min.'
        return NextResponse.json({ error }, { status: 401 })
      }
      await clearPinFailures(friend.id)
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
