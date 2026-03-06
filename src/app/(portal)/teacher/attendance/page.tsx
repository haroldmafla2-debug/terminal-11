import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { attendanceRows } from "@/lib/mock/portal-data";

export default function TeacherAttendancePage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Attendance control</CardTitle>
          <CardDescription>
            Mark attendance by date and group, with quick status update.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <input
              type="date"
              defaultValue="2026-03-05"
              className="h-10 rounded-md border border-slate-300 px-3 text-sm"
            />
            <select className="h-10 rounded-md border border-slate-300 px-2 text-sm">
              <option>Group 10A</option>
              <option>Group 9B</option>
            </select>
            <button className="h-10 rounded-md bg-slate-900 px-4 text-sm font-medium text-white">
              Load list
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daily records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-600">
                  <th className="px-2 py-2">Student</th>
                  <th className="px-2 py-2">Group</th>
                  <th className="px-2 py-2">Date</th>
                  <th className="px-2 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRows.map((row) => (
                  <tr key={`${row.student}-${row.date}`} className="border-b border-slate-100">
                    <td className="px-2 py-2 text-slate-800">{row.student}</td>
                    <td className="px-2 py-2 text-slate-700">{row.group}</td>
                    <td className="px-2 py-2 text-slate-700">{row.date}</td>
                    <td className="px-2 py-2">
                      <select
                        defaultValue={row.status}
                        className="h-9 rounded-md border border-slate-300 px-2"
                      >
                        <option>Present</option>
                        <option>Absent</option>
                        <option>Late</option>
                        <option>Excused</option>
                      </select>
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
