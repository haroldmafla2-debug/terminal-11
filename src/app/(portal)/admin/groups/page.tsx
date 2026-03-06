import { createGroupAction } from "@/app/(portal)/admin/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { listGrades, listGroups } from "@/services/admin";

type GroupRow = {
  id: string;
  code: string;
  name: string;
  year: number;
  grades?: { name?: string } | { name?: string }[] | null;
};

function resolveGradeName(group: GroupRow) {
  if (Array.isArray(group.grades)) {
    return group.grades[0]?.name ?? "-";
  }

  return group.grades?.name ?? "-";
}

export default async function AdminGroupsPage() {
  const [grades, groups] = await Promise.all([listGrades(), listGroups()]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Admin - Groups</CardTitle>
          <CardDescription>Create and list groups for the academic year.</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create group</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createGroupAction} className="grid gap-3 md:grid-cols-4">
            <label className="space-y-1 text-sm">
              <span>Grade</span>
              <select
                name="gradeId"
                required
                className="h-10 w-full rounded-md border border-slate-300 px-2"
              >
                {grades.map((grade) => (
                  <option key={grade.id} value={grade.id}>
                    {grade.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span>Code</span>
              <input
                name="code"
                required
                placeholder="10A"
                className="h-10 w-full rounded-md border border-slate-300 px-3"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span>Name</span>
              <input
                name="name"
                required
                placeholder="Tenth A"
                className="h-10 w-full rounded-md border border-slate-300 px-3"
              />
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
            <button
              type="submit"
              className="h-10 rounded-md bg-slate-900 px-4 text-sm font-medium text-white md:col-span-4 md:w-fit"
            >
              Create group
            </button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Groups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-600">
                  <th className="px-2 py-2">Code</th>
                  <th className="px-2 py-2">Name</th>
                  <th className="px-2 py-2">Grade</th>
                  <th className="px-2 py-2">Year</th>
                </tr>
              </thead>
              <tbody>
                {(groups as GroupRow[]).map((group) => (
                  <tr key={group.id} className="border-b border-slate-100">
                    <td className="px-2 py-2 font-medium text-slate-800">{group.code}</td>
                    <td className="px-2 py-2 text-slate-700">{group.name}</td>
                    <td className="px-2 py-2 text-slate-700">{resolveGradeName(group)}</td>
                    <td className="px-2 py-2 text-slate-700">{group.year}</td>
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
