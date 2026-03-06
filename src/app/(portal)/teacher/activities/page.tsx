import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { activities } from "@/lib/mock/portal-data";

export default function TeacherActivitiesPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Activity manager</CardTitle>
          <CardDescription>
            Create, schedule and track learning activities by group and period.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-5">
            <input
              placeholder="Title"
              className="h-10 rounded-md border border-slate-300 px-3 text-sm md:col-span-2"
            />
            <select className="h-10 rounded-md border border-slate-300 px-2 text-sm">
              <option>Group 10A</option>
              <option>Group 9B</option>
            </select>
            <select className="h-10 rounded-md border border-slate-300 px-2 text-sm">
              <option>P1</option>
              <option>P2</option>
            </select>
            <button className="h-10 rounded-md bg-slate-900 px-4 text-sm font-medium text-white">
              Create activity
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-600">
                  <th className="px-2 py-2">Title</th>
                  <th className="px-2 py-2">Group</th>
                  <th className="px-2 py-2">Period</th>
                  <th className="px-2 py-2">Due date</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">Submissions</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr
                    key={`${activity.title}-${activity.group}`}
                    className="border-b border-slate-100"
                  >
                    <td className="px-2 py-2 font-medium text-slate-900">{activity.title}</td>
                    <td className="px-2 py-2 text-slate-700">{activity.group}</td>
                    <td className="px-2 py-2 text-slate-700">{activity.period}</td>
                    <td className="px-2 py-2 text-slate-700">{activity.dueDate}</td>
                    <td className="px-2 py-2 text-slate-700">{activity.status}</td>
                    <td className="px-2 py-2 text-slate-700">{activity.submissions}</td>
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
