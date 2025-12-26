-- Profiles update: Plan tiers and quotas
alter table if exists public.user_profiles
add column if not exists plan_tier text check (
  plan_tier in ('free', 'starter', 'pro', 'premium', 'enterprise')
) default 'free';

alter table if exists public.user_profiles
add column if not exists plan_expires_at timestamptz;

alter table if exists public.user_profiles
add column if not exists monthly_image_quota int default 5,
add column if not exists monthly_scene_quota int default 0,
add column if not exists monthly_3d_quota int default 0,
add column if not exists images_used_this_month int default 0,
add column if not exists scenes_used_this_month int default 0,
add column if not exists models_used_this_month int default 0,
add column if not exists usage_period_start timestamptz default now();

-- Generations table: Tracks every AI job
create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.user_profiles(id) on delete set null,
  tool text not null,              -- 'background', 'enhancement', 'scene', 'image_to_3d'
  input_url text,                  -- storage path or URL
  output_url text,
  input_metadata jsonb,            -- prompt, params, etc.
  output_metadata jsonb,
  tokens_used int,
  cost_usd numeric(10,4),
  created_at timestamptz default now()
);

-- Indexes for generations
create index if not exists generations_user_id_idx on public.generations(user_id);
create index if not exists generations_tool_idx on public.generations(tool);

-- Feedback table
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.user_profiles(id) on delete set null,
  generation_id uuid references public.generations(id) on delete cascade,
  rating int check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

create index if not exists feedback_generation_id_idx on public.feedback(generation_id);

-- Waitlist Emails table
create table if not exists public.waitlist_emails (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text,      -- 'landing_page', 'tool_banner', etc.
  notes text,
  created_at timestamptz default now()
);

create unique index if not exists waitlist_emails_email_idx on public.waitlist_emails(lower(email));

-- Enable RLS (policies can be added later as per instructions)
alter table public.generations enable row level security;
alter table public.feedback enable row level security;
alter table public.waitlist_emails enable row level security;

-- Simple permissive policies for now to ensure functionality during wiring
create policy "Users manage own generations" on public.generations for all using (auth.uid() = user_id);
create policy "Users manage own feedback" on public.feedback for all using (auth.uid() = user_id);
create policy "Public insert waitlist" on public.waitlist_emails for insert with check (true);
