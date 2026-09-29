import { NextRequest, NextResponse } from 'next/server'
import { autoResolvePendingPicks } from '@/lib/services/club.service'

export async function GET(_req: NextRequest) {
  const result = await autoResolvePendingPicks()
  return NextResponse.json({ ok: true, ...result })
}

export async function POST(_req: NextRequest) {
  const result = await autoResolvePendingPicks()
  return NextResponse.json({ ok: true, ...result })
}
