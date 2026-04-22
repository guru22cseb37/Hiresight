-- Create Market Insights table
create table if not exists public.market_insights (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  summary text,
  trending_skills text[],
  salary_data jsonb,
  source_urls text[],
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.market_insights enable row level security;

-- Policies
create policy "Anyone can read market insights" 
  on public.market_insights 
  for select 
  using (true);

-- Allow service role to insert (for n8n via API)
create policy "Service role can insert insights" 
  on public.market_insights 
  for insert 
  with check (true);
