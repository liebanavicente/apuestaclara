create table if not exists public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text,
  duration_days integer not null default 30,
  max_redemptions integer not null default 100,
  redemptions_count integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

create table if not exists public.promo_redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  promo_code_id uuid not null references public.promo_codes(id),
  redeemed_at timestamptz not null default now(),
  premium_until timestamptz not null,
  unique(user_id, promo_code_id)
);

-- Insert initial promo code
insert into public.promo_codes (code, description, duration_days, max_redemptions)
values ('PRUEBA1MES', 'Lanzamiento: 1 mes Premium gratis', 30, 100)
on conflict (code) do nothing;
