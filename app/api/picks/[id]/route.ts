import { NextRequest, NextResponse } from 'next/server'
import { getActiveFriend } from '@/lib/session'
import { deletePick } from '@/lib/services/club.service'

export const dynamic = 'force-dynamic'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const friend = await getActiveFriend()
  if (!friend) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const ok = await deletePick(id, friend.id)
  if (!ok) {
    return NextResponse.json({ error: 'No se pudo eliminar el pick' }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
