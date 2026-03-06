import { z } from "zod";

import type { PortalRole } from "@/lib/constants/roles";
import { PORTAL_ROLES } from "@/lib/constants/roles";
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

async function resolveSchoolId(supabase: SupabaseServerClient, userId: string) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("school_id")
    .eq("id", userId)
    .maybeSingle();

  if (profile?.school_id) {
    return profile.school_id as string;
  }

  // Decision: fallback to first school to keep admin setup functional in partially seeded envs.
  const { data: school, error } = await supabase.from("schools").select("id").limit(1).single();

  if (error || !school?.id) {
    throw new Error("No school configured. Create a school record first.");
  }

  return school.id as string;
}

async function getAdminContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized: active session required.");
  }

  const schoolId = await resolveSchoolId(supabase, user.id);

  return { supabase, userId: user.id, schoolId };
}

export async function listProfiles() {
  const { supabase } = await getAdminContext();

  const { data, error } = await supabase
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
  const { supabase, userId } = await getAdminContext();

  if (parsed.profileId === userId && parsed.role !== "admin") {
    // Decision: prevent admins from removing their own admin role in this minimal panel.
    throw new Error("Cannot remove your own admin role.");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role: parsed.role as PortalRole })
    .eq("id", parsed.profileId);

  if (error) {
    throw new Error(`Unable to update profile role: ${error.message}`);
  }
}

export async function listGrades() {
  const { supabase, schoolId } = await getAdminContext();

  const { data, error } = await supabase
    .from("grades")
    .select("id, name, level_order")
    .eq("school_id", schoolId)
    .order("level_order", { ascending: true });

  if (error) {
    throw new Error(`Unable to fetch grades: ${error.message}`);
  }

  return data ?? [];
}

export async function listGroups() {
  const { supabase, schoolId } = await getAdminContext();

  const { data, error } = await supabase
    .from("groups")
    .select("id, code, name, year, grades(name)")
    .eq("school_id", schoolId)
    .order("year", { ascending: false })
    .order("code", { ascending: true });

  if (error) {
    throw new Error(`Unable to fetch groups: ${error.message}`);
  }

  return data ?? [];
}

export async function createGroup(input: z.infer<typeof createGroupSchema>) {
  const parsed = createGroupSchema.parse(input);
  const { supabase, schoolId } = await getAdminContext();

  const { error } = await supabase.from("groups").insert({
    school_id: schoolId,
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
  const { supabase, schoolId } = await getAdminContext();

  const { data, error } = await supabase
    .from("subjects")
    .select("id, code, name, created_at")
    .eq("school_id", schoolId)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Unable to fetch subjects: ${error.message}`);
  }

  return data ?? [];
}

export async function createSubject(input: z.infer<typeof createSubjectSchema>) {
  const parsed = createSubjectSchema.parse(input);
  const { supabase, schoolId } = await getAdminContext();

  const { error } = await supabase.from("subjects").insert({
    school_id: schoolId,
    code: parsed.code.toUpperCase(),
    name: parsed.name,
  });

  if (error) {
    throw new Error(`Unable to create subject: ${error.message}`);
  }
}

export async function listTeachers() {
  const { supabase } = await getAdminContext();

  const { data, error } = await supabase
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
  const { supabase } = await getAdminContext();

  const { data, error } = await supabase
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
  const { supabase } = await getAdminContext();

  const { error } = await supabase.from("teacher_assignments").insert({
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
  const { supabase, schoolId } = await getAdminContext();

  const { data, error } = await supabase
    .from("periods")
    .select("id, name, year, start_date, end_date")
    .eq("school_id", schoolId)
    .order("year", { ascending: false })
    .order("start_date", { ascending: true });

  if (error) {
    throw new Error(`Unable to fetch periods: ${error.message}`);
  }

  return data ?? [];
}

export async function createPeriod(input: z.infer<typeof createPeriodSchema>) {
  const parsed = createPeriodSchema.parse(input);
  const { supabase, schoolId } = await getAdminContext();

  if (parsed.startDate > parsed.endDate) {
    throw new Error("Start date must be before or equal to end date.");
  }

  const { error } = await supabase.from("periods").insert({
    school_id: schoolId,
    name: parsed.name.toUpperCase(),
    year: parsed.year,
    start_date: parsed.startDate,
    end_date: parsed.endDate,
  });

  if (error) {
    throw new Error(`Unable to create period: ${error.message}`);
  }
}
