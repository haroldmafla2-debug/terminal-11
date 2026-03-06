import { expect, test } from "@playwright/test";

test("login page renders", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Ingresar al portal" })).toBeVisible();
});

test("protected route redirects to login when not authenticated", async ({ page }) => {
  await page.goto("/teacher/groups");
  await expect(page).toHaveURL(/\/login/);
});
