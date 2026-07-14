-- Backfill admin/premium_forever for the owner account.
-- handle_new_user() only sets role='admin' at signup time; accounts created
-- before that logic existed (or before the email check was added) never got it.
update public.profiles
set role = 'admin', premium_forever = true, plan = 'premium'
where email = 'mlieban3@gmail.com' and (role <> 'admin' or premium_forever <> true);
