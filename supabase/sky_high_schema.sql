-- Sky-High Evolution Schema

-- Discovery Swipes (Tinder for Tech)
create table if not exists public.discovery_swipes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  job_id uuid references public.job_postings(id) on delete cascade,
  direction text check (direction in ('like', 'pass')),
  created_at timestamptz default now()
);

-- Mutual Matches
create table if not exists public.matches (
  id uuid primary key default uuid_generate_v4(),
  candidate_id uuid references public.users(id),
  recruiter_id uuid references public.users(id),
  job_id uuid references public.job_postings(id),
  status text default 'pending',
  created_at timestamptz default now()
);

-- Autonomous Agent Tasks
create table if not exists public.autonomous_tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id),
  type text, -- e.g., 'resume_tailoring', 'job_scanning'
  status text default 'running',
  progress int default 0,
  result_data jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Learning Roadmaps
create table if not exists public.learning_roadmaps (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id),
  target_job_id uuid references public.job_postings(id),
  gap_analysis text[],
  steps jsonb[], -- Array of objects { title, resource_url, type }
  is_completed boolean default false,
  created_at timestamptz default now()
);

-- RLS Policies
alter table public.discovery_swipes enable row level security;
alter table public.matches enable row level security;
alter table public.autonomous_tasks enable row level security;
alter table public.learning_roadmaps enable row level security;

-- Simple "manage own" policies
create policy "Users manage own swipes" on public.discovery_swipes for all using (auth.uid() = user_id);
create policy "Users view own matches" on public.matches for select using (auth.uid() = candidate_id or auth.uid() = recruiter_id);
create policy "Users manage own tasks" on public.autonomous_tasks for all using (auth.uid() = user_id);
create policy "Users view own roadmaps" on public.learning_roadmaps for all using (auth.uid() = user_id);
