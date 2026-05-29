alter table public.picks add column if not exists legs jsonb;
-- legs format: [{description, selection, odds}] for combinadas
-- null = single pick
