import { ROLE_HOME, type PortalRole } from "@/lib/constants/roles";

export type RoleNavItem = {
  label: string;
  href: string;
};

export const DASHBOARD_NAV: RoleNavItem = { label: "Dashboard", href: "/dashboard" };

export const ROLE_NAV: Record<PortalRole, RoleNavItem[]> = {
  admin: [
    DASHBOARD_NAV,
    { label: "Usuarios y Roles", href: "/admin/users" },
    { label: "Grupos", href: "/admin/groups" },
    { label: "Materias", href: "/admin/subjects" },
    { label: "Asignaciones", href: "/admin/assignments" },
    { label: "Periodos", href: "/admin/periods" },
  ],
  coordination: [DASHBOARD_NAV, { label: "Panel Coordinación", href: "/coordination" }],
  teacher: [
    DASHBOARD_NAV,
    { label: "Mis grupos", href: "/teacher/groups" },
    { label: "Actividades", href: "/teacher/activities" },
    { label: "Calificar", href: "/teacher/grading" },
    { label: "Asistencia", href: "/teacher/attendance" },
  ],
  student: [
    DASHBOARD_NAV,
    { label: "Mis materias", href: "/student/subjects" },
    { label: "Actividades", href: "/student/activities" },
    { label: "Notas", href: "/student/grades" },
    { label: "Boletín", href: "/student/report-card" },
  ],
  guardian: [
    DASHBOARD_NAV,
    { label: "Hijos", href: "/guardian/children" },
    { label: "Notas", href: "/guardian/grades" },
    { label: "Comunicados", href: "/guardian/announcements" },
  ],
};

export function getDefaultRolePath(role: PortalRole) {
  return ROLE_HOME[role];
}
