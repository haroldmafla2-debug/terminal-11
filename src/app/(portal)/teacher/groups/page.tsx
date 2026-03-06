import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatGrid } from "@/components/portal/stat-grid";
import { teacherGroups } from "@/lib/mock/portal-data";

export default function TeacherGroupsPage() {
  return (
    <div className="space-y-4">
      <StatGrid
        items={[
          { label: "Assigned groups", value: String(teacherGroups.length) },
          {
            label: "Students",
            value: String(teacherGroups.reduce((sum, g) => sum + g.students, 0)),
          },
          {
            label: "Avg attendance",
            value: `${Math.round(teacherGroups.reduce((sum, g) => sum + g.attendance, 0) / teacherGroups.length)}%`,
          },
          { label: "Current year", value: "2026" },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>My groups</CardTitle>
          <CardDescription>Operational view for class management and tracking.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-600">
                  <th className="px-2 py-2">Group</th>
                  <th className="px-2 py-2">Grade</th>
                  <th className="px-2 py-2">Subject</th>
                  <th className="px-2 py-2">Students</th>
                  <th className="px-2 py-2">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {teacherGroups.map((group) => (
                  <tr key={group.id} className="border-b border-slate-100">
                    <td className="px-2 py-2 font-semibold text-slate-900">{group.id}</td>
                    <td className="px-2 py-2 text-slate-700">{group.grade}</td>
                    <td className="px-2 py-2 text-slate-700">{group.subject}</td>
                    <td className="px-2 py-2 text-slate-700">{group.students}</td>
                    <td className="px-2 py-2 text-emerald-700">{group.attendance}%</td>
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
