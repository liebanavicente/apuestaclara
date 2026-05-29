create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  username text unique,
  avatar_url text,
  bio text,
  plan text not null default 'free' check (plan in ('free', 'premium')),
  role text not null default 'user' check (role in ('user', 'admin')),
  premium_forever boolean not null default false,
  premium_until timestamptz,
  daily_generations_used integer not null default 0,
  last_generation_reset date,
  personal_limit_amount numeric,
  responsible_mode_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists profiles_user_id_idx on public.profiles(user_id);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  _username text;
  _avatar text;
  _is_admin boolean;
begin
  -- derive username from email
  _username := split_part(new.email, '@', 1);
  -- ensure uniqueness
  if exists (select 1 from public.profiles where username = _username) then
    _username := _username || '_' || substr(new.id::text, 1, 6);
  end if;

  -- avatar from Google metadata
  _avatar := new.raw_user_meta_data->>'avatar_url';

  -- admin check
  _is_admin := new.email = 'mlieban3@gmail.com';

  insert into public.profiles (
    user_id, email, username, avatar_url,
    plan, role, premium_forever
  ) values (
    new.id,
    new.email,
    _username,
    _avatar,
    case when _is_admin then 'premium' else 'free' end,
    case when _is_admin then 'admin' else 'user' end,
    _is_admin
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
