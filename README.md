# Gañanesbets

Plataforma de competición social de picks deportivos, ranking y análisis responsable.

**Analiza. Compara. Decide mejor.**

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS
- Supabase (auth + DB + RLS)
- Stripe (suscripción Premium)
- The Odds API (cuotas deportivas reales)
- OpenAI (análisis IA)
- Vercel (deploy)

## Instalación

```bash
npm install
cp .env.local.example .env.local
# Rellenar variables en .env.local
npm run dev
```

## Migraciones Supabase

Ejecutar en orden en SQL Editor de Supabase:
1. `supabase/migrations/001_profiles.sql`
2. `supabase/migrations/002_subscribers.sql`
3. `supabase/migrations/003_promos.sql`
4. `supabase/migrations/004_referrals.sql`
5. `supabase/migrations/005_simulator.sql`
6. `supabase/migrations/006_community.sql`
7. `supabase/migrations/007_rls.sql`
8. `supabase/migrations/008_generation_logs.sql`
9. `supabase/migrations/009_picks_competition.sql`
10. `supabase/migrations/010_picks_legs.sql`
11. `supabase/migrations/011_picks_points.sql`
12. `supabase/migrations/013_backfill_admin.sql`
13. `supabase/migrations/015_drop_porra.sql`

## Importación histórica

Los datos del proyecto anterior están preparados en:

- `imports/create_legacy_auth_users.sql`
- `imports/import_legacy_profiles_picks.sql`
- `imports/migration-report.md`
- `imports/check_legacy_auth_users.sql`

Flujo recomendado:

1. Ejecuta `imports/check_legacy_auth_users.sql` en el SQL Editor del proyecto nuevo.
2. Si falta algún usuario, ejecuta `imports/create_legacy_auth_users.sql` para crear usuarios Auth placeholder con los UUID antiguos.
3. Ejecuta `imports/import_legacy_profiles_picks.sql`.
4. Abre `/ranking`; debería mostrar el ranking histórico calculado desde `picks.points`.

El import enlaza `profiles.user_id` y `picks.user_id` con `auth.users.id`, así que fallará si esos usuarios no existen. Los usuarios placeholder tienen contraseña aleatoria; si alguien necesita entrar con ese usuario histórico, envía recuperación/invitación desde Supabase Auth.

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anon pública |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave service_role (solo servidor) |
| `THE_ODDS_API_KEY` | API key de The Odds API |
| `CRON_SECRET` | Secreto para proteger el cron `/api/admin/auto-resolve` |
| `OPENAI_API_KEY` | API key de OpenAI |
| `STRIPE_SECRET_KEY` | Clave secreta Stripe |
| `STRIPE_WEBHOOK_SECRET` | Secret webhooks Stripe |
| `STRIPE_PREMIUM_PRICE_ID` | Price ID del plan 4,99 €/mes |
| `NEXT_PUBLIC_SITE_URL` | URL pública (ej: https://apuestaclara.com) |

## Configuración Supabase

1. Crear proyecto en supabase.com
2. Ejecutar migraciones SQL en orden
3. Authentication → Providers → Google → activar
4. Authentication → URL Configuration:
   - Site URL: tu dominio
   - Redirect URL: `https://tu-dominio.com/api/auth/callback`

## Configuración Stripe

1. Crear producto "Apuesta Clara Premium" — 4,99 €/mes
2. Copiar Price ID a `STRIPE_PREMIUM_PRICE_ID`
3. Webhook → `https://tu-dominio.com/api/stripe/webhooks`
4. Eventos: `checkout.session.completed`, `customer.subscription.*`

## Cuenta admin

El email `mlieban3@gmail.com` recibe automáticamente role admin + premium_forever.  
Si falla: ir a `/admin/debug-auth` → "Reparar mi perfil".

## Auto-resolve diario

Vercel ejecuta `/api/admin/auto-resolve` a las 00:00 y 01:00 UTC. El endpoint solo resuelve cuando en `Europe/Madrid` son las 02:00, así que mantiene la hora local correcta tanto en horario de verano como de invierno. Configura en Vercel `THE_ODDS_API_KEY`, `CRON_SECRET` y las variables de Supabase para que pueda resolver picks pendientes automáticamente.

## Fases

- **Fase 1** ✅ Estructura, auth, perfiles, admin, landing, navegación
- **Fase 2** The Odds API, buscador de eventos, generador básico
- **Fase 3** IA de análisis y combinadas mixtas
- **Fase 4** Simulador sin dinero
- **Fase 5** Comunidad de picks
- **Fase 6** Stripe Premium completo
- **Fase 7** Promos, referidos y pulido final

## Aviso legal

Solo mayores de 18 años. Las predicciones son orientativas. Apostar implica riesgo.
