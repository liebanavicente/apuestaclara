-- One pick per user per match
create unique index if not exists picks_user_description_unique
  on public.picks (user_id, description)
  where status != 'void';
