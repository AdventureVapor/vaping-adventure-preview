-- PostgreSQL integration test for the isolated MVA data-group RPC.
-- Runs only in an ephemeral GitHub Actions PostgreSQL service, never Supabase.

create schema auth;
create table auth.users (id uuid primary key);
create role anon nologin;
create role authenticated nologin;
create function auth.uid() returns uuid
language sql stable
as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;

insert into auth.users(id) values
 ('11111111-1111-4111-8111-111111111111'),
 ('22222222-2222-4222-8222-222222222222');

create table public.mva_data (
  user_id uuid not null references auth.users(id) on delete cascade,
  data_type text not null check (data_type in ('entries','devices','strains','photos','game','controlledVaping')),
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  revision bigint not null default 1,
  primary key (user_id, data_type)
);
alter table public.mva_data enable row level security;
create policy "MVA data select own rows" on public.mva_data for select to authenticated using (auth.uid() = user_id);
create policy "MVA data insert own rows" on public.mva_data for insert to authenticated with check (auth.uid() = user_id);
create policy "MVA data update own rows" on public.mva_data for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "MVA data delete own rows" on public.mva_data for delete to authenticated using (auth.uid() = user_id);
grant select, insert, update, delete on public.mva_data to authenticated;

create or replace function public.mva_write_data(
  p_data_type text,
  p_payload jsonb,
  p_expected_revision bigint
)
returns bigint
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_revision bigint;
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  if p_data_type is null
     or p_data_type not in ('entries','devices','strains','photos','game','controlledVaping')
     or p_expected_revision is null
     or p_expected_revision < 0 then
    raise exception 'Invalid data type or expected revision' using errcode = '22023';
  end if;

  if p_payload is null
     or jsonb_typeof(p_payload) <> 'object'
     or p_payload->>'v' <> '1'
     or p_payload->>'algorithm' <> 'A256GCM'
     or p_payload->>'revision' is null
     or case
          when p_payload->>'revision' ~ '^[0-9]+$'
            then (p_payload->>'revision')::numeric <> p_expected_revision::numeric + 1
          else true
        end
     or coalesce(p_payload->>'iv', '') = ''
     or coalesce(p_payload->>'ciphertext', '') = '' then
    raise exception 'Invalid encrypted payload or revision' using errcode = '22023';
  end if;

  if p_expected_revision = 0 then
    insert into public.mva_data (user_id, data_type, payload, revision, updated_at)
    values (auth.uid(), p_data_type, p_payload, 1, now())
    on conflict (user_id, data_type) do nothing
    returning revision into v_revision;
    if found then return v_revision; end if;
  else
    update public.mva_data
       set payload = p_payload,
           revision = revision + 1,
           updated_at = now()
     where user_id = auth.uid()
       and data_type = p_data_type
       and revision = p_expected_revision
    returning revision into v_revision;
    if found then return v_revision; end if;
  end if;

  raise exception 'MVA_REVISION_CONFLICT' using errcode = 'P0001';
end;
$$;
revoke all on function public.mva_write_data(text, jsonb, bigint) from public, anon;
grant execute on function public.mva_write_data(text, jsonb, bigint) to authenticated;

-- Execute as an authenticated client, with JWT subject simulated by auth.uid().
set role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',false);

do $$
declare v bigint;
begin
  v := public.mva_write_data('entries',
    '{"v":1,"algorithm":"A256GCM","revision":1,"iv":"aWlpaWlpaWlpaWlp","ciphertext":"Y2lwaGVydGV4dA=="}'::jsonb, 0);
  if v <> 1 then raise exception 'initial insert did not return revision 1'; end if;

  begin
    perform public.mva_write_data('entries',
      '{"v":1,"algorithm":"A256GCM","revision":1,"iv":"aWlpaWlpaWlpaWlp","ciphertext":"Y2lwaGVydGV4dA=="}'::jsonb, 0);
    raise exception 'stale initial write unexpectedly succeeded';
  exception when sqlstate 'P0001' then null;
  end;

  v := public.mva_write_data('entries',
    '{"v":1,"algorithm":"A256GCM","revision":2,"iv":"aWlpaWlpaWlpaWlp","ciphertext":"Y2lwaGVydGV4dA=="}'::jsonb, 1);
  if v <> 2 then raise exception 'update did not return revision 2'; end if;

  begin
    perform public.mva_write_data('entries',
      '{"v":1,"algorithm":"A256GCM","revision":3,"iv":"aWlpaWlpaWlpaWlp","ciphertext":"Y2lwaGVydGV4dA=="}'::jsonb, 1);
    raise exception 'stale revision write unexpectedly succeeded';
  exception when sqlstate 'P0001' then null;
  end;

  begin
    perform public.mva_write_data('entries',
      '{"v":1,"algorithm":"A256GCM","revision":"not-a-number","iv":"x","ciphertext":"y"}'::jsonb, 2);
    raise exception 'malformed revision unexpectedly succeeded';
  exception when sqlstate '22023' then null;
  end;

  begin
    perform public.mva_write_data('unknown',
      '{"v":1,"algorithm":"A256GCM","revision":1,"iv":"x","ciphertext":"y"}'::jsonb, 0);
    raise exception 'unknown group unexpectedly succeeded';
  exception when sqlstate '22023' then null;
  end;
end $$;

do $$
begin
  if (select count(*) from public.mva_data) <> 1 then
    raise exception 'authenticated user cannot see own single row';
  end if;
  if (select revision from public.mva_data where data_type='entries') <> 2 then
    raise exception 'expected persisted revision 2';
  end if;
end $$;

-- RLS must hide user A's row from user B.
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',false);
do $$
begin
  if (select count(*) from public.mva_data) <> 0 then
    raise exception 'RLS exposed another user data';
  end if;
end $$;
reset role;
