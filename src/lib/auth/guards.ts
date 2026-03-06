import {
  DEFAULT_ROLE,
  PORTAL_ROLES,
  ROLE_ALLOWED_PREFIXES,
  type PortalRole,
} from "@/lib/constants/roles";

export function resolveRole(rawRole: string | null | undefined): PortalRole {
  if (!rawRole) {
    return DEFAULT_ROLE;
  }

  const normalized = rawRole.toLowerCase().trim();
  if (PORTAL_ROLES.includes(normalized as PortalRole)) {
    return normalized as PortalRole;
  }

  return DEFAULT_ROLE;
}

export function canAccessPath(pathname: string, role: PortalRole): boolean {
  const allowedPrefixes = ROLE_ALLOWED_PREFIXES[role];
  return allowedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}
