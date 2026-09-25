-- Run once in Supabase SQL Editor before using Send feedback in CYG Demo 0.9.
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_email text,
  category text not null check (category in ('bug', 'suggestion', 'other')),
  message text not null check (char_length(message) between 1 and 2000),
  app_version text not null default 'CYG Demo 0.9',
  page_path text,
  created_at timestamptz not null default now()
);

alter table public.feedback enable row level security;

drop policy if exists "Users can submit their own feedback" on public.feedback;
create policy "Users can submit their own feedback"
on public.feedback for insert
to authenticated
with check (auth.uid() = user_id);

-- Users intentionally do not receive SELECT/UPDATE/DELETE policies.
-- Project owners can review submissions in Supabase Table Editor -> feedback.
create index if not exists feedback_created_at_idx on public.feedback (created_at desc);
create index if not exists feedback_user_id_idx on public.feedback (user_id);
