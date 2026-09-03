-- Couple partners need to see each other's display name and avatar, not
-- just their own profile. Additive to the existing "own profile" policy
-- (RLS policies for the same command are OR'd together).
create policy "Couple partners can view each other's profile"
  on public.profiles for select
  using (
    exists (
      select 1
      from public.couple_members as mine
      join public.couple_members as theirs
        on theirs.couple_space_id = mine.couple_space_id
      where mine.user_id = auth.uid()
        and theirs.user_id = profiles.id
    )
  );
