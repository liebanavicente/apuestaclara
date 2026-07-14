-- Porra de la gran final: predicción de marcador exacto (fila única de info + columnas en picks)

create table if not exists public.final_match_info (
  id int primary key default 1 check (id = 1),
  opponent_name text,
  opponent_flag text, -- emoji de bandera, ej. 🇦🇷 (null hasta que se confirme el rival)
  kickoff_at timestamptz not null default '2026-07-19T20:00:00Z',
  -- resultado real, usado para resolver los pronósticos (ver lib/porra.ts):
  -- marcador tras la prórroga y antes de la tanda de penaltis
  actual_goals_spain int check (actual_goals_spain between 0 and 9),
  actual_goals_rival int check (actual_goals_rival between 0 and 9),
  actual_penalty_winner text check (actual_penalty_winner in ('espana', 'rival')),
  resolved_at timestamptz
);
insert into public.final_match_info (id) values (1) on conflict (id) do nothing;

alter table public.picks add column if not exists pick_type text not null default 'normal'
  check (pick_type in ('normal', 'final_prediction'));
alter table public.picks add column if not exists goals_spain int check (goals_spain between 0 and 9);
alter table public.picks add column if not exists goals_rival int check (goals_rival between 0 and 9);
alter table public.picks add column if not exists penalty_winner text check (penalty_winner in ('espana', 'rival'));

-- Un único pronóstico de la final por usuario (se edita in-place, nunca se duplica)
create unique index if not exists picks_one_final_prediction_per_user
  on public.picks(user_id) where (pick_type = 'final_prediction');
