import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { getAuthContext } from "@/lib/auth/session";
import { getDefaultRolePath } from "@/lib/constants/navigation";
import { loginAction } from "@/app/(auth)/login/actions";

export default async function LoginPage() {
  const authContext = await getAuthContext();
  if (authContext) {
    redirect(getDefaultRolePath(authContext.role));
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <LoginForm action={loginAction} />
    </main>
  );
}
