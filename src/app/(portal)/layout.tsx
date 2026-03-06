import Link from "next/link";
import { redirect } from "next/navigation";

import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAuthContext } from "@/lib/auth/session";
import { ROLE_NAV } from "@/lib/constants/navigation";
import { ROLE_LABEL } from "@/lib/constants/roles";
import { signOutAction } from "@/app/(portal)/actions";

export default async function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authContext = await getAuthContext();

  if (!authContext) {
    redirect("/login");
  }

  const navItems = ROLE_NAV[authContext.role];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3">
          <div>
            <p className="text-lg font-semibold text-slate-900">Portal Web Escolar</p>
            <p className="text-xs text-slate-600">[COLEGIO] - Año 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge>{ROLE_LABEL[authContext.role]}</Badge>
            <span className="hidden text-sm text-slate-600 md:inline">{authContext.email}</span>
            <form action={signOutAction}>
              <Button type="submit" variant="outline" size="sm">
                Cerrar sesión
              </Button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 md:grid-cols-[260px_1fr]">
        <aside className="rounded-lg border border-slate-200 bg-white p-4">
          <SidebarNav items={navItems} />
          <div className="mt-5 border-t border-slate-200 pt-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-slate-600 underline decoration-slate-400 underline-offset-2"
            >
              Volver al inicio
            </Link>
          </div>
        </aside>
        <section className="space-y-4">{children}</section>
      </div>
    </div>
  );
}
