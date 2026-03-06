import Link from "next/link";

import { signOutAction, setPortalRoleAction } from "@/app/(portal)/actions";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAuthContext } from "@/lib/auth/session";
import { ROLE_NAV } from "@/lib/constants/navigation";
import { PORTAL_ROLES, ROLE_LABEL } from "@/lib/constants/roles";

export default async function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authContext = await getAuthContext();
  const navItems = ROLE_NAV[authContext.role];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#dff5f0,_transparent_35%),radial-gradient(circle_at_bottom_right,_#e5ecff,_transparent_38%),#f7fafc]">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-lg font-semibold text-slate-900">Portal Escolar IA</p>
            <p className="text-xs text-slate-600">[COLEGIO] - Ano 2026</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{ROLE_LABEL[authContext.role]}</Badge>
            <span className="hidden text-sm text-slate-600 md:inline">{authContext.email}</span>

            <form action={setPortalRoleAction} className="flex items-center gap-2">
              <select
                name="role"
                defaultValue={authContext.role}
                className="h-9 rounded-md border border-slate-300 bg-white px-2 text-sm"
                aria-label="Cambiar rol"
              >
                {PORTAL_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {ROLE_LABEL[role]}
                  </option>
                ))}
              </select>
              <Button type="submit" variant="secondary" size="sm">
                Cambiar
              </Button>
            </form>

            {!authContext.isGuest ? (
              <form action={signOutAction}>
                <Button type="submit" variant="outline" size="sm">
                  Salir
                </Button>
              </form>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <SidebarNav items={navItems} />
          <div className="mt-5 border-t border-slate-200 pt-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-slate-600 underline decoration-slate-400 underline-offset-2"
            >
              Ir al panel principal
            </Link>
          </div>
        </aside>
        <section className="space-y-4">{children}</section>
      </div>
    </div>
  );
}
