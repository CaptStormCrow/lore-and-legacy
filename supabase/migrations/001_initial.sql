-- ============================================================
-- LORE & LEGACY — SUPABASE MIGRATION
-- Project: Legacy & Lore (pcxjdutgojfuzkjtvsta)
-- Run this entire file in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. USERS
-- Extended profile on top of Supabase auth.users
-- ============================================================
create table if not exists public.users (
  id                uuid primary key references auth.users(id) on delete cascade,
  email             text not null,
  tier              text not null default 'free'
                    check (tier in ('free','wanderer','cartographer','architect','founding_vault')),
  tier_expires_at   timestamptz,
  stripe_customer_id text unique,
  referral_code     text unique default substr(md5(random()::text), 1, 8),
  referred_by       text,
  bonus_generations int not null default 0,
  created_at        timestamptz not null default now(),
  last_active_at    timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "Users can read own record"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own record"
  on public.users for update
  using (auth.uid() = id);

create policy "Service role full access to users"
  on public.users for all
  using (auth.role() = 'service_role');

-- ============================================================
-- 2. SUBSCRIPTIONS
-- ============================================================
create table if not exists public.subscriptions (
  id                      uuid primary key default uuid_generate_v4(),
  user_id                 uuid not null references public.users(id) on delete cascade,
  stripe_subscription_id  text unique,
  stripe_price_id         text,
  status                  text not null default 'active'
                          check (status in ('active','cancelled','past_due','paused','incomplete')),
  current_period_end      timestamptz,
  cancel_at_period_end    boolean not null default false,
  pause_resumes_at        timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can read own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Service role full access to subscriptions"
  on public.subscriptions for all
  using (auth.role() = 'service_role');

-- ============================================================
-- 3. PACKETS
-- ============================================================
create table if not exists public.packets (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references public.users(id) on delete cascade,
  world_name          text not null,
  tagline             text,
  regional_portrait   text,
  factions            jsonb,
  mystery_hook        text,
  npcs                jsonb,
  artifact_name       text,
  artifact_description text,
  tone_aesthetic      text,
  genre               text,
  builder_selections  jsonb,
  prompt_version      text not null default 'v1.0',
  share_token         text unique default substr(md5(uuid_generate_v4()::text), 1, 12),
  view_count          int not null default 0,
  generation_source   text not null default 'manual'
                      check (generation_source in ('manual','weekly_cron','commission')),
  created_at          timestamptz not null default now()
);

alter table public.packets enable row level security;

create policy "Users can read own packets"
  on public.packets for select
  using (auth.uid() = user_id);

create policy "Users can insert own packets"
  on public.packets for insert
  with check (auth.uid() = user_id);

create policy "Public share token read"
  on public.packets for select
  using (share_token is not null);

create policy "Service role full access to packets"
  on public.packets for all
  using (auth.role() = 'service_role');

create index if not exists packets_user_id_idx on public.packets(user_id);
create index if not exists packets_share_token_idx on public.packets(share_token);
create index if not exists packets_created_at_idx on public.packets(created_at desc);

-- ============================================================
-- 4. USAGE TRACKING
-- ============================================================
create table if not exists public.usage_tracking (
  user_id         uuid not null references public.users(id) on delete cascade,
  week_start      date not null,
  generations_used int not null default 0,
  tier_at_time    text not null default 'free',
  primary key (user_id, week_start)
);

alter table public.usage_tracking enable row level security;

create policy "Users can read own usage"
  on public.usage_tracking for select
  using (auth.uid() = user_id);

create policy "Service role full access to usage"
  on public.usage_tracking for all
  using (auth.role() = 'service_role');

-- ============================================================
-- 5. BUILDER PREFERENCES
-- ============================================================
create table if not exists public.builder_preferences (
  user_id          uuid primary key references public.users(id) on delete cascade,
  terrain          text,
  power_structure  text,
  primary_threat   text,
  dominant_races   text,
  monster_type     text,
  tone_wildcard    text,
  updated_at       timestamptz not null default now()
);

alter table public.builder_preferences enable row level security;

create policy "Users can read own preferences"
  on public.builder_preferences for select
  using (auth.uid() = user_id);

create policy "Users can upsert own preferences"
  on public.builder_preferences for all
  using (auth.uid() = user_id);

create policy "Service role full access to preferences"
  on public.builder_preferences for all
  using (auth.role() = 'service_role');

-- ============================================================
-- 6. COMMISSIONS
-- ============================================================
create table if not exists public.commissions (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references public.users(id) on delete cascade,
  brief               text not null,
  status              text not null default 'pending'
                      check (status in ('pending','in_progress','delivered','cancelled')),
  delivered_packet_id uuid references public.packets(id),
  month_year          text not null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.commissions enable row level security;

create policy "Users can read own commissions"
  on public.commissions for select
  using (auth.uid() = user_id);

create policy "Users can insert own commissions"
  on public.commissions for insert
  with check (auth.uid() = user_id);

create policy "Service role full access to commissions"
  on public.commissions for all
  using (auth.role() = 'service_role');

-- ============================================================
-- 7. REFERRALS
-- ============================================================
create table if not exists public.referrals (
  id                  uuid primary key default uuid_generate_v4(),
  referrer_id         uuid not null references public.users(id) on delete cascade,
  referred_user_id    uuid not null references public.users(id) on delete cascade,
  converted_to_paid   boolean not null default false,
  reward_applied      boolean not null default false,
  created_at          timestamptz not null default now(),
  unique (referrer_id, referred_user_id)
);

alter table public.referrals enable row level security;

create policy "Users can read own referrals"
  on public.referrals for select
  using (auth.uid() = referrer_id);

create policy "Service role full access to referrals"
  on public.referrals for all
  using (auth.role() = 'service_role');

-- ============================================================
-- 8. AGENT LOGS
-- ============================================================
create table if not exists public.agent_logs (
  id          uuid primary key default uuid_generate_v4(),
  agent_id    text not null,
  level       text not null default 'info'
              check (level in ('info','success','warning','error')),
  message     text not null,
  metadata    jsonb,
  created_at  timestamptz not null default now()
);

alter table public.agent_logs enable row level security;

create policy "Service role full access to agent_logs"
  on public.agent_logs for all
  using (auth.role() = 'service_role');

create policy "Anon can read agent_logs"
  on public.agent_logs for select
  using (true);

create index if not exists agent_logs_agent_id_idx on public.agent_logs(agent_id);
create index if not exists agent_logs_created_at_idx on public.agent_logs(created_at desc);

-- ============================================================
-- 9. BRAIN STATE
-- ============================================================
create table if not exists public.brain_state (
  id            int primary key default 1,
  state         jsonb not null default '{
    "last_updated": null,
    "metrics": {
      "total_subscribers": 0,
      "mrr": 0,
      "churn_this_month": 0,
      "generations_this_week": 0,
      "open_rate_last_email": 0
    },
    "open_tasks": [],
    "decisions_made": [],
    "known_issues": [],
    "weekly_goal": "Reach first 10 subscribers"
  }'::jsonb,
  updated_at    timestamptz not null default now(),
  constraint single_row check (id = 1)
);

alter table public.brain_state enable row level security;

create policy "Service role full access to brain_state"
  on public.brain_state for all
  using (auth.role() = 'service_role');

create policy "Anon can read brain_state"
  on public.brain_state for select
  using (true);

insert into public.brain_state (id) values (1)
on conflict (id) do nothing;

-- ============================================================
-- 10. ANALYTICS EVENTS
-- ============================================================
create table if not exists public.analytics_events (
  id          uuid primary key default uuid_generate_v4(),
  event       text not null,
  user_id     uuid references public.users(id) on delete set null,
  properties  jsonb,
  utm_source  text,
  utm_medium  text,
  utm_campaign text,
  created_at  timestamptz not null default now()
);

alter table public.analytics_events enable row level security;

create policy "Service role full access to analytics"
  on public.analytics_events for all
  using (auth.role() = 'service_role');

create policy "Anon can insert analytics"
  on public.analytics_events for insert
  with check (true);

create index if not exists analytics_event_idx on public.analytics_events(event);
create index if not exists analytics_created_at_idx on public.analytics_events(created_at desc);

-- ============================================================
-- 11. EMAIL CAPTURE
-- ============================================================
create table if not exists public.email_captures (
  id          uuid primary key default uuid_generate_v4(),
  email       text not null unique,
  converted   boolean not null default false,
  utm_source  text,
  created_at  timestamptz not null default now()
);

alter table public.email_captures enable row level security;

create policy "Service role full access to email_captures"
  on public.email_captures for all
  using (auth.role() = 'service_role');

create policy "Anon can insert email captures"
  on public.email_captures for insert
  with check (true);

-- ============================================================
-- 12. DASHBOARD STATUS VIEW
-- ============================================================
create or replace view public.dashboard_status as
select
  count(*) filter (where tier != 'free')              as total_subscribers,
  count(*) filter (where tier = 'wanderer')           as wanderer_count,
  count(*) filter (where tier = 'cartographer')       as cartographer_count,
  count(*) filter (where tier = 'architect')          as architect_count,
  count(*) filter (where tier = 'founding_vault')     as founding_vault_count,
  (
    count(*) filter (where tier = 'wanderer')     * 9  +
    count(*) filter (where tier = 'cartographer') * 19 +
    count(*) filter (where tier = 'architect')    * 29 +
    count(*) filter (where tier = 'founding_vault') * 0
  )                                                   as mrr,
  (select count(*) from public.packets
   where created_at > now() - interval '7 days')      as generations_this_week,
  (select count(*) from public.email_captures
   where converted = false)                           as unconverted_leads,
  now()                                               as as_of
from public.users;

-- ============================================================
-- 13. AGENT STATUS VIEW
-- ============================================================
create or replace view public.agent_status as
select distinct on (agent_id)
  agent_id,
  level,
  message,
  created_at
from public.agent_logs
order by agent_id, created_at desc;
