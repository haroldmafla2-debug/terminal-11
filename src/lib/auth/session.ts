import { cookies } from "next/headers";

import { resolveRole } from "@/lib/auth/guards";
import { PORTAL_ROLES, type PortalRole } from "@/lib/constants/roles";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type AuthContext = {
  role: PortalRole;
  email: string;
  userId: string;
  isGuest: boolean;
};

function resolveCookieRole(value: string | undefined): PortalRole {
  if (!value) {
    return "student";
  }

  return PORTAL_ROLES.includes(value as PortalRole) ? (value as PortalRole) : "student";
}

export async function getAuthContext(): Promise<AuthContext> {
  const cookieStore = await cookies();
  const cookieRole = resolveCookieRole(cookieStore.get("portal_role")?.value);

  if (!hasSupabaseEnv()) {
    return {
      role: cookieRole,
      email: "invitado@colegio.local",
      userId: `guest-${cookieRole}`,
      isGuest: true,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      role: cookieRole,
      email: "invitado@colegio.local",
      userId: `guest-${cookieRole}`,
      isGuest: true,
    };
  }

  const rawRole =
    (user.app_metadata?.role as string | undefined) ??
    (user.user_metadata?.role as string | undefined);

  return {
    role: resolveRole(rawRole),
    email: user.email ?? "sin-correo@colegio.local",
    userId: user.id,
    isGuest: false,
  };
}
