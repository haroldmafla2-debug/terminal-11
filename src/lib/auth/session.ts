import { resolveRole } from "@/lib/auth/guards";
import type { PortalRole } from "@/lib/constants/roles";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type AuthContext = {
  role: PortalRole;
  email: string;
  userId: string;
};

export async function getAuthContext(): Promise<AuthContext | null> {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Decision: metadata role fallback keeps PR1 moving until profiles table exists in PR2.
  const rawRole =
    (user.app_metadata?.role as string | undefined) ??
    (user.user_metadata?.role as string | undefined);

  return {
    role: resolveRole(rawRole),
    email: user.email ?? "sin-correo@colegio.local",
    userId: user.id,
  };
}