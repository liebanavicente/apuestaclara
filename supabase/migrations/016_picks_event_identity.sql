alter table public.picks add column if not exists event_id text;
alter table public.picks add column if not exists sport_key text;
alter table public.picks add column if not exists market_key text default 'h2h';
alter table public.picks add column if not exists selection_key text;
alter table public.picks add column if not exists home_team text;
alter table public.picks add column if not exists away_team text;

create index if not exists picks_event_id_idx on public.picks(event_id);
create index if not exists picks_sport_key_idx on public.picks(sport_key);
create index if not exists picks_match_date_idx on public.picks(match_date);

alter table public.picks enable row level security;

drop policy if exists "picks_public_read" on public.picks;
drop policy if exists "picks_self_insert" on public.picks;
drop policy if exists "picks_self_delete_pending" on public.picks;

create policy "picks_public_read" on public.picks
  for select using (true);

create policy "picks_self_insert" on public.picks
  for insert with check (auth.uid() = user_id);

create policy "picks_self_delete_pending" on public.picks
  for delete using (auth.uid() = user_id and status = 'pending');
