-- Couple spaces: a shared space owned by exactly two members.
create table public.couple_spaces (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Our Space',
  cover_path text,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.couple_members (
  id uuid primary key default gen_random_uuid(),
  couple_space_id uuid not null references public.couple_spaces (id) on delete cascade,
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now()
);

create table public.couple_invitations (
  id uuid primary key default gen_random_uuid(),
  couple_space_id uuid not null references public.couple_spaces (id) on delete cascade,
  code text not null unique,
  created_by uuid not null references public.profiles (id),
  expires_at timestamptz not null default (now() + interval '7 days'),
  used_at timestamptz,
  used_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create index couple_members_couple_space_id_idx
  on public.couple_members (couple_space_id);
create index couple_invitations_couple_space_id_idx
  on public.couple_invitations (couple_space_id);

alter table public.couple_spaces enable row level security;
alter table public.couple_members enable row level security;
alter table public.couple_invitations enable row level security;

-- A helper to check membership without recursive RLS lookups on couple_members itself.
create function public.is_couple_member(p_couple_space_id uuid)
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.couple_members
    where couple_space_id = p_couple_space_id
      and user_id = auth.uid()
  );
$$;

-- Reads are member-only. Writes happen exclusively through the RPC functions
-- below (security definer, owned by the migration role which bypasses RLS),
-- so no insert/update/delete policies are granted here: a user cannot add
-- themselves to a couple space directly, per the security requirements.
create policy "Members can view their couple space"
  on public.couple_spaces for select
  using (public.is_couple_member(id));

create policy "Members can view their couple membership"
  on public.couple_members for select
  using (public.is_couple_member(couple_space_id));

create policy "Members can view invitations for their couple space"
  on public.couple_invitations for select
  using (public.is_couple_member(couple_space_id));

create trigger set_couple_spaces_updated_at
  before update on public.couple_spaces
  for each row
  execute function public.set_updated_at();

-- Hard cap of two members per couple space, enforced at the database level
-- regardless of which path an insert comes through.
create function public.enforce_couple_member_limit()
returns trigger
language plpgsql
as $$
begin
  if (select count(*) from public.couple_members where couple_space_id = new.couple_space_id) >= 2 then
    raise exception 'A couple space cannot have more than two members.';
  end if;
  return new;
end;
$$;

create trigger couple_members_limit
  before insert on public.couple_members
  for each row
  execute function public.enforce_couple_member_limit();

-- Creates a couple space and adds the caller as its first member.
create function public.create_couple_space(p_name text default 'Our Space')
returns public.couple_spaces
language plpgsql
security definer set search_path = public
as $$
declare
  v_space public.couple_spaces;
begin
  if exists (select 1 from public.couple_members where user_id = auth.uid()) then
    raise exception 'You are already part of a couple space.';
  end if;

  insert into public.couple_spaces (name, created_by)
  values (coalesce(nullif(trim(p_name), ''), 'Our Space'), auth.uid())
  returning * into v_space;

  insert into public.couple_members (couple_space_id, user_id)
  values (v_space.id, auth.uid());

  return v_space;
end;
$$;

-- Creates a time-limited invitation code for the caller's couple space.
create function public.create_couple_invitation(p_couple_space_id uuid)
returns public.couple_invitations
language plpgsql
security definer set search_path = public
as $$
declare
  v_invitation public.couple_invitations;
begin
  if not public.is_couple_member(p_couple_space_id) then
    raise exception 'You are not a member of this couple space.';
  end if;

  if (select count(*) from public.couple_members where couple_space_id = p_couple_space_id) >= 2 then
    raise exception 'This couple space already has two members.';
  end if;

  insert into public.couple_invitations (couple_space_id, code, created_by)
  values (p_couple_space_id, upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8)), auth.uid())
  returning * into v_invitation;

  return v_invitation;
end;
$$;

-- Redeems an invitation code and adds the caller as the couple space's second member.
create function public.join_couple_space(p_code text)
returns public.couple_spaces
language plpgsql
security definer set search_path = public
as $$
declare
  v_invitation public.couple_invitations;
  v_space public.couple_spaces;
begin
  if exists (select 1 from public.couple_members where user_id = auth.uid()) then
    raise exception 'You are already part of a couple space.';
  end if;

  select * into v_invitation
  from public.couple_invitations
  where code = upper(trim(p_code))
    and used_at is null
    and expires_at > now()
  limit 1;

  if v_invitation is null then
    raise exception 'This invitation is invalid or has expired.';
  end if;

  if (select count(*) from public.couple_members where couple_space_id = v_invitation.couple_space_id) >= 2 then
    raise exception 'This couple space already has two members.';
  end if;

  insert into public.couple_members (couple_space_id, user_id)
  values (v_invitation.couple_space_id, auth.uid());

  update public.couple_invitations
  set used_at = now(), used_by = auth.uid()
  where id = v_invitation.id;

  select * into v_space from public.couple_spaces where id = v_invitation.couple_space_id;

  return v_space;
end;
$$;

grant execute on function public.create_couple_space(text) to authenticated;
grant execute on function public.create_couple_invitation(uuid) to authenticated;
grant execute on function public.join_couple_space(text) to authenticated;
