import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";

const DEFAULT_EXPIRES_IN_SECONDS = 60 * 60;

export function useSignedUrl(
  bucket: string,
  path: string | null | undefined,
  expiresInSeconds: number = DEFAULT_EXPIRES_IN_SECONDS,
) {
  return useQuery({
    queryKey: ["signed-url", bucket, path, expiresInSeconds],
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path!, expiresInSeconds);

      if (error) {
        throw error;
      }

      return data.signedUrl;
    },
    enabled: Boolean(path),
    staleTime: (expiresInSeconds - 60) * 1000,
  });
}
