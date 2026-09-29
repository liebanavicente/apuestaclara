import { NextRequest, NextResponse } from 'next/server'
import { autoResolvePendingPicks } from '@/lib/services/club.service'
import { getAdminFriend } from '@/lib/session'

export const dynamic = 'force-dynamic'

// Vercel Cron sends `Authorization: Bearer $CRON_SECRET`; the admin panel uses the session.
async function authorized(req: NextRequest): Promise<boolean> {
  const secret = process.env.CRON_SECRET
  if (secret && req.headers.get('authorization') === `Bearer ${secret}`) return true
  return !!(await getAdminFriend())
}

async function run(req: NextRequest) {
  if (!(await authorized(req))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const result = await autoResolvePendingPicks()
  return NextResponse.json({ ok: true, ...result })
}

export const GET = run
export const POST = run
