import OpenAI from 'openai'
import type { AnalysisRequest, CombinedAnalysis } from '@/types/ai'

const FORBIDDEN_PHRASES = [
  'apuesta segura', 'garantizado', 'infalible', 'seguro', 'sin riesgo',
  'dinero fácil', 'recupera pérdidas', 'all in', 'gana seguro',
]

function sanitize(text: string): string {
  let t = text
  for (const phrase of FORBIDDEN_PHRASES) {
    t = t.replace(new RegExp(phrase, 'gi'), '[término no permitido]')
  }
  return t
}

function getClient() {
  const key = process.env.GROQ_API_KEY ?? process.env.OPENAI_API_KEY
  if (!key) throw new Error('No AI API key configured')

  const isGroq = key.startsWith('gsk_')
  return new OpenAI({
    apiKey: key,
    baseURL: isGroq ? 'https://api.groq.com/openai/v1' : undefined,
  })
}

const MODEL = process.env.GROQ_API_KEY ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini'

const SYSTEM_PROMPT = `Eres un analista deportivo objetivo para la plataforma "GañanesBets".
Tu función es analizar combinadas deportivas de forma RESPONSABLE.

REGLAS ESTRICTAS:
- NUNCA uses frases como "apuesta segura", "garantizado", "infalible", "gana seguro", "dinero fácil"
- SIEMPRE advierte que las predicciones pueden fallar
- Sé objetivo: señala tanto factores a favor como en contra
- Si no tienes datos suficientes sobre un evento, dilo explícitamente
- El análisis es ORIENTATIVO, no un consejo de inversión
- Responde SIEMPRE en español
- Devuelve SOLO JSON válido, sin markdown, sin explicaciones fuera del JSON`

export async function analyzeParlay(request: AnalysisRequest): Promise<CombinedAnalysis> {
  const client = getClient()

  const picksText = request.picks.map((p, i) =>
    `Pick ${i + 1}: ${p.event_name} | Liga: ${p.league} | Mercado: ${p.market} | Selección: ${p.selection} | Cuota: ${p.odds} | Prob. implícita: ${p.implied_probability}%`
  ).join('\n')

  const totalOdds = request.picks.reduce((acc, p) => acc * p.odds, 1)

  const userPrompt = `Analiza esta combinada deportiva:

${picksText}

Cuota total combinada: ${totalOdds.toFixed(2)}
Nivel de riesgo solicitado: ${request.risk_level}
Usuario premium: ${request.is_premium}

Devuelve un JSON con esta estructura EXACTA:
{
  "total_odds": number,
  "risk_level": "bajo" | "medio" | "alto",
  "global_risk_summary": "resumen del riesgo global en 2-3 frases",
  "picks_analysis": [
    {
      "event_name": "nombre del evento",
      "selection": "selección analizada",
      "odds": number,
      "reasoning": "análisis de 2-3 frases sobre este pick",
      "implied_probability": number,
      "factors_for": ["factor 1", "factor 2"],
      "factors_against": ["factor 1", "factor 2"],
      "why_it_can_fail": "razón principal por la que puede fallar",
      "confidence": "baja" | "media" | "alta"
    }
  ],
  ${request.is_premium ? `"discarded_picks": [],
  "alternatives": {
    "prudent": "descripción de alternativa más conservadora",
    "objective": "descripción de alternativa equilibrada",
    "aggressive": "descripción de alternativa más arriesgada"
  },` : ''}
  "disclaimer": "Las predicciones son orientativas y pueden fallar. Apostar implica riesgo de pérdida económica.",
  "no_data_warning": "mensaje si no tienes datos suficientes sobre algún evento, o null"
}`

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.4,
    max_tokens: 2000,
    response_format: { type: 'json_object' },
  })

  const raw = response.choices[0]?.message?.content ?? '{}'
  const parsed: CombinedAnalysis = JSON.parse(raw)

  // Sanitize all text fields
  parsed.global_risk_summary = sanitize(parsed.global_risk_summary)
  parsed.picks_analysis = parsed.picks_analysis.map(p => ({
    ...p,
    reasoning: sanitize(p.reasoning),
    why_it_can_fail: sanitize(p.why_it_can_fail),
    factors_for: p.factors_for.map(sanitize),
    factors_against: p.factors_against.map(sanitize),
  }))

  return parsed
}
