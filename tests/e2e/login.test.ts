import { AxeBuilder } from "@axe-core/playwright";
import { expect } from "@playwright/test";
import { test } from "tests/playwright-utils";

test.fixme("login a11y", async ({ page }) => {
  await page.goto("/pots/add");

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});
