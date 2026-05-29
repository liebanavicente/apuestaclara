-- Add points column: when won = odds, when lost = 0
alter table public.picks add column if not exists points numeric default 0;

-- Make stake optional (default 1, irrelevant in points mode)
alter table public.picks alter column stake set default 1;

-- Update bankrolls view to also show points ranking
create or replace view public.leaderboard as
select
  pr.user_id,
  pr.username,
  pr.avatar_url,
  coalesce(sum(pk.points) filter (where pk.status in ('won','lost')), 0) as total_points,
  count(*) filter (where pk.status in ('won','lost')) as total_resolved,
  count(*) filter (where pk.status = 'won') as total_won,
  count(*) filter (where pk.status = 'pending') as total_pending,
  round(
    100.0 * count(*) filter (where pk.status = 'won')
    / nullif(count(*) filter (where pk.status in ('won','lost')), 0),
    1
  ) as win_rate
from public.profiles pr
left join public.picks pk on pk.user_id = pr.user_id
group by pr.user_id, pr.username, pr.avatar_url;
