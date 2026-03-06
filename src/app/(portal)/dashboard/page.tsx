import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthContext } from "@/lib/auth/session";
import { ROLE_LABEL } from "@/lib/constants/roles";
import { ROLE_NAV } from "@/lib/constants/navigation";

export default async function DashboardPage() {
  const authContext = await getAuthContext();

  if (!authContext) {
    return null;
  }

  const links = ROLE_NAV[authContext.role].filter((item) => item.href !== "/dashboard");

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard de {ROLE_LABEL[authContext.role]}</CardTitle>
          <CardDescription>
            Bienvenido/a {authContext.email}. Este panel base se ampliará por módulos en PR2+.
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        {links.map((item) => (
          <Card key={item.href}>
            <CardHeader>
              <CardTitle>{item.label}</CardTitle>
              <CardDescription>Acceso rápido al módulo.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link className="text-sm font-medium text-slate-700 underline" href={item.href}>
                Abrir módulo
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
