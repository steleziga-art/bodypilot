-- Run once in Supabase SQL Editor after MUCIPES_V1_SOCIAL.sql has been installed.
-- Switch existing friendships to private: each owner can enable categories again in Friends.
alter table public.friend_permissions alter column share_training set default false;
update public.friend_permissions set share_training = false where share_training = true;

-- Old installed triggers still default to sharing training on acceptance.
create or replace function public.mucipes_friendship_after_change()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if new.requester_id is distinct from old.requester_id or new.addressee_id is distinct from old.addressee_id then
    raise exception 'Friendship participants cannot be changed';
  end if;
  if new.status = 'accepted' and old.status is distinct from 'accepted' and (old.status <> 'pending' or auth.uid() <> old.addressee_id) then
    raise exception 'Only the recipient can accept a pending request';
  end if;
  if new.status = 'accepted' and old.status is distinct from 'accepted' then
    new.accepted_at := coalesce(new.accepted_at, now());
    insert into public.friend_permissions(owner_id, friend_id, share_training, share_progress, share_nutrition, share_measurements)
      values (new.requester_id, new.addressee_id, false, false, false, false)
      on conflict (owner_id, friend_id) do nothing;
    insert into public.friend_permissions(owner_id, friend_id, share_training, share_progress, share_nutrition, share_measurements)
      values (new.addressee_id, new.requester_id, false, false, false, false)
      on conflict (owner_id, friend_id) do nothing;
  end if;
  return new;
end;
$$;
