import { getSports } from '@/lib/services/odds.service'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const sports = await getSports()
    return NextResponse.json(sports)
  } catch {
    return NextResponse.json({ error: 'No se han podido cargar los deportes' }, { status: 500 })
  }
}
