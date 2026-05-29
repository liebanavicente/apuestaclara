create table if not exists public.virtual_wallets (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance numeric not null default 1000,
  starting_balance numeric not null default 1000,
  total_simulated_staked numeric not null default 0,
  total_simulated_profit numeric not null default 0,
  last_reset_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger virtual_wallets_updated_at
  before update on public.virtual_wallets
  for each row execute function public.handle_updated_at();

create table if not exists public.simulations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  simulation_type text not null default 'simple' check (simulation_type in ('simple', 'combinada')),
  status text not null default 'pending' check (status in ('pending', 'won', 'lost', 'void', 'cancelled')),
  total_odds numeric not null,
  virtual_stake numeric not null,
  potential_virtual_return numeric not null,
  potential_virtual_profit numeric not null,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.simulation_picks (
  id uuid primary key default gen_random_uuid(),
  simulation_id uuid not null references public.simulations(id) on delete cascade,
  sport_key text not null,
  sport_title text not null,
  league_name text,
  event_name text not null,
  commence_time timestamptz not null,
  market text not null,
  selection text not null,
  odds numeric not null,
  bookmaker text,
  status text not null default 'pending' check (status in ('pending', 'won', 'lost', 'void')),
  result_source text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists simulations_user_id_idx on public.simulations(user_id);
create index if not exists simulation_picks_simulation_id_idx on public.simulation_picks(simulation_id);
