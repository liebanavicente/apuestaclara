create table if not exists public.porra_picks (
  id uuid primary key default gen_random_uuid(),
  match_id text not null,                          -- 'esp-fra-sf-2026'
  user_id uuid not null references auth.users(id) on delete cascade,
  home_goals int not null check (home_goals >= 0 and home_goals <= 20),
  away_goals int not null check (away_goals >= 0 and away_goals <= 20),
  created_at timestamptz not null default now(),
  -- un resultado por partido (nadie puede repetir)
  unique (match_id, home_goals, away_goals),
  -- un pick por usuario por partido
  unique (match_id, user_id)
);

-- RLS
alter table public.porra_picks enable row level security;

-- Cualquiera autenticado puede leer todos los picks (para ver quién cogió qué)
create policy "porra_select" on public.porra_picks
  for select using (true);

-- Solo el propio usuario puede insertar
create policy "porra_insert" on public.porra_picks
  for insert with check (auth.uid() = user_id);

-- Solo el propio usuario puede borrar (para cambiar de resultado)
create policy "porra_delete" on public.porra_picks
  for delete using (auth.uid() = user_id);

-- Índice para queries por match
create index if not exists porra_picks_match_id_idx on public.porra_picks(match_id);
