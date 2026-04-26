-- Create a table for resume history/versioning
create table if not exists public.resume_history (
  id uuid primary key default gen_random_uuid(),
  resume_id uuid references public.resumes(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  content text not null,
  ats_score number,
  version_label string,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.resume_history enable row level security;

-- Policies
create policy "Users can view their own resume history"
  on public.resume_history for select
  using (auth.uid() = user_id);

create policy "Users can insert their own resume history"
  on public.resume_history for insert
  with check (auth.uid() = user_id);
