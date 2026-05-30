-- Add simulation mode to picks
alter table public.picks add column if not exists is_sim boolean not null default false;

-- Simulator leaderboard: ranked by net profit
create or replace view public.sim_leaderboard as
select
  pr.user_id,
  pr.username,
  pr.avatar_url,
  coalesce(sum(pk.profit) filter (where pk.status in ('won','lost')), 0) as net_profit,
  coalesce(sum(pk.stake) filter (where pk.status in ('won','lost')), 0) as total_staked,
  count(*) filter (where pk.status in ('won','lost')) as total_resolved,
  count(*) filter (where pk.status = 'won') as total_won,
  count(*) filter (where pk.status = 'pending') as total_pending,
  round(
    100.0 * count(*) filter (where pk.status = 'won')
    / nullif(count(*) filter (where pk.status in ('won','lost')), 0),
    1
  ) as win_rate
from public.profiles pr
left join public.picks pk on pk.user_id = pr.user_id and pk.is_sim = true
group by pr.user_id, pr.username, pr.avatar_url;

-- Update main leaderboard to exclude sim picks
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
left join public.picks pk on pk.user_id = pr.user_id and pk.is_sim = false
group by pr.user_id, pr.username, pr.avatar_url;
