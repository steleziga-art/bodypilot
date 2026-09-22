-- Mucipes V1 social/friends foundation
-- Safe to run after the existing auth + user_app_data foundation.
-- Does not delete or rename existing BodyPilot/Mucipes data.

create extension if not exists pgcrypto;

create table if not exists public.social_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  display_name text not null,
  bio text,
  discoverable boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint social_profiles_username_format check (username ~ '^[a-z0-9_]{3,24}$')
);

create table if not exists public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users(id) on delete cascade,
  addressee_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted','declined','blocked')),
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  constraint friendships_not_self check (requester_id <> addressee_id),
  constraint friendships_direction_unique unique (requester_id, addressee_id)
);

create index if not exists friendships_requester_idx on public.friendships(requester_id);
create index if not exists friendships_addressee_idx on public.friendships(addressee_id);
create index if not exists friendships_status_idx on public.friendships(status);

create table if not exists public.friend_permissions (
  owner_id uuid not null references auth.users(id) on delete cascade,
  friend_id uuid not null references auth.users(id) on delete cascade,
  share_training boolean not null default true,
  share_progress boolean not null default false,
  share_nutrition boolean not null default false,
  share_measurements boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (owner_id, friend_id),
  constraint friend_permissions_not_self check (owner_id <> friend_id)
);

create table if not exists public.social_snapshots (
  user_id uuid primary key references auth.users(id) on delete cascade,
  training jsonb not null default '{}'::jsonb,
  progress jsonb not null default '{}'::jsonb,
  nutrition jsonb not null default '{}'::jsonb,
  measurements jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.social_profiles enable row level security;
alter table public.friendships enable row level security;
alter table public.friend_permissions enable row level security;
alter table public.social_snapshots enable row level security;

drop policy if exists "social profiles readable" on public.social_profiles;
create policy "social profiles readable"
on public.social_profiles for select
to authenticated
using (
  user_id = auth.uid()
  or discoverable = true
  or exists (
    select 1 from public.friendships f
    where f.status = 'accepted'
      and ((f.requester_id = auth.uid() and f.addressee_id = social_profiles.user_id)
        or (f.addressee_id = auth.uid() and f.requester_id = social_profiles.user_id))
  )
);

drop policy if exists "social profile insert own" on public.social_profiles;
create policy "social profile insert own"
on public.social_profiles for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "social profile update own" on public.social_profiles;
create policy "social profile update own"
on public.social_profiles for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "friendships participants read" on public.friendships;
create policy "friendships participants read"
on public.friendships for select
to authenticated
using (requester_id = auth.uid() or addressee_id = auth.uid());

drop policy if exists "friendship requester insert" on public.friendships;
create policy "friendship requester insert"
on public.friendships for insert
to authenticated
with check (requester_id = auth.uid() and addressee_id <> auth.uid());

drop policy if exists "friendship participant update" on public.friendships;
create policy "friendship participant update"
on public.friendships for update
to authenticated
using (requester_id = auth.uid() or addressee_id = auth.uid())
with check (requester_id = auth.uid() or addressee_id = auth.uid());

drop policy if exists "friendship participant delete" on public.friendships;
create policy "friendship participant delete"
on public.friendships for delete
to authenticated
using (requester_id = auth.uid() or addressee_id = auth.uid());

drop policy if exists "permissions owner read" on public.friend_permissions;
create policy "permissions owner read"
on public.friend_permissions for select
to authenticated
using (owner_id = auth.uid());

drop policy if exists "permissions owner insert" on public.friend_permissions;
create policy "permissions owner insert"
on public.friend_permissions for insert
to authenticated
with check (owner_id = auth.uid());

drop policy if exists "permissions owner update" on public.friend_permissions;
create policy "permissions owner update"
on public.friend_permissions for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "snapshots own read" on public.social_snapshots;
create policy "snapshots own read"
on public.social_snapshots for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "snapshots own insert" on public.social_snapshots;
create policy "snapshots own insert"
on public.social_snapshots for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "snapshots own update" on public.social_snapshots;
create policy "snapshots own update"
on public.social_snapshots for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create or replace function public.mucipes_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists social_profiles_touch_updated_at on public.social_profiles;
create trigger social_profiles_touch_updated_at
before update on public.social_profiles
for each row execute function public.mucipes_touch_updated_at();

drop trigger if exists friend_permissions_touch_updated_at on public.friend_permissions;
create trigger friend_permissions_touch_updated_at
before update on public.friend_permissions
for each row execute function public.mucipes_touch_updated_at();

create or replace function public.mucipes_friendship_after_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'accepted' and (old.status is distinct from 'accepted') then
    new.accepted_at := coalesce(new.accepted_at, now());
    insert into public.friend_permissions(owner_id, friend_id, share_training, share_progress, share_nutrition, share_measurements)
      values (new.requester_id, new.addressee_id, true, false, false, false)
      on conflict (owner_id, friend_id) do nothing;
    insert into public.friend_permissions(owner_id, friend_id, share_training, share_progress, share_nutrition, share_measurements)
      values (new.addressee_id, new.requester_id, true, false, false, false)
      on conflict (owner_id, friend_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists friendships_after_change on public.friendships;
create trigger friendships_after_change
before update on public.friendships
for each row execute function public.mucipes_friendship_after_change();

create or replace function public.get_friend_snapshot(friend_user uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  caller uuid := auth.uid();
  permitted public.friend_permissions%rowtype;
  snap public.social_snapshots%rowtype;
  prof public.social_profiles%rowtype;
  result jsonb := '{}'::jsonb;
begin
  if caller is null then
    raise exception 'Not authenticated';
  end if;

  if not exists (
    select 1 from public.friendships f
    where f.status = 'accepted'
      and ((f.requester_id = caller and f.addressee_id = friend_user)
        or (f.addressee_id = caller and f.requester_id = friend_user))
  ) then
    raise exception 'Friendship required';
  end if;

  select * into permitted
  from public.friend_permissions
  where owner_id = friend_user and friend_id = caller;

  select * into snap from public.social_snapshots where user_id = friend_user;
  select * into prof from public.social_profiles where user_id = friend_user;

  result := jsonb_build_object(
    'profile', case when prof.user_id is null then null else jsonb_build_object(
      'user_id', prof.user_id,
      'username', prof.username,
      'display_name', prof.display_name,
      'bio', prof.bio,
      'discoverable', prof.discoverable
    ) end
  );

  if permitted.share_training then result := result || jsonb_build_object('training', snap.training); end if;
  if permitted.share_progress then result := result || jsonb_build_object('progress', snap.progress); end if;
  if permitted.share_nutrition then result := result || jsonb_build_object('nutrition', snap.nutrition); end if;
  if permitted.share_measurements then result := result || jsonb_build_object('measurements', snap.measurements); end if;

  return result;
end;
$$;

revoke all on function public.get_friend_snapshot(uuid) from public;
grant execute on function public.get_friend_snapshot(uuid) to authenticated;
