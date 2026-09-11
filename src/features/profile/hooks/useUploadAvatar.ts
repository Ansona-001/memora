import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";
import { useAuth } from "@/hooks/useAuth";
import { updateProfile, uploadAvatar } from "@/services/profileService";
import { compressProfileImage } from "@/utils/mediaUtils";

export function useUploadAvatar() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const image = await compressProfileImage(file);
      const path = await uploadAvatar(user!.id, image);
      return updateProfile(user!.id, { avatar_path: path });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.coupleSpace.all });
      queryClient.invalidateQueries({ queryKey: ["signed-url", "avatars"] });
    },
  });
}
