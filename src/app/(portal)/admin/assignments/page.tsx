import { createTeacherAssignmentAction } from "@/app/(portal)/admin/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { listGroups, listSubjects, listTeacherAssignments, listTeachers } from "@/services/admin";

type AssignmentRow = {
  id: string;
  year: number;
  teacher?: { full_name?: string } | { full_name?: string }[] | null;
  group?: { code?: string; name?: string } | { code?: string; name?: string }[] | null;
  subject?: { code?: string; name?: string } | { code?: string; name?: string }[] | null;
};

function toSingle<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export default async function AdminAssignmentsPage() {
  const [assignments, teachers, groups, subjects] = await Promise.all([
    listTeacherAssignments(),
    listTeachers(),
    listGroups(),
    listSubjects(),
  ]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Admin - Teacher assignments</CardTitle>
          <CardDescription>Assign teachers to group and subject combinations.</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createTeacherAssignmentAction} className="grid gap-3 md:grid-cols-4">
            <label className="space-y-1 text-sm">
              <span>Teacher</span>
              <select
                name="teacherId"
                required
                className="h-10 w-full rounded-md border border-slate-300 px-2"
              >
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.full_name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span>Group</span>
              <select
                name="groupId"
                required
                className="h-10 w-full rounded-md border border-slate-300 px-2"
              >
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.code} - {group.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span>Subject</span>
              <select
                name="subjectId"
                required
                className="h-10 w-full rounded-md border border-slate-300 px-2"
              >
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.code} - {subject.name}
                  </option>
                ))}
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
            <button
              type="submit"
              className="h-10 rounded-md bg-slate-900 px-4 text-sm font-medium text-white md:col-span-4 md:w-fit"
            >
              Create assignment
            </button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-600">
                  <th className="px-2 py-2">Teacher</th>
                  <th className="px-2 py-2">Group</th>
                  <th className="px-2 py-2">Subject</th>
                  <th className="px-2 py-2">Year</th>
                </tr>
              </thead>
              <tbody>
                {(assignments as AssignmentRow[]).map((assignment) => {
                  const teacher = toSingle(assignment.teacher);
                  const group = toSingle(assignment.group);
                  const subject = toSingle(assignment.subject);

                  return (
                    <tr key={assignment.id} className="border-b border-slate-100">
                      <td className="px-2 py-2 text-slate-700">{teacher?.full_name ?? "-"}</td>
                      <td className="px-2 py-2 text-slate-700">
                        {group?.code ?? "-"} {group?.name ? `- ${group.name}` : ""}
                      </td>
                      <td className="px-2 py-2 text-slate-700">
                        {subject?.code ?? "-"} {subject?.name ? `- ${subject.name}` : ""}
                      </td>
                      <td className="px-2 py-2 text-slate-700">{assignment.year}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
