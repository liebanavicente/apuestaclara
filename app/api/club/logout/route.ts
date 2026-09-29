import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { COOKIE_FRIEND_ID } from '@/lib/session'

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_FRIEND_ID)
  return NextResponse.json({ ok: true })
}
