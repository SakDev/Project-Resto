import { createClient } from "@supabase/supabase-js";

import { env, hasSupabaseEnv } from "@/lib/env";
import type { Database } from "@/types/database";

export function createBrowserSupabaseClient() {
  if (!hasSupabaseEnv()) {
    throw new Error("Supabase browser client requested before environment was configured.");
  }

  return createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    },
  );
}