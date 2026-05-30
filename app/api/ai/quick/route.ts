import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

function getClient() {
  const key = process.env.GROQ_API_KEY ?? process.env.OPENAI_API_KEY
  if (!key) throw new Error('No AI key')
  return new OpenAI({
    apiKey: key,
    baseURL: key.startsWith('gsk_') ? 'https://api.groq.com/openai/v1' : undefined,
  })
}

const MODEL = process.env.GROQ_API_KEY ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini'

export async function POST(req: NextRequest) {
  const { event, league, selection, odds } = await req.json()
  if (!event || !selection || !odds) return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })

  const impliedProb = Math.round((1 / odds) * 100)

  const prompt = `Analiza brevemente este pick deportivo en el simulador:

Partido: ${event}
Competición: ${league ?? 'desconocida'}
Selección: ${selection}
Cuota: ${odds} (probabilidad implícita: ${impliedProb}%)

Responde en JSON con esta estructura exacta:
{
  "verdict": "favorable" | "dudoso" | "arriesgado",
  "summary": "2-3 frases resumiendo los factores clave. Objetivo, sin prometer nada.",
  "pros": ["factor positivo 1", "factor positivo 2"],
  "cons": ["factor negativo 1", "factor negativo 2"],
  "disclaimer": "frase corta recordando que es orientativo y puede fallar"
}

Sé conciso. Responde SOLO el JSON, sin markdown.`

  try {
    const client = getClient()
    const res = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: 'Eres un analista deportivo objetivo. Responde SOLO JSON válido, en español, sin markdown.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 400,
    })

    const text = res.choices[0]?.message?.content?.trim() ?? ''
    const json = JSON.parse(text)
    return NextResponse.json(json)
  } catch (err) {
    return NextResponse.json({ error: 'Error al generar análisis' }, { status: 500 })
  }
}
