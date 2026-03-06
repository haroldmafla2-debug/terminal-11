import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatGrid } from "@/components/portal/stat-grid";
import { coordinationRisks } from "@/lib/mock/portal-data";

export default function CoordinationPage() {
  return (
    <div className="space-y-4">
      <StatGrid
        items={[
          { label: "Open cases", value: String(coordinationRisks.length) },
          {
            label: "High priority",
            value: String(coordinationRisks.filter((c) => c.level === "High").length),
          },
          { label: "Intervention teams", value: "3" },
          { label: "Weekly closure", value: "82%" },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Academic and coexistence monitoring</CardTitle>
          <CardDescription>Prioritized risk cases for coordination follow-up.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-600">
                  <th className="px-2 py-2">Case ID</th>
                  <th className="px-2 py-2">Student</th>
                  <th className="px-2 py-2">Type</th>
                  <th className="px-2 py-2">Level</th>
                  <th className="px-2 py-2">Owner</th>
                </tr>
              </thead>
              <tbody>
                {coordinationRisks.map((risk) => (
                  <tr key={risk.caseId} className="border-b border-slate-100">
                    <td className="px-2 py-2 font-semibold text-slate-900">{risk.caseId}</td>
                    <td className="px-2 py-2 text-slate-700">{risk.student}</td>
                    <td className="px-2 py-2 text-slate-700">{risk.type}</td>
                    <td className="px-2 py-2 text-slate-700">{risk.level}</td>
                    <td className="px-2 py-2 text-slate-700">{risk.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
