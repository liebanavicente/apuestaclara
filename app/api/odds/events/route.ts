import { getMultipleSportsEvents, FEATURED_SPORTS } from '@/lib/services/odds.service'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sports = searchParams.get('sports')?.split(',').filter(Boolean)
    ?? FEATURED_SPORTS.map(s => s.key)

  // Limit to 5 sports per call to save quota
  const keys = sports.slice(0, 5)

  try {
    const events = await getMultipleSportsEvents(keys)
    return NextResponse.json(events)
  } catch {
    return NextResponse.json({ error: 'No se han podido cargar cuotas reales ahora mismo.' }, { status: 500 })
  }
}
