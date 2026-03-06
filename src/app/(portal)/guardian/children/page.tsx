import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { guardianChildren } from "@/lib/mock/portal-data";

export default function GuardianChildrenPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Children overview</CardTitle>
          <CardDescription>Quick monitoring of attendance and academic average.</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-600">
                  <th className="px-2 py-2">Name</th>
                  <th className="px-2 py-2">Group</th>
                  <th className="px-2 py-2">Average</th>
                  <th className="px-2 py-2">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {guardianChildren.map((child) => (
                  <tr key={child.name} className="border-b border-slate-100">
                    <td className="px-2 py-2 font-semibold text-slate-900">{child.name}</td>
                    <td className="px-2 py-2 text-slate-700">{child.grade}</td>
                    <td className="px-2 py-2 text-emerald-700">{child.average.toFixed(2)}</td>
                    <td className="px-2 py-2 text-slate-700">{child.attendance}</td>
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
