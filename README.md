# GañanesBets 🐟

Club de pronósticos entre amigos. Haces picks 1 / X / 2 en partidos de LaLiga y Champions con cuotas reales: si aciertas, sumas la cuota en puntos. Sin dinero real — el último del ranking paga las birras.

Producción: https://gananesbets.vercel.app (push a `main` → deploy automático en Vercel).

## Stack

- Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind CSS v4
- Vercel KV / Upstash Redis para amigos y picks (`lib/services/club.service.ts`)
  - Sin credenciales KV usa un almacén local en `.data/club.json` (ignorado por git)
- The Odds API para cuotas y resultados (`lib/services/odds.service.ts`)
- Groq (llama-3.3-70b) u OpenAI para el análisis rápido de un pick (`/api/ai/quick`)

## Desarrollo

```bash
npm install
cp .env.local.example .env.local   # rellenar lo que necesites
npm run dev
```

Para probar sin tocar datos reales, deja vacías las variables `KV_*`: se usará el almacén local.

## Rutas

| Ruta | Qué es |
|------|--------|
| `/` | Landing (con vídeo de bienvenida una vez por sesión) |
| `/dashboard` | Partidos y picks |
| `/ranking` | Clasificación |
| `/reglas` | Reglas del club |
| `/admin` | Panel del admin: amigos, picks, resolución manual |

## Sesión y admin

- Cada amigo elige su perfil (PIN opcional). La sesión es la cookie `gb_friend_id` firmada con HMAC.
- 5 PIN fallidos bloquean el perfil 15 min.
- Admin: ids en `CLUB_ADMIN_IDS` (por defecto Mike, `mike_i3bc`). El admin necesita PIN.
- El cron diario (`vercel.json`) llama a `/api/admin/auto-resolve` con `CRON_SECRET`.

## Diseño

Estilo claro, minimalista, cristal tipo Apple. Tokens y componentes (`gb-card`, `gb-btn`, `gb-chip`, `gb-segmented`…) en `app/globals.css`.

- **Color principal: ámbar** (identidad de marca). **Secundario: verde victoria** (hovers, aciertos).
- Tono cachondo y entre amigos; el pez 🐟 es la mascota. Emojis bienvenidos.
