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

const getPathname = (url: string) => {
  return new URL(url).pathname;
};

test("menu highlights current page", async ({ page }) => {
  await page.goto("/");

  const nav = page.getByRole("navigation");
  const overview = nav.getByRole("link", { name: "overview" });
  const transactions = nav.getByRole("link", { name: "transactions" });
  const budgets = nav.getByRole("link", { name: "budgets" });
  const pots = nav.getByRole("link", { name: "pots" });
  const recurringBills = nav.getByRole("link", { name: "recurring bills" });
  const getAriaCurrents = async () => {
    return Promise.all(
      [overview, transactions, budgets, pots, recurringBills].map((link) => {
        return link.getAttribute("aria-current");
      }),
    );
  };

  expect(await getAriaCurrents()).toEqual(["page", null, null, null, null]);

  await transactions.click();

  await expect(transactions).toHaveAttribute("aria-current", "page");
  expect(await getAriaCurrents()).toEqual([null, "page", null, null, null]);

  await budgets.click();

  await expect(budgets).toHaveAttribute("aria-current", "page");
  expect(await getAriaCurrents()).toEqual([null, null, "page", null, null]);

  await pots.click();

  await expect(pots).toHaveAttribute("aria-current", "page");
  expect(await getAriaCurrents()).toEqual([null, null, null, "page", null]);

  await recurringBills.click();

  await expect(recurringBills).toHaveAttribute("aria-current", "page");
  expect(await getAriaCurrents()).toEqual([null, null, null, null, "page"]);

  await overview.click();

  await expect(overview).toHaveAttribute("aria-current", "page");
  expect(await getAriaCurrents()).toEqual(["page", null, null, null, null]);
});

test("menu toggles", async ({ page }) => {
  await page.goto("/");

  const toggle = page.getByRole("button", { name: "minimize menu" });
  await expect(toggle).toHaveAttribute("aria-pressed", "false");

  await toggle.click();

  await expect(toggle).toHaveAttribute("aria-pressed", "true");

  await toggle.click();

  await expect(toggle).toHaveAttribute("aria-pressed", "false");
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
  expect(getPathname(page.url())).toBe("/budgets/add");

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
  expect(getPathname(page.url())).toBe("/budgets");
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

test("can edit budget", async ({ page, resetDatabase }) => {
  const category = "Groceries";
  const theme = "Blue";

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
  expect(getPathname(page.url())).toMatch(/^\/budgets\/.*\/edit$/i);

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
  expect(getPathname(page.url())).toBe("/budgets");
});

test("can delete budget", async ({ page, resetDatabase }) => {
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

test.describe("javascript disabled", () => {
  test.use({
    javaScriptEnabled: false,
  });

  test("can create budget", async ({ page, resetDatabase }) => {
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

  test("can edit budget", async ({ page, resetDatabase }) => {
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

  test("can delete budget", async ({ page, resetDatabase }) => {
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
  await expect(page.getByTestId("category")).toHaveText([
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
