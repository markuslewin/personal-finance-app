import { AxeBuilder } from "@axe-core/playwright";
import { expect } from "@playwright/test";
import { test } from "tests/playwright-utils";

test("can't signup with the same email", async ({ page, login }) => {
  const { user } = await login();
  await page.goto("/signup");

  await page.getByRole("textbox", { name: "name" }).fill("Some Name");
  await page.getByRole("textbox", { name: "email" }).fill(user.email);
  await page.getByRole("textbox", { name: "password" }).fill("Passw0rd");
  await page.getByRole("button", { name: "create account" }).click();

  await expect(
    page.getByRole("textbox", { name: "email" }),
  ).toHaveAccessibleDescription(/already in use/i);
});

test.fixme("signup a11y", async ({ page }) => {
  await page.goto("/signup");

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});
