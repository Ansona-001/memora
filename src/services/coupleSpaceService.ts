import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types/profile";

export interface CoupleMemberWithProfile {
  userId: string;
  joinedAt: string;
  profile: Profile | null;
}

export interface CoupleSpaceWithMembers {
  id: string;
  name: string;
  coverPath: string | null;
  members: CoupleMemberWithProfile[];
}

export async function getCurrentCoupleSpace(
  userId: string,
): Promise<CoupleSpaceWithMembers | null> {
  const { data: membership, error: membershipError } = await supabase
    .from("couple_members")
    .select("couple_space_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (membershipError) {
    throw membershipError;
  }

  if (!membership) {
    return null;
  }

  const [
    { data: space, error: spaceError },
    { data: members, error: membersError },
  ] = await Promise.all([
    supabase
      .from("couple_spaces")
      .select("*")
      .eq("id", membership.couple_space_id)
      .single(),
    supabase
      .from("couple_members")
      .select("user_id, joined_at, profile:profiles(*)")
      .eq("couple_space_id", membership.couple_space_id),
  ]);

  if (spaceError) {
    throw spaceError;
  }
  if (membersError) {
    throw membersError;
  }

  return {
    id: space.id,
    name: space.name,
    coverPath: space.cover_path,
    members: (members ?? []).map((member) => ({
      userId: member.user_id,
      joinedAt: member.joined_at,
      profile: member.profile,
    })),
  };
}

export async function createCoupleSpace(name: string) {
  const { data, error } = await supabase.rpc("create_couple_space", {
    p_name: name,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function joinCoupleSpace(code: string) {
  const { data, error } = await supabase.rpc("join_couple_space", {
    p_code: code,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function createCoupleInvitation(coupleSpaceId: string) {
  const { data, error } = await supabase.rpc("create_couple_invitation", {
    p_couple_space_id: coupleSpaceId,
  });

  if (error) {
    throw error;
  }

  return data;
}
