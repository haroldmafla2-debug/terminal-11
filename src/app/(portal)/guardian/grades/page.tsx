import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { studentGrades } from "@/lib/mock/portal-data";

export default function GuardianGradesPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Academic follow-up</CardTitle>
          <CardDescription>Grades by period for your children.</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-600">
                  <th className="px-2 py-2">Subject</th>
                  <th className="px-2 py-2">P1</th>
                  <th className="px-2 py-2">P2</th>
                  <th className="px-2 py-2">P3</th>
                  <th className="px-2 py-2">P4</th>
                </tr>
              </thead>
              <tbody>
                {studentGrades.map((row) => (
                  <tr key={row.subject} className="border-b border-slate-100">
                    <td className="px-2 py-2 text-slate-900">{row.subject}</td>
                    <td className="px-2 py-2 text-slate-700">
                      {row.p1 > 0 ? row.p1.toFixed(1) : "-"}
                    </td>
                    <td className="px-2 py-2 text-slate-700">
                      {row.p2 > 0 ? row.p2.toFixed(1) : "-"}
                    </td>
                    <td className="px-2 py-2 text-slate-700">
                      {row.p3 > 0 ? row.p3.toFixed(1) : "-"}
                    </td>
                    <td className="px-2 py-2 text-slate-700">
                      {row.p4 > 0 ? row.p4.toFixed(1) : "-"}
                    </td>
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
