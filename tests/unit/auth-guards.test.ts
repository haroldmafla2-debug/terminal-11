import { describe, expect, it } from "vitest";

import { canAccessPath, resolveRole } from "@/lib/auth/guards";

describe("auth guards", () => {
  it("falls back to student when role is unknown", () => {
    expect(resolveRole("random-role")).toBe("student");
  });

  it("allows teacher only in teacher prefixes", () => {
    expect(canAccessPath("/teacher/groups", "teacher")).toBe(true);
    expect(canAccessPath("/admin/users", "teacher")).toBe(false);
  });
});
