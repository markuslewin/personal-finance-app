import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/personal finance app/i);
});

test("dashboard has pots", async ({ page }) => {
  await page.goto("/");

  await expect(
    page
      .getByRole("list", {
        name: /pots/i,
      })
      .getByRole("listitem"),
  ).not.toHaveCount(0);
});
