import { AiAssistant } from "@/components/dashboard/ai-assistant";
import { DashboardOverview } from "@/components/dashboard/overview";
import { RoleMetrics } from "@/components/dashboard/role-metrics";
import { getAuthContext } from "@/lib/auth/session";
import { ROLE_NAV } from "@/lib/constants/navigation";

export default async function DashboardPage() {
  const authContext = await getAuthContext();
  const links = ROLE_NAV[authContext.role].filter((item) => item.href !== "/dashboard");

  return (
    <div className="space-y-4">
      <DashboardOverview role={authContext.role} email={authContext.email} links={links} />
      <RoleMetrics role={authContext.role} />
      <AiAssistant role={authContext.role} />
    </div>
  );
}
