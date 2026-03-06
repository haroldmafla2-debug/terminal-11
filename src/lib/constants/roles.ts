export const PORTAL_ROLES = ["admin", "coordination", "teacher", "student", "guardian"] as const;

export type PortalRole = (typeof PORTAL_ROLES)[number];

export const DEFAULT_ROLE: PortalRole = "student";

export const ROLE_LABEL: Record<PortalRole, string> = {
  admin: "Admin",
  coordination: "Rectoría / Coordinación",
  teacher: "Docente",
  student: "Estudiante",
  guardian: "Acudiente",
};

export const ROLE_HOME: Record<PortalRole, string> = {
  admin: "/admin/users",
  coordination: "/coordination",
  teacher: "/teacher/groups",
  student: "/student/subjects",
  guardian: "/guardian/children",
};

export const ROLE_ALLOWED_PREFIXES: Record<PortalRole, string[]> = {
  admin: ["/dashboard", "/admin", "/unauthorized"],
  coordination: ["/dashboard", "/coordination", "/unauthorized"],
  teacher: ["/dashboard", "/teacher", "/unauthorized"],
  student: ["/dashboard", "/student", "/unauthorized"],
  guardian: ["/dashboard", "/guardian", "/unauthorized"],
};
