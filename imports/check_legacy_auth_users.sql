-- Run in the NEW Supabase SQL Editor to check whether old Auth user IDs already exist.
select
  legacy.email,
  legacy.username,
  legacy.user_id,
  au.id is not null as auth_user_exists
from (values
  ('c1fb6215-8e0b-4b88-afac-2486a03e329c'::uuid, 'mbravob@gmail.com', 'mbravob'),
  ('83d84e97-7676-4ea1-a30e-d195dc67ce34'::uuid, 'mlieban3@xtec.cat', 'Mike'),
  ('d1492637-27b0-4279-85de-e9fecf57b2d9'::uuid, 'rekenas@gmail.com', 'rekenas'),
  ('004c046c-7af9-4051-a3d0-c9626351a705'::uuid, 'diekert@gmail.com', 'diekert'),
  ('062caa7e-0770-4e66-bed9-fc6787051f37'::uuid, 'isaac.llovera79@gmail.com', 'isaac.llovera79'),
  ('53d81582-cf97-4652-ad79-41f029301fdf'::uuid, 'shurlorito@gmail.com', 'shurlorito'),
  ('610d1485-9fa9-45cf-9dab-11cfd00e9275'::uuid, 'rastak.pinxo@gmail.com', 'rastak.pinxo'),
  ('68a83cbd-391d-4430-a5ee-32c58db12bb2'::uuid, 'joan.albornoz@gmail.com', 'joan.albornoz'),
  ('14915f3f-b191-4113-823c-9609f9e6c440'::uuid, 'mlieban3@gmail.com', 'mlieban3'),
  ('63e1b0ce-5e28-4679-88bf-5196406a822a'::uuid, 'queesunahipotenusa@gmail.com', 'queesunahipotenusa')
) as legacy(user_id, email, username)
left join auth.users au on au.id = legacy.user_id
order by auth_user_exists asc, legacy.email;
