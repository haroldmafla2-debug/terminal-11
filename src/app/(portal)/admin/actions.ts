"use server";

import { revalidatePath } from "next/cache";

import { safeErrorLog } from "@/lib/logger";
import {
  createGroup,
  createGroupSchema,
  createPeriod,
  createPeriodSchema,
  createSubject,
  createSubjectSchema,
  createTeacherAssignment,
  createTeacherAssignmentSchema,
  updateProfileRole,
  updateProfileRoleSchema,
} from "@/services/admin";

function parseFormData(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

export async function updateUserRoleAction(formData: FormData) {
  try {
    const parsed = updateProfileRoleSchema.parse(parseFormData(formData));
    await updateProfileRole(parsed);
  } catch (error) {
    safeErrorLog("updateUserRoleAction failed", error);
  }

  revalidatePath("/admin/users");
}

export async function createGroupAction(formData: FormData) {
  try {
    const parsed = createGroupSchema.parse(parseFormData(formData));
    await createGroup(parsed);
  } catch (error) {
    safeErrorLog("createGroupAction failed", error);
  }

  revalidatePath("/admin/groups");
}

export async function createSubjectAction(formData: FormData) {
  try {
    const parsed = createSubjectSchema.parse(parseFormData(formData));
    await createSubject(parsed);
  } catch (error) {
    safeErrorLog("createSubjectAction failed", error);
  }

  revalidatePath("/admin/subjects");
}

export async function createTeacherAssignmentAction(formData: FormData) {
  try {
    const parsed = createTeacherAssignmentSchema.parse(parseFormData(formData));
    await createTeacherAssignment(parsed);
  } catch (error) {
    safeErrorLog("createTeacherAssignmentAction failed", error);
  }

  revalidatePath("/admin/assignments");
}

export async function createPeriodAction(formData: FormData) {
  try {
    const parsed = createPeriodSchema.parse(parseFormData(formData));
    await createPeriod(parsed);
  } catch (error) {
    safeErrorLog("createPeriodAction failed", error);
  }

  revalidatePath("/admin/periods");
}
