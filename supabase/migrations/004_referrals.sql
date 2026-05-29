create table if not exists public.referral_campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  active boolean not null default true,
  reward_days integer not null default 30,
  max_rewards integer not null default 100,
  rewards_given integer not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.referral_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  referral_code text not null unique,
  created_at timestamptz not null default now()
);

create unique index if not exists referral_links_user_id_idx on public.referral_links(user_id);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_user_id uuid not null references auth.users(id) on delete cascade,
  referred_user_id uuid not null references auth.users(id) on delete cascade,
  referral_code text not null,
  status text not null default 'pending' check (status in ('pending', 'validated', 'rejected')),
  reason text,
  created_at timestamptz not null default now(),
  validated_at timestamptz,
  unique(referred_user_id)
);

create table if not exists public.referral_rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  campaign_id uuid references public.referral_campaigns(id),
  reward_type text not null default 'premium_days',
  reward_days integer not null default 30,
  granted_at timestamptz not null default now(),
  premium_until timestamptz not null,
  reason text
);

-- Insert initial campaign
insert into public.referral_campaigns (name, slug, reward_days, max_rewards)
values ('Primeros 100 Embajadores', 'embajadores-lanzamiento', 30, 100)
on conflict (slug) do nothing;
