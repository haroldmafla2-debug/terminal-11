import Link from "next/link";

import type { RoleNavItem } from "@/lib/constants/navigation";
import { ROLE_LABEL, type PortalRole } from "@/lib/constants/roles";

type DashboardOverviewProps = {
  role: PortalRole;
  email: string;
  links: RoleNavItem[];
};

const ROLE_HINTS: Record<PortalRole, string> = {
  admin: "Gestiona usuarios, periodos y estructura academica desde un solo lugar.",
  coordination: "Supervisa seguimiento academico y convivencia con trazabilidad.",
  teacher: "Planea, califica y comunica en minutos, no en horas.",
  student: "Organiza tu estudio y mide tu progreso por materia.",
  guardian: "Acompana el avance academico con informacion clara y oportuna.",
};

export function DashboardOverview({ role, email, links }: DashboardOverviewProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-teal-700 uppercase">
            Portal inteligente
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">{ROLE_LABEL[role]}</h1>
          <p className="mt-1 text-sm text-slate-600">{ROLE_HINTS[role]}</p>
          <p className="mt-2 text-xs text-slate-500">Sesion activa: {email}</p>
        </div>
        <div className="rounded-xl bg-slate-900 px-3 py-2 text-right text-white">
          <p className="text-xs tracking-wide text-slate-300 uppercase">Estado</p>
          <p className="text-lg font-semibold">Operativo</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-teal-300 hover:bg-white"
          >
            <p className="text-sm font-semibold text-slate-900 group-hover:text-teal-800">
              {item.label}
            </p>
            <p className="mt-1 text-xs text-slate-600">Ir al modulo</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
