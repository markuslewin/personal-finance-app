import { test as baseTest, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { violationFingerprints } from "tests/playwright-utils";
import { faker } from "@faker-js/faker";
import { execa } from "execa";
import { maxInt } from "~/app/_prisma";

// todo: Isolate tests with `login` fixture
const test = baseTest.extend<{ resetDatabase: undefined }>({
  resetDatabase: async ({}, use) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(undefined);

    await execa({
      stdio: "inherit",
    })`prisma migrate reset --force --skip-generate`;
  },
});

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

test("add budget dialog", async ({ page }) => {
  await page.goto("/budgets");
  await page
    .getByRole("link", {
      name: /add new budget/i,
    })
    .click();

  await expect(
    page.getByRole("dialog", {
      name: /add new budget/i,
    }),
  ).toBeVisible();

  await page
    .getByRole("button", {
      name: /close/i,
    })
    .click();

  await expect(
    page.getByRole("dialog", {
      name: /add new budget/i,
    }),
  ).not.toBeVisible();
});

test("budget maximum errors", async ({ page }) => {
  await page.goto("/budgets");
  await page.getByRole("link", { name: /add new budget/i }).click();

  const submitButton = page.getByRole("button", { name: /add budget/i });

  await submitButton.click();

  const input = page.getByLabel(/maximum/i);

  await expect(input).toHaveAccessibleDescription(/required/i);

  await input.fill("0");
  await submitButton.click();

  await expect(input).toHaveAccessibleDescription(/must be greater than 0/i);

  await input.fill("12.3");
  await submitButton.click();

  await expect(input).toHaveAccessibleDescription(/expected integer/i);

  await input.fill(String(maxInt + 1));
  await submitButton.click();

  await expect(input).toHaveAccessibleDescription(/must be less/i);

  await input.fill("-100");
  await submitButton.click();

  await expect(input).toHaveAccessibleDescription(/must be greater than 0/i);
});

test.fixme("budget with negative spending", async ({ page }) => {
  // check general, unit/integration test?
});

test.fixme("can edit budget", async ({ page }) => {
  //
});

test.fixme("can delete budget", async ({ page }) => {
  //
});

test.fixme("budget links to its transactions", async ({ page }) => {
  //
});

test("shows budget information", async ({ page }) => {
  await page.goto("/budgets");

  const budgets = page.getByTestId("budget");
  await expect(budgets).toHaveCount(4);

  const budget = budgets.first();
  await expect(budget.getByText(/maximum/i)).toHaveText(/\$50.00/i);
  await expect(budget.getByTestId("budget-spent")).toHaveText(/\$15.00/);
  await expect(budget.getByTestId("budget-free")).toHaveText(/\$35.00/i);

  const latestSpendings = budget
    .getByRole("list", { name: /latest spending/i })
    .getByRole("listitem");
  await expect(latestSpendings).toHaveText([
    /pixel playground/i,
    /james thompson/i,
    /rina sato/i,
  ]);
  await expect(latestSpendings).toHaveText([
    /aug 11, 2024/i,
    /aug 11, 2024/i,
    /jul 13, 2024/i,
  ]);
  await expect(latestSpendings).toHaveText([
    /-\$10.00/i,
    /-\$5.00/i,
    /-\$10.00/i,
  ]);
});

test("can create budget", async ({ page, resetDatabase }) => {
  const category = "Lifestyle";
  const theme = "Blue";
  const max = faker.number.int({
    min: 1,
    max: 1000,
  });

  await page.goto("/budgets");
  await page
    .getByRole("link", {
      name: /add new budget/i,
    })
    .click();
  await page.getByLabel(/category/i).click();
  await page.getByLabel(category).click();
  await page.getByLabel(/maximum/i).fill(String(max));
  await page.getByLabel(/theme/i).click();
  await page.getByLabel(theme).click();
  await page
    .getByRole("button", {
      name: /add budget/i,
    })
    .click();

  await expect(
    page.getByRole("status").and(page.getByText(/adding budget/i)),
  ).toBeAttached();

  const lastBudget = page.getByTestId("budget").last();
  // todo: Scroll
  // await expect(lastBudget).toBeInViewport();
  await expect(
    lastBudget.getByRole("heading", { name: category }),
  ).toBeVisible();
  await expect(lastBudget.getByText(/maximum/i)).toHaveText(
    new RegExp(String(max)),
  );
});

test("budgets a11y", async ({ page }) => {
  await page.goto("/budgets");

  await expect(page.getByTestId("budget")).toHaveCount(4);

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
