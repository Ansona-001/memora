-- Profile and settings: avatar uploads, couple space editing, leaving a
-- couple space, and self-service account deletion.

-- Checks whether the caller shares a couple space with the given user, so
-- partners can view each other's private avatar images.
create function public.is_couple_partner_of(p_user_id uuid)
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1
    from public.couple_members cm1
    join public.couple_members cm2 on cm1.couple_space_id = cm2.couple_space_id
    where cm1.user_id = auth.uid()
      and cm2.user_id = p_user_id
  );
$$;

-- Private storage buckets for profile avatars and couple space covers.
insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', false),
  ('couple-covers', 'couple-covers', false);

-- Object paths are "{userId}/...", so the first path segment is the owner.
create policy "Users can manage their own avatar objects"
  on storage.objects for all
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Partners can view each other's avatar objects"
  on storage.objects for select
  using (
    bucket_id = 'avatars'
    and public.is_couple_partner_of(((storage.foldername(name))[1])::uuid)
  );

-- Object paths are "{coupleSpaceId}/...", so the first path segment is the
-- couple space id membership is checked against.
create policy "Couple members can manage their cover objects"
  on storage.objects for all
  using (
    bucket_id = 'couple-covers'
    and public.is_couple_member(((storage.foldername(name))[1])::uuid)
  )
  with check (
    bucket_id = 'couple-covers'
    and public.is_couple_member(((storage.foldername(name))[1])::uuid)
  );

-- Couple spaces were previously write-only through RPCs. Members now need to
-- rename their space and change its cover directly.
create policy "Members can update their couple space"
  on public.couple_spaces for update
  using (public.is_couple_member(id))
  with check (public.is_couple_member(id));

-- Member updates are limited to name/cover_path; identity fields stay fixed.
create function public.protect_couple_space_identity()
returns trigger
language plpgsql
as $$
begin
  if new.id <> old.id or new.created_by <> old.created_by then
    raise exception 'Cannot modify couple space identity fields.';
  end if;
  return new;
end;
$$;

create trigger protect_couple_spaces_identity
  before update on public.couple_spaces
  for each row
  execute function public.protect_couple_space_identity();

-- A couple space, its memories and its albums must be able to outlive any
-- single member leaving or deleting their account, so authorship references
-- fall back to null instead of blocking the delete.
alter table public.memories alter column created_by drop not null;
alter table public.memories drop constraint memories_created_by_fkey;
alter table public.memories add constraint memories_created_by_fkey
  foreign key (created_by) references public.profiles (id) on delete set null;

alter table public.albums alter column created_by drop not null;
alter table public.albums drop constraint albums_created_by_fkey;
alter table public.albums add constraint albums_created_by_fkey
  foreign key (created_by) references public.profiles (id) on delete set null;

alter table public.couple_spaces alter column created_by drop not null;
alter table public.couple_spaces drop constraint couple_spaces_created_by_fkey;
alter table public.couple_spaces add constraint couple_spaces_created_by_fkey
  foreign key (created_by) references public.profiles (id) on delete set null;

-- Stale invitations should not block deleting the account that created or
-- redeemed them.
alter table public.couple_invitations drop constraint couple_invitations_created_by_fkey;
alter table public.couple_invitations add constraint couple_invitations_created_by_fkey
  foreign key (created_by) references public.profiles (id) on delete cascade;

alter table public.couple_invitations drop constraint couple_invitations_used_by_fkey;
alter table public.couple_invitations add constraint couple_invitations_used_by_fkey
  foreign key (used_by) references public.profiles (id) on delete set null;

-- Removes the caller from their couple space. If they were the only member,
-- the space (and everything in it, via cascade) is removed too; otherwise
-- the space and its shared memories stay with the remaining partner.
create function public.leave_couple_space()
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_space_id uuid;
  v_remaining int;
begin
  select couple_space_id into v_space_id
  from public.couple_members
  where user_id = auth.uid();

  if v_space_id is null then
    raise exception 'You are not part of a couple space.';
  end if;

  delete from public.couple_members where user_id = auth.uid();

  select count(*) into v_remaining
  from public.couple_members
  where couple_space_id = v_space_id;

  if v_remaining = 0 then
    delete from public.couple_spaces where id = v_space_id;
  end if;
end;
$$;

-- Permanently deletes the caller's account. Leaves any couple space first
-- (see leave_couple_space semantics above), then removes the auth user,
-- which cascades to their profile row.
create function public.delete_own_account()
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_space_id uuid;
  v_remaining int;
begin
  if v_uid is null then
    raise exception 'Not authenticated.';
  end if;

  select couple_space_id into v_space_id
  from public.couple_members
  where user_id = v_uid;

  if v_space_id is not null then
    delete from public.couple_members where user_id = v_uid;

    select count(*) into v_remaining
    from public.couple_members
    where couple_space_id = v_space_id;

    if v_remaining = 0 then
      delete from public.couple_spaces where id = v_space_id;
    end if;
  end if;

  delete from auth.users where id = v_uid;
end;
$$;

grant execute on function public.leave_couple_space() to authenticated;
grant execute on function public.delete_own_account() to authenticated;
