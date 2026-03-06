import { resolveRole } from "@/lib/auth/guards";
import type { PortalRole } from "@/lib/constants/roles";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type AuthContext = {
  role: PortalRole;
  email: string;
  userId: string;
};

const GUEST_CONTEXT: AuthContext = {
  // Decision: defaulting to student avoids protected admin data queries when auth is disabled.
  role: "student",
  email: "invitado@colegio.local",
  userId: "guest-user",
};

export async function getAuthContext(): Promise<AuthContext> {
  if (!hasSupabaseEnv()) {
    return GUEST_CONTEXT;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return GUEST_CONTEXT;
  }

  const rawRole =
    (user.app_metadata?.role as string | undefined) ??
    (user.user_metadata?.role as string | undefined);

  return {
    role: resolveRole(rawRole),
    email: user.email ?? "sin-correo@colegio.local",
    userId: user.id,
  };
}