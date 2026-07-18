-- Create placeholder Auth users for the legacy Gananesbets import.
-- Run this in the NEW Supabase SQL Editor before imports/import_legacy_profiles_picks.sql
-- if imports/check_legacy_auth_users.sql reports missing users.
--
-- These rows preserve the old user_id values so profiles and picks can keep their
-- original ownership. They are intentionally created with random passwords. If a
-- legacy player needs to sign in later, send a password recovery/invite from
-- Supabase Auth or let them authenticate with the configured provider.

begin;

create extension if not exists pgcrypto;

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values
  (
    '00000000-0000-0000-0000-000000000000'::uuid,
    'c1fb6215-8e0b-4b88-afac-2486a03e329c'::uuid,
    'authenticated',
    'authenticated',
    'mbravob@gmail.com',
    crypt(gen_random_uuid()::text, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"username":"mbravob"}'::jsonb,
    '2026-06-11 09:44:10.189188+00'::timestamptz,
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000'::uuid,
    '83d84e97-7676-4ea1-a30e-d195dc67ce34'::uuid,
    'authenticated',
    'authenticated',
    'mlieban3@xtec.cat',
    crypt(gen_random_uuid()::text, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"username":"Mike"}'::jsonb,
    '2026-07-15 23:04:46.324047+00'::timestamptz,
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000'::uuid,
    'd1492637-27b0-4279-85de-e9fecf57b2d9'::uuid,
    'authenticated',
    'authenticated',
    'rekenas@gmail.com',
    crypt(gen_random_uuid()::text, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"username":"rekenas"}'::jsonb,
    '2026-06-12 08:56:02.229828+00'::timestamptz,
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000'::uuid,
    '004c046c-7af9-4051-a3d0-c9626351a705'::uuid,
    'authenticated',
    'authenticated',
    'diekert@gmail.com',
    crypt(gen_random_uuid()::text, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"username":"diekert"}'::jsonb,
    '2026-05-29 20:42:11.052153+00'::timestamptz,
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000'::uuid,
    '062caa7e-0770-4e66-bed9-fc6787051f37'::uuid,
    'authenticated',
    'authenticated',
    'isaac.llovera79@gmail.com',
    crypt(gen_random_uuid()::text, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"username":"isaac.llovera79"}'::jsonb,
    '2026-06-11 12:18:42.75289+00'::timestamptz,
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000'::uuid,
    '53d81582-cf97-4652-ad79-41f029301fdf'::uuid,
    'authenticated',
    'authenticated',
    'shurlorito@gmail.com',
    crypt(gen_random_uuid()::text, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"username":"shurlorito"}'::jsonb,
    '2026-05-30 14:28:59.999373+00'::timestamptz,
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000'::uuid,
    '610d1485-9fa9-45cf-9dab-11cfd00e9275'::uuid,
    'authenticated',
    'authenticated',
    'rastak.pinxo@gmail.com',
    crypt(gen_random_uuid()::text, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"username":"rastak.pinxo"}'::jsonb,
    '2026-06-11 13:21:26.509951+00'::timestamptz,
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000'::uuid,
    '68a83cbd-391d-4430-a5ee-32c58db12bb2'::uuid,
    'authenticated',
    'authenticated',
    'joan.albornoz@gmail.com',
    crypt(gen_random_uuid()::text, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"username":"joan.albornoz"}'::jsonb,
    '2026-06-11 12:31:30.740803+00'::timestamptz,
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000'::uuid,
    '14915f3f-b191-4113-823c-9609f9e6c440'::uuid,
    'authenticated',
    'authenticated',
    'mlieban3@gmail.com',
    crypt(gen_random_uuid()::text, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"username":"mlieban3"}'::jsonb,
    '2026-05-29 11:28:58.188174+00'::timestamptz,
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000'::uuid,
    '63e1b0ce-5e28-4679-88bf-5196406a822a'::uuid,
    'authenticated',
    'authenticated',
    'queesunahipotenusa@gmail.com',
    crypt(gen_random_uuid()::text, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"username":"queesunahipotenusa"}'::jsonb,
    '2026-06-11 14:36:08.313023+00'::timestamptz,
    now()
  )
on conflict (id) do update
set
  email = excluded.email,
  updated_at = now();

commit;
