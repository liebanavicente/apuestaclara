-- Permite pasar un nombre visible al crear la cuenta (usado por el alta
-- rápida por magic link de la porra: solo nombre + email, sin contraseña).
-- Si no se proporciona, se mantiene el comportamiento anterior (derivarlo
-- del email).
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  _username text;
  _avatar text;
  _is_admin boolean;
begin
  _username := nullif(trim(new.raw_user_meta_data->>'display_name'), '');
  if _username is null then
    _username := split_part(new.email, '@', 1);
  end if;

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
