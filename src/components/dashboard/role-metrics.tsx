import type { PortalRole } from "@/lib/constants/roles";

type Metric = {
  label: string;
  value: string;
  tone: string;
};

const METRICS_BY_ROLE: Record<PortalRole, Metric[]> = {
  admin: [
    { label: "Usuarios activos", value: "124", tone: "bg-emerald-100 text-emerald-700" },
    { label: "Procesos pendientes", value: "08", tone: "bg-amber-100 text-amber-700" },
    { label: "Cumplimiento academico", value: "91%", tone: "bg-sky-100 text-sky-700" },
  ],
  coordination: [
    { label: "Casos en seguimiento", value: "12", tone: "bg-amber-100 text-amber-700" },
    { label: "Alertas tempranas", value: "05", tone: "bg-rose-100 text-rose-700" },
    { label: "Planes cerrados", value: "23", tone: "bg-emerald-100 text-emerald-700" },
  ],
  teacher: [
    { label: "Actividades semana", value: "06", tone: "bg-sky-100 text-sky-700" },
    { label: "Notas por cargar", value: "18", tone: "bg-amber-100 text-amber-700" },
    { label: "Asistencia al dia", value: "96%", tone: "bg-emerald-100 text-emerald-700" },
  ],
  student: [
    { label: "Materias activas", value: "08", tone: "bg-sky-100 text-sky-700" },
    { label: "Tareas pendientes", value: "04", tone: "bg-amber-100 text-amber-700" },
    { label: "Promedio actual", value: "4.2", tone: "bg-emerald-100 text-emerald-700" },
  ],
  guardian: [
    { label: "Hijos vinculados", value: "01", tone: "bg-sky-100 text-sky-700" },
    { label: "Comunicados nuevos", value: "03", tone: "bg-amber-100 text-amber-700" },
    { label: "Rendimiento general", value: "Bueno", tone: "bg-emerald-100 text-emerald-700" },
  ],
};

type RoleMetricsProps = {
  role: PortalRole;
};

export function RoleMetrics({ role }: RoleMetricsProps) {
  const items = METRICS_BY_ROLE[role];

  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.label}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <p className="text-xs tracking-wide text-slate-500 uppercase">{item.label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
          <span
            className={`mt-3 inline-flex rounded-full px-2 py-1 text-xs font-medium ${item.tone}`}
          >
            actualizado
          </span>
        </article>
      ))}
    </section>
  );
}
