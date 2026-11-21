-- My Vaping Adventure 1.4 – Gästebuch
-- Run once in the Supabase SQL Editor for the PREVIEW project.
create table if not exists public.mva_guestbook (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null check (char_length(trim(display_name)) between 1 and 40),
  message text not null check (char_length(trim(message)) between 1 and 1000),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);
create index if not exists mva_guestbook_approved_created_idx
  on public.mva_guestbook (created_at desc) where status = 'approved';
alter table public.mva_guestbook enable row level security;
drop policy if exists "Anyone can read approved guestbook entries" on public.mva_guestbook;
create policy "Anyone can read approved guestbook entries"
  on public.mva_guestbook for select to anon, authenticated
  using (status = 'approved');
drop policy if exists "Authenticated users can submit pending guestbook entries" on public.mva_guestbook;
create policy "Authenticated users can submit pending guestbook entries"
  on public.mva_guestbook for insert to authenticated
  with check (auth.uid() = author_id and status = 'pending');
grant select on public.mva_guestbook to anon, authenticated;
grant insert on public.mva_guestbook to authenticated;
-- Moderate entries in Supabase Dashboard > Table Editor.
-- Change status to 'approved' only after reviewing a message.
-- Do not add public UPDATE or DELETE policies.
