-- Distinct years with memories, for the timeline's "jump to year" control.
-- A plain SELECT DISTINCT would work through PostgREST too, but a function
-- keeps the query (and its access check) explicit and reusable.
create function public.get_couple_space_years(p_couple_space_id uuid)
returns table (year int)
language sql
security definer set search_path = public
stable
as $$
  select distinct extract(year from captured_at)::int as year
  from public.memories
  where couple_space_id = p_couple_space_id
    and public.is_couple_member(p_couple_space_id)
  order by year desc;
$$;

grant execute on function public.get_couple_space_years(uuid) to authenticated;
