import { NextRequest, NextResponse } from 'next/server'
import { getActiveFriend } from '@/lib/session'
import { createPick } from '@/lib/services/club.service'

export async function POST(req: NextRequest) {
  const friend = await getActiveFriend()
  if (!friend) {
    return NextResponse.json({ error: 'Debes seleccionar tu perfil para hacer un pick' }, { status: 401 })
  }

  const body = await req.json()
  const { description, competition, selection, odds, match_date } = body

  if (!description || !selection || !odds) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
  }

  const res = await createPick(friend.id, {
    description,
    competition: competition || 'La Liga',
    selection,
    odds: Number(odds),
    matchDate: match_date,
  })

  if (res.error) {
    return NextResponse.json({ error: res.error }, { status: 400 })
  }

  return NextResponse.json(res.pick)
}
