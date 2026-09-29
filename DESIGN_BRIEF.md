# GañanesBets — Design Brief para Rediseño

## Contexto del producto

**GañanesBets** es una app de competición de picks deportivos para un grupo cerrado de amigos ("los Gañanes"). El concepto: haces picks 1/X/2 en partidos reales del Mundial 2026 con cuotas reales. Si aciertas sumas la cuota en puntos. Al final (19 julio 2026), el último del ranking paga las birras.

**Tono de marca:** cachondo, directo, entre amigos. Nada de SaaS serio. Emojis, lenguaje coloquial, humor.

**Stack técnico:** Next.js 16 App Router, Tailwind CSS v4, Supabase, desplegado en Vercel.
**URL producción:** `gananesbets.vercel.app`

---

## Identidad visual actual

### Colores base
```
Background:      #020617  (slate-950)
Surface cards:   #0f172a  (slate-900)
Border:          #1e293b  (slate-800)
Text primary:    #f1f5f9  (slate-100)
Text secondary:  #94a3b8  (slate-400)
Text muted:      #475569  (slate-600)

Accent primary:  #eab308  (yellow-500)  ← color principal de la marca
Accent hover:    #facc15  (yellow-400)
Green won:       #4ade80  (green-400)
Red lost:        #f87171  (red-400)
```

### Tipografía
- **Fuente única:** Inter (system fallback: `system-ui, sans-serif`)
- Headings: `font-black` (900)
- Subheadings: `font-bold` (700)
- Body: `font-normal` / `font-semibold`
- Tamaños frecuentes: `text-xs`, `text-sm`, `text-base`, `text-xl`, `text-2xl`, `text-4xl`, `text-6xl`

### Radios y espaciado
- Cards: `rounded-xl` (12px)
- Botones grandes: `rounded-xl`
- Botones pequeños: `rounded-md` / `rounded-lg`
- Pills/badges: `rounded-full`
- Padding cards: `p-4` / `p-5` / `p-6`
- Gap entre elementos: `gap-2` / `gap-3` / `gap-4`

---

## Logo y assets

- **Logo:** `/public/gananesbetslogo.jpg` — imagen JPG del logo
- **Emoji mascota:** 🐟 (el "gañán")
- **Taglines rotativas:**
  - "quien pierda paga unas birras"
  - "apuestas ficticias, birras reales"
  - "aquí se viene a perder con estilo"
  - "el último paga la ronda"
  - "birras o gloria, no hay más opciones"

---

## Estructura de la app

### Navegación (Header sticky)
```
🐟 GañanesBets    [tagline rotativa]
⚽ Partidos | 🌍 Mundial | 🏆 Ranking | 🎲 Simulador | 📋 Reglas | 🔧 Herramientas
                                                    [usuario dropdown / Únete 🐟]
```
- **Mobile:** hamburger menu lateral
- **Active link:** `text-yellow-400 bg-yellow-400/10`
- **Idle link:** `text-slate-400 hover:text-white`

### Rutas principales
| Ruta | Función |
|------|---------|
| `/` | Landing pública |
| `/login` | Login email + password |
| `/register` | Registro sin confirmación de email |
| `/dashboard` | Lista de partidos con picks 1X2 |
| `/mundial` | Partidos por grupo A-L con tabs/select |
| `/ranking` | Podio top 3 + tabla completa |
| `/sim` | Simulador con más deportes y ranking separado |
| `/reglas` | Countdown al 19 jul + reglas del juego |
| `/herramientas` | Links a generador, simulador, búsqueda |
| `/generador` | Generador de combinadas automático |
| `/admin/resolver` | Panel admin para resolver picks |

---

## Componentes clave

### Header
```tsx
// sticky top-0, border-b border-yellow-500/20, bg-slate-950/95 backdrop-blur-sm
// Logo: emoji 🐟 + "GañanesBets" + tagline en amarillo
// Nav activo: text-yellow-400 bg-yellow-400/10
// CTA: bg-yellow-500 text-slate-950 font-black
```

### Pick buttons (1 / X / 2)
```tsx
// Grid 3 columnas
// Estado normal:    border-slate-700 bg-slate-800
// Hover:           border-yellow-500/50 bg-yellow-500/10
// Seleccionado:    border-yellow-400 bg-yellow-400/20 ring-1 ring-yellow-400/40
// Pick confirmado: border-yellow-500/60 bg-yellow-500/15 cursor-default
// Pick ajeno:      opacity-30 cursor-default
// 
// Contenido del botón:
//   [código FIFA o abreviatura]   ← text-xs font-bold text-slate-400
//   [cuota: 2.10]                 ← font-black text-sm text-yellow-400
```

### Cards de partido
```tsx
// rounded-xl border p-3.5
// Con pick:     border-yellow-500/30 bg-yellow-500/5
// Staging:      border-yellow-500/20 bg-slate-900
// Sin pick:     border-slate-800 bg-slate-900/60
//
// Badge de resultado:
//   Ganado:   bg-green-500/20 text-green-400   "+2.10 pts ✓"
//   Perdido:  bg-red-500/20 text-red-400       "0 pts ✗"
//   Pendiente: bg-yellow-500/20 text-yellow-400 "✓ ESP @ 1.85"
```

### Confirm bar (después de seleccionar)
```tsx
// Aparece debajo de los botones al hacer click
// Muestra: selección + cuota + puntos potenciales
// Botones: [Cancelar] [Confirmar ✓]
// + botón "Analizar con IA" (expande panel QuickAI)
```

### QuickAI panel
```tsx
// Se expande inline al pulsar "Analizar con IA"
// Muestra: veredicto badge + resumen + pros/contras + disclaimer
// Veredictos: favorable (green) / dudoso (yellow) / arriesgado (red)
// Powered by: Groq / llama-3.3-70b
```

### Ranking
```tsx
// Top 3: podio visual con medallas 🥇🥈🥉
// Tabla: posición | username | puntos | picks | tasa acierto
// El último resaltado (el que paga birras)
```

### Toast de pick confirmado
```tsx
// Modal overlay tras confirmar pick
// Avisa: "solo una vez, a la cuota actual, no se puede cambiar"
// Checkbox "No volver a mostrar" → localStorage
```

---

## Patrones de diseño actuales

### Fondo global
```css
background-color: #020617; /* slate-950 */
/* Sin patterns adicionales */
```

### Cards estándar
```
border border-slate-800 bg-slate-900/50 rounded-xl
```

### Botón primario (CTA)
```
bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black rounded-xl
```

### Botón secundario
```
border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white rounded-xl
```

### Botón destructivo / alerta
```
text-red-400 hover:text-red-300
```

### Badges de estado
```
Pendiente: bg-yellow-500/20 text-yellow-400
Ganado:    bg-green-500/20 text-green-400
Perdido:   bg-red-500/20 text-red-400
En juego:  borde verde + pulse animation
```

### Sección headers
```
text-xs font-bold text-slate-500 uppercase tracking-widest
```

---

## Lo que NO cambiar

- **Rutas y lógica de negocio** — solo estilos visuales
- **Componentes de picks** — la interacción 1X2 debe quedar igual
- **Emojis en la navegación** — son parte de la identidad
- **Taglines** — inamovibles, definen el tono
- **El pez 🐟** — el mascota del grupo

---

## Lo que sí se puede mejorar

- **Consistencia visual** entre páginas (algunas tienen estilos mezclados)
- **Jerarquía tipográfica** — más clara entre headings, subheadings, body, labels
- **Mobile UX** — spacing y tamaños táctiles más generosos
- **Estados de hover/focus** — más expresivos y cohesivos
- **Glassmorphism opcional** — el diseño de referencia usaba `backdrop-blur` en cards, puede quedar bien con la base slate-950
- **El ranking** — podio mejorable visualmente
- **Landing (/)** — es la que más margen de mejora tiene

---

## Referencia visual rechazada

Se probó un rediseño con glassmorphism + colores teal/emerald (inspirado en un mockup externo) y **no gustó**. El amarillo-negro-slate es la paleta correcta para este producto.

---

## Archivos relevantes

```
app/
  (main)/
    page.tsx              ← Landing
    dashboard/
      DashboardClient.tsx ← Vista principal de partidos
    mundial/
      MundialClient.tsx   ← Grupos A-L
      groups.ts           ← Datos de grupos y códigos FIFA
    ranking/
      page.tsx            ← Ranking con podio
    sim/
      SimClient.tsx       ← Simulador de picks
    reglas/
      page.tsx            ← Reglas y countdown

components/
  layout/
    Header.tsx            ← Navegación global
  picks/
    QuickAI.tsx           ← Panel de análisis IA inline
    PickConfirmedToast.tsx ← Modal de confirmación

app/globals.css           ← Estilos globales (Tailwind v4)
public/
  gananesbetslogo.jpg     ← Logo de la app
```

---

## Paleta propuesta para rediseño (mantener base, refinar)

Si se va a proponer una paleta refinada, debe mantenerse dentro de:

| Rol | Color actual | Rango aceptable |
|-----|-------------|-----------------|
| Background | `#020617` | Mantener oscuro puro |
| Surface | `#0f172a` | slate-900 range |
| Border | `#1e293b` | slate-800 range |
| **Accent** | `#eab308` (yellow) | **No cambiar — identidad de marca** |
| Text | `#f1f5f9` | Mantener blanco/near-white |
| Won | `#4ade80` | Verde — puede refinarse |
| Lost | `#f87171` | Rojo — puede refinarse |

El amarillo es la identidad del grupo. Cualquier propuesta con otro accent color (teal, purple, blue) será rechazada.
