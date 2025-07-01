import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { violationFingerprints } from "tests/playwright-utils";

test("overview has title", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/overview/i);
});

test("overview has data", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("current-balance")).not.toHaveText(/\$0/i);
  await expect(page.getByTestId("income")).not.toHaveText(/\$0/i);
  await expect(page.getByTestId("expenses")).not.toHaveText(/\$0/i);
  await expect(
    page
      .getByRole("list", {
        name: /pots/i,
      })
      .getByRole("listitem"),
  ).not.toHaveCount(0);
  await expect(
    page
      .getByRole("list", {
        name: /transactions/i,
      })
      .getByRole("listitem"),
  ).not.toHaveCount(0);
  await expect(
    page
      .getByRole("list", {
        name: /budgets/i,
      })
      .getByRole("listitem"),
  ).not.toHaveCount(0);
  await expect(page.getByTestId("paid-bills")).not.toHaveText(/\$0/i);
  await expect(page.getByTestId("total-upcoming")).not.toHaveText(/\$0/i);
  await expect(page.getByTestId("due-soon")).not.toHaveText(/\$0/i);
});

test("overview a11y", async ({ page }) => {
  await page.goto("/");

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});

test("transactions a11y", async ({ page }) => {
  await page.goto("/transactions");

  const results = await new AxeBuilder({ page }).analyze();

  // Disabled previous/next buttons have insufficient contrast
  expect(violationFingerprints(results)).toMatchSnapshot();
});

test("budgets a11y", async ({ page }) => {
  await page.goto("/budgets");

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});

test("add budget a11y", async ({ page }) => {
  await page.goto("/budgets/add");

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});

test("pots a11y", async ({ page }) => {
  await page.goto("/pots");

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});

test("add pot a11y", async ({ page }) => {
  await page.goto("/pots/add");

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});

test("recurring bills a11y", async ({ page }) => {
  await page.goto("/recurring-bills");

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});
