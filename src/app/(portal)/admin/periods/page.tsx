import { createPeriodAction } from "@/app/(portal)/admin/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { listPeriods } from "@/services/admin";

export default async function AdminPeriodsPage() {
  const periods = await listPeriods();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Admin - Periods</CardTitle>
          <CardDescription>Configure academic periods (P1 to P4).</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create period</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createPeriodAction} className="grid gap-3 md:grid-cols-4">
            <label className="space-y-1 text-sm">
              <span>Name</span>
              <select
                name="name"
                required
                className="h-10 w-full rounded-md border border-slate-300 px-2"
              >
                <option value="P1">P1</option>
                <option value="P2">P2</option>
                <option value="P3">P3</option>
                <option value="P4">P4</option>
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span>Year</span>
              <input
                name="year"
                type="number"
                defaultValue={2026}
                required
                className="h-10 w-full rounded-md border border-slate-300 px-3"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span>Start date</span>
              <input
                name="startDate"
                type="date"
                required
                className="h-10 w-full rounded-md border border-slate-300 px-3"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span>End date</span>
              <input
                name="endDate"
                type="date"
                required
                className="h-10 w-full rounded-md border border-slate-300 px-3"
              />
            </label>
            <button
              type="submit"
              className="h-10 rounded-md bg-slate-900 px-4 text-sm font-medium text-white md:col-span-4 md:w-fit"
            >
              Create period
            </button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Periods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-600">
                  <th className="px-2 py-2">Name</th>
                  <th className="px-2 py-2">Year</th>
                  <th className="px-2 py-2">Start</th>
                  <th className="px-2 py-2">End</th>
                </tr>
              </thead>
              <tbody>
                {periods.map((period) => (
                  <tr key={period.id} className="border-b border-slate-100">
                    <td className="px-2 py-2 font-medium text-slate-800">{period.name}</td>
                    <td className="px-2 py-2 text-slate-700">{period.year}</td>
                    <td className="px-2 py-2 text-slate-700">{period.start_date}</td>
                    <td className="px-2 py-2 text-slate-700">{period.end_date}</td>
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
