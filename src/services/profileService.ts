import { supabase } from "@/lib/supabase";
import type { Profile, ProfileUpdate } from "@/types/profile";
import { buildAvatarPath } from "@/utils/storagePaths";

export async function getCurrentProfile(
  userId: string,
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function uploadAvatar(
  userId: string,
  image: Blob,
): Promise<string> {
  const path = buildAvatarPath(userId);

  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, image, { contentType: "image/webp", upsert: true });

  if (error) {
    throw error;
  }

  return path;
}

export async function updateProfile(
  userId: string,
  updates: ProfileUpdate,
): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
