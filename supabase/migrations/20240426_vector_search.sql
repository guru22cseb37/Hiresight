-- Enable the "vector" extension to work with embeddings
create extension if not exists vector;

-- Create a table for resumes with vector support
create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  content text,
  metadata jsonb,
  embedding vector(1536), -- Assuming 1536 dimensions (standard for OpenAI/modern embeddings)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for similarity search
create index on resumes using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Function to search resumes by embedding
create or replace function match_resumes (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    resumes.id,
    resumes.content,
    resumes.metadata,
    1 - (resumes.embedding <=> query_embedding) as similarity
  from resumes
  where 1 - (resumes.embedding <=> query_embedding) > match_threshold
  order by resumes.embedding <=> query_embedding
  limit match_count;
end;
$$;
