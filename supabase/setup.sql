-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users (extends Supabase auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users(id),
  email text,
  full_name text,
  avatar_url text,
  role text check (role in ('job_seeker', 'recruiter')),
  phone text,
  location text,
  bio text,
  linkedin_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.users enable row level security;
do $$ begin
  create policy "Users can read own data" on public.users for select using (auth.uid() = id);
  create policy "Users can update own data" on public.users for update using (auth.uid() = id);
  create policy "Users can insert own data" on public.users for insert with check (auth.uid() = id);
exception when duplicate_object then null; end $$;

-- Resumes
create table if not exists public.resumes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  name text not null,
  raw_text text,
  file_url text,
  is_default boolean default false,
  ats_health_score int,
  version int default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.resumes enable row level security;
do $$ begin
  create policy "Users manage own resumes" on public.resumes for all using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- Applications
create table if not exists public.applications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  resume_id uuid references public.resumes(id),
  company_name text,
  role text,
  job_description text,
  job_url text,
  ats_score int,
  status text default 'ready',
  tailored_resume text,
  cover_letter text,
  keywords_found text[],
  keywords_missing text[],
  interview_tips text,
  salary_intel jsonb,
  notes text,
  applied_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.applications enable row level security;
do $$ begin
  create policy "Users manage own applications" on public.applications for all using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- Job Postings (Recruiter)
create table if not exists public.job_postings (
  id uuid primary key default uuid_generate_v4(),
  recruiter_id uuid references public.users(id) on delete cascade,
  company_name text,
  role text,
  description text,
  requirements text,
  location text,
  salary_min int,
  salary_max int,
  status text default 'draft',
  optimized_jd text,
  ats_keywords text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.job_postings enable row level security;
do $$ begin
  create policy "Recruiters manage own jobs" on public.job_postings for all using (auth.uid() = recruiter_id);
exception when duplicate_object then null; end $$;

-- Candidates (Recruiter)
create table if not exists public.candidates (
  id uuid primary key default uuid_generate_v4(),
  recruiter_id uuid references public.users(id) on delete cascade,
  job_id uuid references public.job_postings(id) on delete cascade,
  name text,
  email text,
  phone text,
  resume_text text,
  resume_url text,
  ai_score int,
  ai_summary text,
  strengths text[],
  gaps text[],
  stage text default 'new',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.candidates enable row level security;
do $$ begin
  create policy "Recruiters manage own candidates" on public.candidates for all using (auth.uid() = recruiter_id);
exception when duplicate_object then null; end $$;

-- Interview Sessions
create table if not exists public.interview_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  application_id uuid references public.applications(id),
  messages jsonb[] default '{}',
  score int,
  feedback text,
  created_at timestamptz default now()
);

alter table public.interview_sessions enable row level security;
do $$ begin
  create policy "Users manage own sessions" on public.interview_sessions for all using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- Saved Templates
create table if not exists public.saved_templates (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  name text,
  type text,
  content text,
  created_at timestamptz default now()
);

alter table public.saved_templates enable row level security;
do $$ begin
  create policy "Users manage own templates" on public.saved_templates for all using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- LaTeX Resumes
create table if not exists public.latex_resumes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  name text not null,
  template_name text not null default 'modern',
  latex_source text not null,
  compiled_pdf_url text,
  overleaf_project_id text,
  overleaf_share_url text,
  ats_score int,
  integrity_score int,
  integrity_report jsonb,
  version int default 1,
  is_default boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.latex_resumes enable row level security;
do $$ begin
  create policy "Users manage own latex resumes" on public.latex_resumes for all using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- Integrity Reports
create table if not exists public.integrity_reports (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  resume_id uuid references public.resumes(id),
  latex_resume_id uuid references public.latex_resumes(id),
  overall_integrity_score int,
  risk_level text,
  full_report jsonb,
  acknowledged boolean default false,
  created_at timestamptz default now()
);

alter table public.integrity_reports enable row level security;
do $$ begin
  create policy "Users manage own reports" on public.integrity_reports for all using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- Auto-update updated_at trigger function
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

-- Triggers
do $$ begin
  create trigger update_users_updated_at before update on public.users for each row execute function update_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger update_resumes_updated_at before update on public.resumes for each row execute function update_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger update_applications_updated_at before update on public.applications for each row execute function update_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger update_job_postings_updated_at before update on public.job_postings for each row execute function update_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger update_candidates_updated_at before update on public.candidates for each row execute function update_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger update_latex_resumes_updated_at before update on public.latex_resumes for each row execute function update_updated_at();
exception when duplicate_object then null; end $$;
