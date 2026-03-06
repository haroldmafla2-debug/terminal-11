import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { studentActivities } from "@/lib/mock/portal-data";

export default function StudentActivitiesPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>My activities</CardTitle>
          <CardDescription>Deadlines and progress in one timeline.</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity list</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {studentActivities.map((activity) => (
              <article
                key={`${activity.title}-${activity.dueDate}`}
                className="rounded-lg border border-slate-200 bg-white p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-slate-900">{activity.title}</h3>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
                    {activity.progress}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{activity.subject}</p>
                <p className="mt-2 text-xs text-slate-500">Due: {activity.dueDate}</p>
              </article>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
