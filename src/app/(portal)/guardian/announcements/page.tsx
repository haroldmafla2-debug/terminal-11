import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { guardianAnnouncements } from "@/lib/mock/portal-data";

export default function GuardianAnnouncementsPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
          <CardDescription>Institutional and group notifications for families.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-3">
        {guardianAnnouncements.map((announcement) => (
          <Card key={`${announcement.title}-${announcement.date}`}>
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold text-slate-900">{announcement.title}</h3>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
                  {announcement.scope}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500">Date: {announcement.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
