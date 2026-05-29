create table if not exists generation_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('parlay', 'ai_analysis')),
  picks_count int,
  created_at timestamptz default now()
);

create index generation_logs_user_date on generation_logs (user_id, created_at);

alter table generation_logs enable row level security;

create policy "Users can read own logs"
  on generation_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own logs"
  on generation_logs for insert
  with check (auth.uid() = user_id);
