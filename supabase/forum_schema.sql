-- My Vaping Adventure Forum – initial schema (non-destructive)
-- Run once in Supabase SQL Editor.
-- Moderators are trusted only when app_metadata.forum_role is set server-side.

create table if not exists public.mva_forum_topics (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 40),
  category text not null check (category in ('general','devices','exchange')),
  title text not null check (char_length(title) between 1 and 120),
  body text not null check (char_length(body) between 1 and 5000),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mva_forum_replies (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.mva_forum_topics(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 40),
  body text not null check (char_length(body) between 1 and 3000),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists mva_forum_topics_public_order on public.mva_forum_topics(status, created_at desc);
create index if not exists mva_forum_topics_author on public.mva_forum_topics(author_id, created_at desc);
create index if not exists mva_forum_replies_topic_order on public.mva_forum_replies(topic_id, status, created_at asc);
create index if not exists mva_forum_replies_author on public.mva_forum_replies(author_id, created_at desc);

alter table public.mva_forum_topics enable row level security;
alter table public.mva_forum_replies enable row level security;

drop policy if exists "Forum topics are readable when approved" on public.mva_forum_topics;
create policy "Forum topics are readable when approved" on public.mva_forum_topics
for select to anon, authenticated using (status = 'approved');

drop policy if exists "Authors can read their own forum topics" on public.mva_forum_topics;
create policy "Authors can read their own forum topics" on public.mva_forum_topics
for select to authenticated using (author_id = auth.uid());

drop policy if exists "Forum moderators can read all topics" on public.mva_forum_topics;
create policy "Forum moderators can read all topics" on public.mva_forum_topics
for select to authenticated using ((auth.jwt()->'app_metadata'->>'forum_role') in ('moderator','admin'));

drop policy if exists "Authenticated users can submit pending topics" on public.mva_forum_topics;
create policy "Authenticated users can submit pending topics" on public.mva_forum_topics
for insert to authenticated with check (author_id = auth.uid() and status = 'pending');

drop policy if exists "Authors can edit pending topics" on public.mva_forum_topics;
create policy "Authors can edit pending topics" on public.mva_forum_topics
for update to authenticated using (author_id = auth.uid() and status = 'pending')
with check (author_id = auth.uid() and status = 'pending');

drop policy if exists "Forum moderators can moderate topics" on public.mva_forum_topics;
create policy "Forum moderators can moderate topics" on public.mva_forum_topics
for update to authenticated using ((auth.jwt()->'app_metadata'->>'forum_role') in ('moderator','admin'))
with check ((auth.jwt()->'app_metadata'->>'forum_role') in ('moderator','admin'));

drop policy if exists "Replies readable for approved topics" on public.mva_forum_replies;
create policy "Replies readable for approved topics" on public.mva_forum_replies
for select to anon, authenticated using (
  status = 'approved' and exists (
    select 1 from public.mva_forum_topics t
    where t.id = mva_forum_replies.topic_id and t.status = 'approved'
  )
);

drop policy if exists "Authors can read their own forum replies" on public.mva_forum_replies;
create policy "Authors can read their own forum replies" on public.mva_forum_replies
for select to authenticated using (author_id = auth.uid());

drop policy if exists "Forum moderators can read all replies" on public.mva_forum_replies;
create policy "Forum moderators can read all replies" on public.mva_forum_replies
for select to authenticated using ((auth.jwt()->'app_metadata'->>'forum_role') in ('moderator','admin'));

drop policy if exists "Authenticated users can submit pending replies" on public.mva_forum_replies;
create policy "Authenticated users can submit pending replies" on public.mva_forum_replies
for insert to authenticated with check (
  author_id = auth.uid() and status = 'pending' and exists (
    select 1 from public.mva_forum_topics t
    where t.id = mva_forum_replies.topic_id and t.status = 'approved'
  )
);

drop policy if exists "Authors can edit pending replies" on public.mva_forum_replies;
create policy "Authors can edit pending replies" on public.mva_forum_replies
for update to authenticated using (author_id = auth.uid() and status = 'pending')
with check (author_id = auth.uid() and status = 'pending');

drop policy if exists "Forum moderators can moderate replies" on public.mva_forum_replies;
create policy "Forum moderators can moderate replies" on public.mva_forum_replies
for update to authenticated using ((auth.jwt()->'app_metadata'->>'forum_role') in ('moderator','admin'))
with check ((auth.jwt()->'app_metadata'->>'forum_role') in ('moderator','admin'));

grant select on public.mva_forum_topics, public.mva_forum_replies to anon, authenticated;
grant insert, update on public.mva_forum_topics, public.mva_forum_replies to authenticated;
