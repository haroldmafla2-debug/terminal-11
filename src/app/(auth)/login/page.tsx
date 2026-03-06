import { redirect } from "next/navigation";

import { loginAction } from "@/app/(auth)/login/actions";
import { LoginForm } from "@/components/auth/login-form";
import { getAuthContext } from "@/lib/auth/session";
import { getDefaultRolePath } from "@/lib/constants/navigation";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const authContext = await getAuthContext();
  if (authContext) {
    redirect(getDefaultRolePath(authContext.role));
  }

  const params = searchParams ? await searchParams : undefined;
  const missingEnv = !hasSupabaseEnv() || params?.error === "missing_env";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-md space-y-4">
        {missingEnv ? (
          <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            Supabase env vars are missing in deployment. Configure
            `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel.
          </div>
        ) : null}
        <LoginForm action={loginAction} />
      </div>
    </main>
  );
}