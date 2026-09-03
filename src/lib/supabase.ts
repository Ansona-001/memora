import { createClient } from "@supabase/supabase-js";

import { env } from "@/config/environment";
import type { Database } from "@/types/database";

export const supabase = createClient<Database>(
  env.supabaseUrl,
  env.supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);
