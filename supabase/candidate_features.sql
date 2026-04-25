-- ============================================================
-- HireSight Supabase Setup — Run these in your Supabase SQL Editor
-- ============================================================

-- ----------------------------------------------------------------
-- 1. Allow ALL users (including job seekers) to READ active jobs
--    posted by recruiters. Without this, RLS blocks candidates.
-- ----------------------------------------------------------------
do $$ begin
  create policy "Candidates can view active job postings"
    on public.job_postings
    for select
    using (status = 'active');
exception when duplicate_object then null; end $$;


-- ----------------------------------------------------------------
-- 2. Create the `resumes` storage bucket for PDF uploads
--    Run this in SQL Editor (Supabase doesn't always expose bucket
--    creation via SQL, but this is the standard approach)
-- ----------------------------------------------------------------

-- Create bucket (idempotent)
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload their own files
do $$ begin
  create policy "Authenticated users can upload resumes"
    on storage.objects
    for insert
    to authenticated
    with check (
      bucket_id = 'resumes' AND
      (storage.foldername(name))[1] = auth.uid()::text
    );
exception when duplicate_object then null; end $$;

-- Allow users to read their own files (and public read since bucket is public)
do $$ begin
  create policy "Users can read own resume files"
    on storage.objects
    for select
    to authenticated
    using (
      bucket_id = 'resumes' AND
      (storage.foldername(name))[1] = auth.uid()::text
    );
exception when duplicate_object then null; end $$;

-- Allow users to delete their own files
do $$ begin
  create policy "Users can delete own resume files"
    on storage.objects
    for delete
    to authenticated
    using (
      bucket_id = 'resumes' AND
      (storage.foldername(name))[1] = auth.uid()::text
    );
exception when duplicate_object then null; end $$;


-- ----------------------------------------------------------------
-- 3. Enable Realtime on job_postings so the candidate job board
--    gets live updates when recruiters post new jobs
-- ----------------------------------------------------------------
alter publication supabase_realtime add table public.job_postings;
