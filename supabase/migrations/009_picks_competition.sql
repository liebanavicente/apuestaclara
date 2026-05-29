create table if not exists public.picks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  -- what the pick is about
  description text not null,         -- "Real Madrid gana al Barça"
  competition text,                   -- "La Liga", "Champions", etc.
  match_date timestamptz,            -- cuándo es el partido
  -- bet details
  selection text not null,           -- lo que apuestas
  odds numeric not null check (odds > 1),
  stake numeric not null check (stake > 0),
  -- result
  status text not null default 'pending' check (status in ('pending', 'won', 'lost', 'void')),
  profit numeric,                    -- calculado al resolver: stake*(odds-1) o -stake
  resolved_at timestamptz,
  -- meta
  note text,                         -- comentario opcional del usuario
  created_at timestamptz not null default now()
);

create index if not exists picks_user_id_idx on public.picks(user_id);
create index if not exists picks_status_idx on public.picks(status);
create index if not exists picks_created_at_idx on public.picks(created_at desc);

-- View: bankroll por usuario (base 1000 + suma de profits)
create or replace view public.bankrolls as
select
  p.user_id,
  pr.username,
  pr.avatar_url,
  1000 + coalesce(sum(pk.profit) filter (where pk.status in ('won','lost')), 0) as bankroll,
  count(*) filter (where pk.status in ('won','lost')) as total_resolved,
  count(*) filter (where pk.status = 'won') as total_won,
  count(*) filter (where pk.status = 'pending') as total_pending,
  round(
    100.0 * count(*) filter (where pk.status = 'won')
    / nullif(count(*) filter (where pk.status in ('won','lost')), 0),
    1
  ) as win_rate
from public.profiles pr
left join public.picks pk on pk.user_id = pr.user_id
group by pr.user_id, pr.username, pr.avatar_url;
