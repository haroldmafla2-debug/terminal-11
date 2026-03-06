"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { PORTAL_ROLES, type PortalRole } from "@/lib/constants/roles";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

function isPortalRole(value: string): value is PortalRole {
  return PORTAL_ROLES.includes(value as PortalRole);
}

export async function setPortalRoleAction(formData: FormData) {
  const requested = String(formData.get("role") ?? "student")
    .toLowerCase()
    .trim();
  const role: PortalRole = isPortalRole(requested) ? requested : "student";

  const cookieStore = await cookies();
  cookieStore.set("portal_role", role, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    secure: true,
    maxAge: 60 * 60 * 24 * 30,
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function signOutAction() {
  if (!hasSupabaseEnv()) {
    redirect("/dashboard");
  }

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/dashboard");
}
