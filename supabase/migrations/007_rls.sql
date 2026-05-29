-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.subscribers enable row level security;
alter table public.promo_codes enable row level security;
alter table public.promo_redemptions enable row level security;
alter table public.referral_campaigns enable row level security;
alter table public.referral_links enable row level security;
alter table public.referrals enable row level security;
alter table public.referral_rewards enable row level security;
alter table public.saved_selections enable row level security;
alter table public.virtual_wallets enable row level security;
alter table public.simulations enable row level security;
alter table public.simulation_picks enable row level security;
alter table public.community_picks enable row level security;
alter table public.pick_votes enable row level security;
alter table public.pick_comments enable row level security;
alter table public.user_follows enable row level security;

-- profiles: public read for community, private write
create policy "profiles_public_read" on public.profiles for select using (true);
create policy "profiles_self_update" on public.profiles for update using (auth.uid() = user_id)
  with check (
    -- Prevent self-escalation of role/plan/premium_forever
    role = (select role from public.profiles where user_id = auth.uid()) and
    plan = (select plan from public.profiles where user_id = auth.uid()) and
    premium_forever = (select premium_forever from public.profiles where user_id = auth.uid())
  );
create policy "profiles_self_insert" on public.profiles for insert with check (auth.uid() = user_id);

-- subscribers: private
create policy "subscribers_self_read" on public.subscribers for select using (auth.uid() = user_id);
create policy "subscribers_self_insert" on public.subscribers for insert with check (auth.uid() = user_id);

-- promo_codes: anyone can read active codes
create policy "promo_codes_read" on public.promo_codes for select using (active = true);

-- promo_redemptions: private
create policy "promo_redemptions_self" on public.promo_redemptions for select using (auth.uid() = user_id);
create policy "promo_redemptions_insert" on public.promo_redemptions for insert with check (auth.uid() = user_id);

-- referral_campaigns: public read
create policy "referral_campaigns_read" on public.referral_campaigns for select using (active = true);

-- referral_links: self read/insert
create policy "referral_links_self" on public.referral_links for select using (auth.uid() = user_id);
create policy "referral_links_insert" on public.referral_links for insert with check (auth.uid() = user_id);

-- referrals: self read
create policy "referrals_self" on public.referrals for select using (
  auth.uid() = referrer_user_id or auth.uid() = referred_user_id
);
create policy "referrals_insert" on public.referrals for insert with check (auth.uid() = referred_user_id);

-- referral_rewards: self read
create policy "referral_rewards_self" on public.referral_rewards for select using (auth.uid() = user_id);

-- saved_selections: private
create policy "saved_selections_self" on public.saved_selections for all using (auth.uid() = user_id);

-- virtual_wallets: private
create policy "virtual_wallets_self" on public.virtual_wallets for all using (auth.uid() = user_id);

-- simulations: private
create policy "simulations_self" on public.simulations for all using (auth.uid() = user_id);

-- simulation_picks: private via simulation ownership
create policy "simulation_picks_self" on public.simulation_picks for select using (
  exists (select 1 from public.simulations s where s.id = simulation_id and s.user_id = auth.uid())
);
create policy "simulation_picks_insert" on public.simulation_picks for insert with check (
  exists (select 1 from public.simulations s where s.id = simulation_id and s.user_id = auth.uid())
);

-- community_picks: public read, self write
create policy "community_picks_read" on public.community_picks for select using (true);
create policy "community_picks_self_insert" on public.community_picks for insert with check (auth.uid() = user_id);
create policy "community_picks_self_update" on public.community_picks for update using (auth.uid() = user_id);
create policy "community_picks_self_delete" on public.community_picks for delete using (auth.uid() = user_id);

-- pick_votes: public read, self write, no self-vote enforced in app layer
create policy "pick_votes_read" on public.pick_votes for select using (true);
create policy "pick_votes_insert" on public.pick_votes for insert with check (
  auth.uid() = user_id and
  not exists (
    select 1 from public.community_picks cp where cp.id = pick_id and cp.user_id = auth.uid()
  )
);
create policy "pick_votes_delete" on public.pick_votes for delete using (auth.uid() = user_id);

-- pick_comments: public read, self write
create policy "pick_comments_read" on public.pick_comments for select using (true);
create policy "pick_comments_insert" on public.pick_comments for insert with check (auth.uid() = user_id);
create policy "pick_comments_delete" on public.pick_comments for delete using (auth.uid() = user_id);

-- user_follows: public read, self write
create policy "user_follows_read" on public.user_follows for select using (true);
create policy "user_follows_self" on public.user_follows for all using (auth.uid() = follower_id);
