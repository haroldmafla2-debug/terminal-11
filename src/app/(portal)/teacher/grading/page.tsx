import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { gradebookRows } from "@/lib/mock/portal-data";

export default function TeacherGradingPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Gradebook</CardTitle>
          <CardDescription>
            Inline grading workflow with quick feedback and validation scale 0.0 - 5.0.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scores by activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-600">
                  <th className="px-2 py-2">Student</th>
                  <th className="px-2 py-2">Group</th>
                  <th className="px-2 py-2">Activity</th>
                  <th className="px-2 py-2">Score</th>
                  <th className="px-2 py-2">Feedback</th>
                </tr>
              </thead>
              <tbody>
                {gradebookRows.map((row) => (
                  <tr key={`${row.student}-${row.activity}`} className="border-b border-slate-100">
                    <td className="px-2 py-2 text-slate-800">{row.student}</td>
                    <td className="px-2 py-2 text-slate-700">{row.group}</td>
                    <td className="px-2 py-2 text-slate-700">{row.activity}</td>
                    <td className="px-2 py-2">
                      <input
                        defaultValue={row.score}
                        type="number"
                        step="0.1"
                        min={0}
                        max={5}
                        className="h-9 w-24 rounded-md border border-slate-300 px-2"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        defaultValue={row.feedback}
                        className="h-9 w-full min-w-56 rounded-md border border-slate-300 px-2"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">
            Save grade changes
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
