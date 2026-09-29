import { NextRequest, NextResponse } from 'next/server'
import { adminDeletePick, resolvePick } from '@/lib/services/club.service'
import { getAdminFriend } from '@/lib/session'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const admin = await getAdminFriend()
  if (!admin) return NextResponse.json({ error: 'Solo para el admin' }, { status: 403 })

  const { id } = await params
  const { status } = await req.json().catch(() => ({}))
  if (status !== 'won' && status !== 'lost' && status !== 'pending') {
    return NextResponse.json({ error: 'Estado no válido' }, { status: 400 })
  }

  const ok = await resolvePick(id, status)
  if (!ok) return NextResponse.json({ error: 'Pick no encontrado' }, { status: 404 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const admin = await getAdminFriend()
  if (!admin) return NextResponse.json({ error: 'Solo para el admin' }, { status: 403 })

  const { id } = await params
  const ok = await adminDeletePick(id)
  if (!ok) return NextResponse.json({ error: 'Pick no encontrado' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
