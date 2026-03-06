import { updateUserRoleAction } from "@/app/(portal)/admin/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROLE_LABEL, PORTAL_ROLES, type PortalRole } from "@/lib/constants/roles";
import { listProfiles } from "@/services/admin";

type ProfileRow = {
  id: string;
  full_name: string;
  role: string;
  phone: string | null;
  doc_id: string | null;
  is_active: boolean;
};

function resolveRole(role: string): PortalRole {
  // Decision: coerce unexpected DB role values to student to keep UI stable.
  return PORTAL_ROLES.includes(role as PortalRole) ? (role as PortalRole) : "student";
}

export default async function AdminUsersPage() {
  const profiles = (await listProfiles()) as ProfileRow[];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Admin - Users and Roles</CardTitle>
          <CardDescription>
            Minimal role management for authenticated users with profile records.
          </CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-600">
                  <th className="px-2 py-2">Name</th>
                  <th className="px-2 py-2">Document</th>
                  <th className="px-2 py-2">Phone</th>
                  <th className="px-2 py-2">Role</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile) => {
                  const role = resolveRole(profile.role);

                  return (
                    <tr key={profile.id} className="border-b border-slate-100">
                      <td className="px-2 py-2 font-medium text-slate-800">{profile.full_name}</td>
                      <td className="px-2 py-2 text-slate-600">{profile.doc_id ?? "-"}</td>
                      <td className="px-2 py-2 text-slate-600">{profile.phone ?? "-"}</td>
                      <td className="px-2 py-2 text-slate-700">{ROLE_LABEL[role]}</td>
                      <td className="px-2 py-2 text-slate-700">
                        {profile.is_active ? "Active" : "Inactive"}
                      </td>
                      <td className="px-2 py-2">
                        <form action={updateUserRoleAction} className="flex items-center gap-2">
                          <input type="hidden" name="profileId" value={profile.id} />
                          <select
                            name="role"
                            defaultValue={role}
                            className="h-9 rounded-md border border-slate-300 px-2 text-sm"
                            aria-label={`Role for ${profile.full_name}`}
                          >
                            {PORTAL_ROLES.map((roleOption) => (
                              <option key={roleOption} value={roleOption}>
                                {ROLE_LABEL[roleOption]}
                              </option>
                            ))}
                          </select>
                          <button
                            type="submit"
                            className="h-9 rounded-md bg-slate-900 px-3 text-sm font-medium text-white"
                          >
                            Save
                          </button>
                        </form>
                      </td>
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
