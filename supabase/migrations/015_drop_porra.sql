-- Revierte la porra de la gran final (funcionalidad cancelada: se hará
-- como página aparte). Deja la base de datos como si 012 y 014 nunca se
-- hubieran aplicado. Seguro de ejecutar aunque 014 no llegara a aplicarse.

drop index if exists public.picks_one_final_prediction_per_user;

alter table public.picks drop column if exists penalty_winner;
alter table public.picks drop column if exists goals_rival;
alter table public.picks drop column if exists goals_spain;
alter table public.picks drop column if exists pick_type;

drop table if exists public.final_match_info;

-- Restaura el comportamiento original de handle_new_user() (username
-- siempre derivado del email, sin display_name de signup).
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  _username text;
  _avatar text;
  _is_admin boolean;
begin
  _username := split_part(new.email, '@', 1);
  if exists (select 1 from public.profiles where username = _username) then
    _username := _username || '_' || substr(new.id::text, 1, 6);
  end if;

  _avatar := new.raw_user_meta_data->>'avatar_url';
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
