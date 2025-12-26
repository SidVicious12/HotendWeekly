-- Create Generations table to track AI tool usage and content
create table public.generations (
  id uuid not null default gen_random_uuid (),
  user_id uuid references auth.users not null,
  tool_name text not null,
  input_data jsonb not null, -- Stores source image URL, prompt, etc.
  output_data jsonb not null, -- Stores result URL, model path, etc.
  duration_ms integer,
  created_at timestamp with time zone not null default now(),
  constraint generations_pkey primary key (id)
);

-- Create Feedback table for RLHF (Reinforcement Learning from Human Feedback)
create table public.feedback (
  id uuid not null default gen_random_uuid (),
  generation_id uuid references public.generations not null,
  user_id uuid references auth.users not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  tags text[], -- Array of strings for categories like 'geometry', 'texture'
  created_at timestamp with time zone not null default now(),
  constraint feedback_pkey primary key (id)
);

-- Add Marketing columns to profiles
alter table public.profiles 
add column if not exists marketing_opt_in boolean default false,
add column if not exists industry_segment text;

-- Enable RLS (Row Level Security)
alter table public.generations enable row level security;
alter table public.feedback enable row level security;

-- Policies for Generations
create policy "Users can view their own generations"
  on public.generations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own generations"
  on public.generations for insert
  with check (auth.uid() = user_id);

-- Policies for Feedback
create policy "Users can view their own feedback"
  on public.feedback for select
  using (auth.uid() = user_id);

create policy "Users can insert their own feedback"
  on public.feedback for insert
  with check (auth.uid() = user_id);

-- Create Waitlist table for landing page email capture
create table public.waitlist (
  id uuid not null default gen_random_uuid (),
  email text not null unique,
  created_at timestamp with time zone not null default now(),
  constraint waitlist_pkey primary key (id)
);

alter table public.waitlist enable row level security;

-- Allow anyone to insert into waitlist (public)
create policy "Public can insert into waitlist"
  on public.waitlist for insert
  with check (true);
