import { expect, test } from "@playwright/test";

test("home loads with title and primary controls", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Let's Count!/i })).toBeVisible();
  await expect(page.getByPlaceholder("100")).toBeVisible();
  await expect(page.getByRole("button", { name: /Go!/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Again/i })).toBeVisible();
});
