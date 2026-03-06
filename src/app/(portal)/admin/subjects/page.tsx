import { createSubjectAction } from "@/app/(portal)/admin/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { listSubjects } from "@/services/admin";

export default async function AdminSubjectsPage() {
  const subjects = await listSubjects();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Admin - Subjects</CardTitle>
          <CardDescription>Manage subject catalog for the school.</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create subject</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createSubjectAction} className="grid gap-3 md:grid-cols-3">
            <label className="space-y-1 text-sm">
              <span>Code</span>
              <input
                name="code"
                required
                placeholder="MAT"
                className="h-10 w-full rounded-md border border-slate-300 px-3"
              />
            </label>
            <label className="space-y-1 text-sm md:col-span-2">
              <span>Name</span>
              <input
                name="name"
                required
                placeholder="Mathematics"
                className="h-10 w-full rounded-md border border-slate-300 px-3"
              />
            </label>
            <button
              type="submit"
              className="h-10 rounded-md bg-slate-900 px-4 text-sm font-medium text-white md:col-span-3 md:w-fit"
            >
              Create subject
            </button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-600">
                  <th className="px-2 py-2">Code</th>
                  <th className="px-2 py-2">Name</th>
                  <th className="px-2 py-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject.id} className="border-b border-slate-100">
                    <td className="px-2 py-2 font-medium text-slate-800">{subject.code}</td>
                    <td className="px-2 py-2 text-slate-700">{subject.name}</td>
                    <td className="px-2 py-2 text-slate-600">
                      {new Date(subject.created_at).toLocaleDateString("en-US")}
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
