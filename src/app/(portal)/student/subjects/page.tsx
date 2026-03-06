import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatGrid } from "@/components/portal/stat-grid";
import { studentSubjects } from "@/lib/mock/portal-data";

export default function StudentSubjectsPage() {
  const avg =
    studentSubjects.reduce((sum, item) => sum + item.current, 0) /
    Math.max(studentSubjects.length, 1);

  return (
    <div className="space-y-4">
      <StatGrid
        items={[
          { label: "Subjects", value: String(studentSubjects.length) },
          { label: "Current average", value: avg.toFixed(2) },
          { label: "Academic year", value: "2026" },
          { label: "Status", value: "Active" },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>My subjects</CardTitle>
          <CardDescription>Track your current grade and teacher by subject.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-600">
                  <th className="px-2 py-2">Code</th>
                  <th className="px-2 py-2">Subject</th>
                  <th className="px-2 py-2">Teacher</th>
                  <th className="px-2 py-2">Current</th>
                </tr>
              </thead>
              <tbody>
                {studentSubjects.map((subject) => (
                  <tr key={subject.code} className="border-b border-slate-100">
                    <td className="px-2 py-2 font-semibold text-slate-900">{subject.code}</td>
                    <td className="px-2 py-2 text-slate-700">{subject.name}</td>
                    <td className="px-2 py-2 text-slate-700">{subject.teacher}</td>
                    <td className="px-2 py-2 text-emerald-700">{subject.current.toFixed(1)}</td>
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
