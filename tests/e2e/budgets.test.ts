import { AxeBuilder } from "@axe-core/playwright";
import { faker } from "@faker-js/faker";
import { expect } from "@playwright/test";
import { test } from "tests/playwright-utils";
import { maxInt } from "~/app/_prisma";

test("budget maximum errors", async ({ page, login }) => {
  await login();
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

test("add budget dialog", async ({ page, login }) => {
  await login();
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
  await expect(page).toHaveURL(/\/budgets\/add$/i);

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
  await expect(page).toHaveURL(/\/budgets$/i);
});

test("can create budget", async ({ page, login }) => {
  const category = "Lifestyle";
  const theme = "Blue";
  const max = faker.number.int({
    min: 1,
    max: 1000,
  });

  await login();
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

test("demo user can't create budget", async ({ page }) => {
  await page.goto("/budgets");
  await page
    .getByRole("link", {
      name: /add new budget/i,
    })
    .click();

  await expect(page).toHaveURL(/\/login$/i);
});

test("can edit budget", async ({ page, login }) => {
  const category = "Groceries";
  const theme = "Blue";

  await login();
  await page.goto("/budgets");

  const firstBudget = page.getByTestId("budget").first();
  await expect(
    firstBudget.getByRole("heading", { name: /entertainment/i }),
  ).toBeVisible();
  await expect(firstBudget.getByText(/maximum/i)).toHaveText(/\$50.00/i);

  await firstBudget
    .getByRole("button", {
      name: /actions/i,
    })
    .click();
  await page
    .getByRole("menuitem", {
      name: /edit/i,
    })
    .click();

  const dialog = page.getByRole("dialog", { name: /edit budget/i });
  await expect(dialog).toBeVisible();
  await expect(page).toHaveURL(/\/budgets\/.*\/edit$/i);

  await dialog.getByLabel(/category/i).click();
  await page.getByLabel(category).click();
  await dialog.getByLabel(/maximum/i).fill("100");
  await dialog.getByLabel(/theme/i).click();
  await page.getByLabel(theme).click();
  await dialog
    .getByRole("button", {
      name: /save changes/i,
    })
    .click();

  await expect(
    page.getByRole("status").and(page.getByText(/saving changes/i)),
  ).toBeAttached();
  await expect(dialog).not.toBeAttached();
  await expect(
    firstBudget.getByRole("heading", {
      name: category,
    }),
  ).toBeVisible();
  await expect(firstBudget.getByText(/maximum/i)).toHaveText(/\$100.00/i);
  await expect(page).toHaveURL(/\/budgets$/i);
});

test("demo user can't edit budget", async ({ page }) => {
  await page.goto("/budgets");

  const firstBudget = page.getByTestId("budget").first();
  await firstBudget
    .getByRole("button", {
      name: /actions/i,
    })
    .click();
  await page
    .getByRole("menuitem", {
      name: /edit/i,
    })
    .click();

  await expect(page).toHaveURL(/\/login$/);
});

test("can delete budget", async ({ page, login }) => {
  await login();
  await page.goto("/budgets");

  await expect(page.getByTestId("budget").getByTestId("name")).toHaveText([
    /entertainment/i,
    /bills/i,
    /dining out/i,
    /personal care/i,
  ]);

  await page
    .getByTestId("budget")
    .filter({ hasText: /bills/i })
    .getByRole("button", { name: "actions" })
    .click();
  await page.getByRole("menuitem", { name: "delete" }).click();

  const dialog = page.getByRole("alertdialog", {
    name: "delete",
  });
  await dialog.getByRole("button", { name: "confirm" }).click();

  await expect(
    page.getByRole("status").and(page.getByText(/deleting/i)),
  ).toBeAttached();
  await expect(dialog).not.toBeAttached();
  await expect(page.getByTestId("budget").getByTestId("name")).toHaveText([
    /entertainment/i,
    /dining out/i,
    /personal care/i,
  ]);
});

test("demo user can't delete budget", async ({ page }) => {
  await page.goto("/budgets");

  await expect(page.getByTestId("budget").getByTestId("name")).toHaveText([
    /entertainment/i,
    /bills/i,
    /dining out/i,
    /personal care/i,
  ]);

  await page
    .getByTestId("budget")
    .filter({ hasText: /bills/i })
    .getByRole("button", { name: "actions" })
    .click();
  await page.getByRole("menuitem", { name: "delete" }).click();

  const dialog = page.getByRole("alertdialog", {
    name: "delete",
  });
  await dialog.getByRole("button", { name: "confirm" }).click();

  await expect(page).toHaveURL(/\/login/i);

  await page.goto("/budgets");

  await expect(page.getByTestId("budget").getByTestId("name")).toHaveText([
    /entertainment/i,
    /bills/i,
    /dining out/i,
    /personal care/i,
  ]);
});

test.describe("javascript disabled", () => {
  test.use({
    javaScriptEnabled: false,
  });

  test("can create budget", async ({ page, login }) => {
    await login();
    await page.goto("/budgets");

    await expect(page.getByTestId("budget").getByTestId("name")).toHaveText([
      /entertainment/i,
      /bills/i,
      /dining out/i,
      /personal care/i,
    ]);

    await page
      .getByRole("link", {
        name: /add new budget/i,
      })
      .click();
    await page.getByLabel(/category/i).selectOption({
      label: "Transportation",
    });
    await page.getByLabel(/maximum/i).fill("2000");
    await page.getByLabel(/theme/i).selectOption({
      label: "Pink",
    });
    await page
      .getByRole("button", {
        name: /add budget/i,
      })
      .click();

    await expect(page.getByTestId("budget").getByTestId("name")).toHaveText([
      /entertainment/i,
      /bills/i,
      /dining out/i,
      /personal care/i,
      /transportation/i,
    ]);
    // todo: Scroll
    // await expect(lastBudget).toBeInViewport();
    await expect(
      page
        .getByTestId("budget")
        .last()
        .getByText(/maximum/i),
    ).toHaveText(/\$2,000.00/i);
  });

  test("can edit budget", async ({ page, login }) => {
    await login();
    await page.goto("/budgets");

    const firstBudget = page.getByTestId("budget").first();
    await expect(
      firstBudget.getByRole("heading", { name: /entertainment/i }),
    ).toBeVisible();
    await expect(firstBudget.getByText(/maximum/i)).toHaveText(/\$50.00/i);

    await firstBudget
      .getByRole("link", {
        name: /edit/i,
      })
      .click();

    await page.getByLabel(/category/i).selectOption({ label: "General" });
    await page.getByLabel(/maximum/i).fill("750");
    await page.getByLabel(/theme/i).selectOption({ label: "Blue" });
    await page
      .getByRole("button", {
        name: /save changes/i,
      })
      .click();

    await expect(
      firstBudget.getByRole("heading", {
        name: "General",
      }),
    ).toBeVisible();
    await expect(firstBudget.getByText(/maximum/i)).toHaveText(/\$750.00/i);
  });

  test("can delete budget", async ({ page, login }) => {
    await login();
    await page.goto("/budgets");

    await expect(page.getByTestId("budget").getByTestId("name")).toHaveText([
      /entertainment/i,
      /bills/i,
      /dining out/i,
      /personal care/i,
    ]);

    await page
      .getByTestId("budget")
      .filter({ hasText: /dining out/i })
      .getByRole("link", {
        name: "edit",
      })
      .click();
    await page.getByRole("button", { name: /delete/i }).click();

    await expect(page.getByTestId("budget").getByTestId("name")).toHaveText([
      /entertainment/i,
      /bills/i,
      /personal care/i,
    ]);
  });
});

test("can cancel budget deletion", async ({ page }) => {
  await page.goto("/budgets");
  await page.getByRole("button", { name: "actions" }).first().click();
  await page.getByRole("menuitem", { name: "delete" }).click();

  const dialog = page.getByRole("alertdialog", { name: "delete" });
  await expect(dialog).toBeVisible();

  await dialog.getByRole("button", { name: "close" }).click();

  await expect(dialog).not.toBeAttached();

  await page.getByRole("button", { name: "actions" }).first().click();
  await page.getByRole("menuitem", { name: "delete" }).click();

  await expect(dialog).toBeVisible();

  await dialog.getByRole("button", { name: "back" }).click();

  await expect(dialog).not.toBeAttached();
});

test("budget links to its transactions", async ({ page }) => {
  await page.goto("/budgets");
  await page
    .getByTestId("budget")
    .getByRole("link", { name: "see all" })
    .nth(1)
    .click();

  await expect(page.getByLabel(/category/i)).toHaveText(/bills/i);
  await expect(
    page
      .getByTestId("transaction")
      .getByTestId("category")
      .filter({ visible: true }),
  ).toHaveText([
    /bills/i,
    /bills/i,
    /bills/i,
    /bills/i,
    /bills/i,
    /bills/i,
    /bills/i,
  ]);
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

test("budgets a11y", async ({ page }) => {
  await page.goto("/budgets");

  await expect(page.getByTestId("budget")).toHaveCount(4);

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});

test("add budget a11y", async ({ page, login }) => {
  await login();
  await page.goto("/budgets/add");

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});
