import { AxeBuilder } from "@axe-core/playwright";
import { expect } from "@playwright/test";
import { test } from "tests/playwright-utils";

test("can login", async ({ page, login }) => {
  const { user } = await login();
  await page.goto("/login");
  await page
    .getByRole("textbox", {
      name: "email",
    })
    .fill(user.email);
  await page
    .getByRole("textbox", {
      name: "password",
    })
    .fill(user.password);
  await page
    .getByRole("button", {
      name: "log in",
    })
    .click();

  await expect(page).toHaveURL("/");
});

test.fixme("login a11y", async ({ page }) => {
  await page.goto("/login");

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});
