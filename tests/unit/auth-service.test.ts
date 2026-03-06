import { describe, expect, it } from "vitest";

import { parseLoginPayload } from "@/services/auth";

describe("login payload", () => {
  it("parses valid form data", () => {
    const payload = new FormData();
    payload.set("email", "teacher@example.com");
    payload.set("password", "Password123");

    const parsed = parseLoginPayload(payload);

    expect(parsed.email).toBe("teacher@example.com");
    expect(parsed.password).toBe("Password123");
  });

  it("rejects invalid email", () => {
    const payload = new FormData();
    payload.set("email", "bad-email");
    payload.set("password", "Password123");

    expect(() => parseLoginPayload(payload)).toThrow();
  });
});
