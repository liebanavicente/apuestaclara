create table if not exists public.saved_selections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  total_odds numeric,
  implied_probability numeric,
  risk_level text,
  picks jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create table if not exists public.community_picks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  sport text not null,
  competition text not null,
  event_name text not null,
  market text not null,
  selection text not null,
  odds numeric not null,
  bookmaker text,
  event_time timestamptz not null,
  stake_level text not null check (stake_level in ('bajo', 'medio', 'alto')),
  confidence_level text not null check (confidence_level in ('baja', 'media', 'alta')),
  reasoning text not null,
  risks text not null,
  status text not null default 'pendiente' check (status in ('pendiente', 'acertado', 'fallado', 'nulo', 'cancelado')),
  result_declared_by_user boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger community_picks_updated_at
  before update on public.community_picks
  for each row execute function public.handle_updated_at();

create table if not exists public.pick_votes (
  id uuid primary key default gen_random_uuid(),
  pick_id uuid not null references public.community_picks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  vote_type text not null check (vote_type in ('good', 'risky')),
  created_at timestamptz not null default now(),
  unique(pick_id, user_id)
);

create table if not exists public.pick_comments (
  id uuid primary key default gen_random_uuid(),
  pick_id uuid not null references public.community_picks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  comment text not null,
  reported boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.user_follows (
  follower_id uuid not null references auth.users(id) on delete cascade,
  followed_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, followed_id)
);

create index if not exists community_picks_user_id_idx on public.community_picks(user_id);
create index if not exists community_picks_status_idx on public.community_picks(status);
create index if not exists pick_votes_pick_id_idx on public.pick_votes(pick_id);
create index if not exists pick_comments_pick_id_idx on public.pick_comments(pick_id);
