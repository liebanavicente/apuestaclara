import { NextRequest, NextResponse } from 'next/server'
import { deleteFriend, updateFriend } from '@/lib/services/club.service'
import { getAdminFriend } from '@/lib/session'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const admin = await getAdminFriend()
  if (!admin) return NextResponse.json({ error: 'Solo para el admin' }, { status: 403 })

  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const { name, avatarEmoji, pin, removePin } = body as {
    name?: string
    avatarEmoji?: string
    pin?: string
    removePin?: boolean
  }

  if (id === admin.id && removePin) {
    return NextResponse.json({ error: 'El admin tiene que mantener su PIN' }, { status: 400 })
  }
  if (pin !== undefined && pin.trim() && !/^\d{4,6}$/.test(pin.trim())) {
    return NextResponse.json({ error: 'El PIN debe tener entre 4 y 6 dígitos' }, { status: 400 })
  }

  try {
    const friend = await updateFriend(id, { name, avatarEmoji, pin: removePin ? null : pin })
    if (!friend) return NextResponse.json({ error: 'Amigo no encontrado' }, { status: 404 })
    return NextResponse.json({ id: friend.id, name: friend.name, avatarEmoji: friend.avatarEmoji, hasPin: !!friend.pin })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error al actualizar' }, { status: 400 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const admin = await getAdminFriend()
  if (!admin) return NextResponse.json({ error: 'Solo para el admin' }, { status: 403 })

  const { id } = await params
  if (id === admin.id) {
    return NextResponse.json({ error: 'No puedes eliminar tu propio perfil de admin' }, { status: 400 })
  }

  const ok = await deleteFriend(id)
  if (!ok) return NextResponse.json({ error: 'No se pudo eliminar' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
