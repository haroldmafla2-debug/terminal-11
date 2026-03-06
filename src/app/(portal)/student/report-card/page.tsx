import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatGrid } from "@/components/portal/stat-grid";
import { reportSummary } from "@/lib/mock/portal-data";

export default function StudentReportCardPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Report card</CardTitle>
          <CardDescription>Academic summary for student and guardians.</CardDescription>
        </CardHeader>
      </Card>

      <StatGrid
        items={[
          { label: "Student", value: reportSummary.student },
          { label: "Average", value: reportSummary.average.toFixed(2) },
          { label: "Attendance", value: reportSummary.attendance },
          { label: "Behavior", value: reportSummary.behavior },
        ]}
      />

      <Card>
        <CardContent className="pt-6">
          <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">
            Export report (CSV)
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
