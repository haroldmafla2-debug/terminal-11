import { z } from "zod";

import type { PortalRole } from "@/lib/constants/roles";
import { PORTAL_ROLES } from "@/lib/constants/roles";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const roleSchema = z.enum(PORTAL_ROLES);

export const updateProfileRoleSchema = z.object({
  profileId: z.uuid(),
  role: roleSchema,
});

export const createGroupSchema = z.object({
  gradeId: z.uuid(),
  code: z.string().trim().min(1).max(20),
  name: z.string().trim().min(1).max(80),
  year: z.coerce.number().int().min(2020).max(2100),
});

export const createSubjectSchema = z.object({
  code: z.string().trim().min(1).max(20),
  name: z.string().trim().min(1).max(120),
});

export const createTeacherAssignmentSchema = z.object({
  teacherId: z.uuid(),
  groupId: z.uuid(),
  subjectId: z.uuid(),
  year: z.coerce.number().int().min(2020).max(2100),
});

export const createPeriodSchema = z.object({
  name: z.string().trim().min(2).max(20),
  year: z.coerce.number().int().min(2020).max(2100),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
});

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

type AdminContext = {
  mock: boolean;
  supabase: SupabaseServerClient | null;
  userId: string;
  schoolId: string;
};

const DEMO_SCHOOL_ID = "11111111-1111-1111-1111-111111111111";
const DEMO_TEACHER_ID = "10000000-0000-0000-0000-000000000003";
const DEMO_GROUP_ID = "33333333-3333-3333-3333-333333333331";
const DEMO_SUBJECT_ID = "44444444-4444-4444-4444-444444444441";
const DEMO_GRADE_ID = "22222222-2222-2222-2222-222222222221";
const DEMO_PERIOD_ID = "55555555-5555-5555-5555-555555555551";

function demoContext(): AdminContext {
  return {
    mock: true,
    supabase: null,
    userId: "guest-admin",
    schoolId: DEMO_SCHOOL_ID,
  };
}

async function resolveSchoolId(supabase: SupabaseServerClient, userId: string) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("school_id")
    .eq("id", userId)
    .maybeSingle();

  if (profile?.school_id) {
    return profile.school_id as string;
  }

  const { data: school, error } = await supabase.from("schools").select("id").limit(1).single();

  if (error || !school?.id) {
    throw new Error("No school configured. Create a school record first.");
  }

  return school.id as string;
}

async function getAdminContext(): Promise<AdminContext> {
  if (!hasSupabaseEnv()) {
    return demoContext();
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // Decision: no-auth mode should still render admin UI with mock data.
      return demoContext();
    }

    const schoolId = await resolveSchoolId(supabase, user.id);

    return { mock: false, supabase, userId: user.id, schoolId };
  } catch {
    return demoContext();
  }
}

export async function listProfiles() {
  const context = await getAdminContext();

  if (context.mock || !context.supabase) {
    return [
      {
        id: "10000000-0000-0000-0000-000000000001",
        full_name: "Admin Colegio",
        role: "admin",
        phone: "3000000000",
        doc_id: "1000001",
        is_active: true,
        created_at: new Date().toISOString(),
      },
      {
        id: DEMO_TEACHER_ID,
        full_name: "Docente Demo",
        role: "teacher",
        phone: "3000000001",
        doc_id: "1000002",
        is_active: true,
        created_at: new Date().toISOString(),
      },
    ];
  }

  const { data, error } = await context.supabase
    .from("profiles")
    .select("id, full_name, role, phone, doc_id, is_active, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to fetch profiles: ${error.message}`);
  }

  return data ?? [];
}

export async function updateProfileRole(input: z.infer<typeof updateProfileRoleSchema>) {
  const parsed = updateProfileRoleSchema.parse(input);
  const context = await getAdminContext();

  if (context.mock || !context.supabase) {
    return;
  }

  if (parsed.profileId === context.userId && parsed.role !== "admin") {
    throw new Error("Cannot remove your own admin role.");
  }

  const { error } = await context.supabase
    .from("profiles")
    .update({ role: parsed.role as PortalRole })
    .eq("id", parsed.profileId);

  if (error) {
    throw new Error(`Unable to update profile role: ${error.message}`);
  }
}

export async function listGrades() {
  const context = await getAdminContext();

  if (context.mock || !context.supabase) {
    return [{ id: DEMO_GRADE_ID, name: "Grade 10", level_order: 10 }];
  }

  const { data, error } = await context.supabase
    .from("grades")
    .select("id, name, level_order")
    .eq("school_id", context.schoolId)
    .order("level_order", { ascending: true });

  if (error) {
    throw new Error(`Unable to fetch grades: ${error.message}`);
  }

  return data ?? [];
}

export async function listGroups() {
  const context = await getAdminContext();

  if (context.mock || !context.supabase) {
    return [
      {
        id: DEMO_GROUP_ID,
        code: "10A",
        name: "Tenth A",
        year: 2026,
        grades: { name: "Grade 10" },
      },
    ];
  }

  const { data, error } = await context.supabase
    .from("groups")
    .select("id, code, name, year, grades(name)")
    .eq("school_id", context.schoolId)
    .order("year", { ascending: false })
    .order("code", { ascending: true });

  if (error) {
    throw new Error(`Unable to fetch groups: ${error.message}`);
  }

  return data ?? [];
}

export async function createGroup(input: z.infer<typeof createGroupSchema>) {
  const parsed = createGroupSchema.parse(input);
  const context = await getAdminContext();

  if (context.mock || !context.supabase) {
    return;
  }

  const { error } = await context.supabase.from("groups").insert({
    school_id: context.schoolId,
    grade_id: parsed.gradeId,
    code: parsed.code.toUpperCase(),
    name: parsed.name,
    year: parsed.year,
  });

  if (error) {
    throw new Error(`Unable to create group: ${error.message}`);
  }
}

export async function listSubjects() {
  const context = await getAdminContext();

  if (context.mock || !context.supabase) {
    return [
      {
        id: DEMO_SUBJECT_ID,
        code: "MAT",
        name: "Mathematics",
        created_at: new Date().toISOString(),
      },
    ];
  }

  const { data, error } = await context.supabase
    .from("subjects")
    .select("id, code, name, created_at")
    .eq("school_id", context.schoolId)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Unable to fetch subjects: ${error.message}`);
  }

  return data ?? [];
}

export async function createSubject(input: z.infer<typeof createSubjectSchema>) {
  const parsed = createSubjectSchema.parse(input);
  const context = await getAdminContext();

  if (context.mock || !context.supabase) {
    return;
  }

  const { error } = await context.supabase.from("subjects").insert({
    school_id: context.schoolId,
    code: parsed.code.toUpperCase(),
    name: parsed.name,
  });

  if (error) {
    throw new Error(`Unable to create subject: ${error.message}`);
  }
}

export async function listTeachers() {
  const context = await getAdminContext();

  if (context.mock || !context.supabase) {
    return [{ id: DEMO_TEACHER_ID, full_name: "Docente Demo" }];
  }

  const { data, error } = await context.supabase
    .from("profiles")
    .select("id, full_name")
    .eq("role", "teacher")
    .order("full_name", { ascending: true });

  if (error) {
    throw new Error(`Unable to fetch teachers: ${error.message}`);
  }

  return data ?? [];
}

export async function listTeacherAssignments() {
  const context = await getAdminContext();

  if (context.mock || !context.supabase) {
    return [
      {
        id: "88888888-8888-8888-8888-888888888881",
        year: 2026,
        teacher: { full_name: "Docente Demo" },
        group: { code: "10A", name: "Tenth A" },
        subject: { code: "MAT", name: "Mathematics" },
      },
    ];
  }

  const { data, error } = await context.supabase
    .from("teacher_assignments")
    .select(
      "id, year, teacher:profiles!teacher_assignments_teacher_id_fkey(full_name), group:groups(code, name), subject:subjects(code, name)",
    )
    .order("year", { ascending: false });

  if (error) {
    throw new Error(`Unable to fetch teacher assignments: ${error.message}`);
  }

  return data ?? [];
}

export async function createTeacherAssignment(
  input: z.infer<typeof createTeacherAssignmentSchema>,
) {
  const parsed = createTeacherAssignmentSchema.parse(input);
  const context = await getAdminContext();

  if (context.mock || !context.supabase) {
    return;
  }

  const { error } = await context.supabase.from("teacher_assignments").insert({
    teacher_id: parsed.teacherId,
    group_id: parsed.groupId,
    subject_id: parsed.subjectId,
    year: parsed.year,
  });

  if (error) {
    throw new Error(`Unable to create teacher assignment: ${error.message}`);
  }
}

export async function listPeriods() {
  const context = await getAdminContext();

  if (context.mock || !context.supabase) {
    return [
      {
        id: DEMO_PERIOD_ID,
        name: "P1",
        year: 2026,
        start_date: "2026-01-20",
        end_date: "2026-03-20",
      },
    ];
  }

  const { data, error } = await context.supabase
    .from("periods")
    .select("id, name, year, start_date, end_date")
    .eq("school_id", context.schoolId)
    .order("year", { ascending: false })
    .order("start_date", { ascending: true });

  if (error) {
    throw new Error(`Unable to fetch periods: ${error.message}`);
  }

  return data ?? [];
}

export async function createPeriod(input: z.infer<typeof createPeriodSchema>) {
  const parsed = createPeriodSchema.parse(input);
  const context = await getAdminContext();

  if (parsed.startDate > parsed.endDate) {
    throw new Error("Start date must be before or equal to end date.");
  }

  if (context.mock || !context.supabase) {
    return;
  }

  const { error } = await context.supabase.from("periods").insert({
    school_id: context.schoolId,
    name: parsed.name.toUpperCase(),
    year: parsed.year,
    start_date: parsed.startDate,
    end_date: parsed.endDate,
  });

  if (error) {
    throw new Error(`Unable to create period: ${error.message}`);
  }
}