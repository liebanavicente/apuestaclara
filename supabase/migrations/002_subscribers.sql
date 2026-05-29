create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  subscribed boolean not null default false,
  subscription_status text,
  price_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists subscribers_user_id_idx on public.subscribers(user_id);

create trigger subscribers_updated_at
  before update on public.subscribers
  for each row execute function public.handle_updated_at();
