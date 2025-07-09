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

test("can search transactions", async ({ page }) => {
  await page.goto("/transactions");
  await page.getByRole("textbox", { name: "search" }).fill("spa");

  await expect(
    page.getByRole("status").and(page.getByText(/loading/i)),
  ).toBeAttached();
  await expect(
    page.getByRole("status").and(page.getByText(/loaded/i)),
  ).toBeAttached();
  await expect(
    page
      .getByTestId("transaction")
      .getByTestId("name")
      .filter({ visible: true }),
  ).toHaveText([/spa/i, /spa/i, /spa/i, /spa/i]);
});

test("can filter transactions by category", async ({ page }) => {
  await page.goto("/transactions");
  await page.getByLabel("category").click();
  await page.getByRole("option", { name: "entertainment" }).click();

  await expect(
    page.getByRole("status").and(page.getByText(/loading/i)),
  ).toBeAttached();
  await expect(
    page.getByRole("status").and(page.getByText(/loaded/i)),
  ).toBeAttached();
  await expect(
    page
      .getByTestId("transaction")
      .getByTestId("category")
      .filter({ visible: true }),
  ).toHaveText([/entertainment/i, /entertainment/i, /entertainment/i]);
});

test("can sort transactions", async ({ page }) => {
  await page.goto("/transactions");
  await page.getByLabel("sort by").click();
  await page.getByRole("option", { name: "a to z" }).click();

  await expect(
    page.getByRole("status").and(page.getByText(/loading/i)),
  ).toBeAttached();
  await expect(
    page.getByRole("status").and(page.getByText(/loaded/i)),
  ).toBeAttached();
  await expect(
    page
      .getByTestId("transaction")
      .getByTestId("name")
      .filter({ visible: true }),
  ).toHaveText([
    /Aqua Flow Utilities/i,
    /Buzz Marketing Group/i,
    /ByteWise/i,
    /Daniel Carter/i,
    /Daniel Carter/i,
    /EcoFuel Energy/i,
    /Elevate Education/i,
    /Elevate Education/i,
    /Ella Phillips/i,
    /Ella Phillips/i,
  ]);

  await page.getByLabel("sort by").click();
  await page.getByRole("option", { name: "z to a" }).click();

  await expect(
    page.getByRole("status").and(page.getByText(/loading/i)),
  ).toBeAttached();
  await expect(
    page.getByRole("status").and(page.getByText(/loaded/i)),
  ).toBeAttached();
  await expect(
    page
      .getByTestId("transaction")
      .getByTestId("name")
      .filter({ visible: true }),
  ).toHaveText([
    /Yuna Kim/,
    /Yuna Kim/,
    /William Harris/,
    /William Harris/,
    /Urban Services Hub/,
    /TechNova Innovations/,
    /Swift Ride Share/,
    /Swift Ride Share/,
    /Sun Park/,
    /Sun Park/,
  ]);
});

test("transactions pagination", async ({ page }) => {
  await page.goto("/transactions");

  const pages = page.getByRole("list", { name: "pages" }).getByRole("link");

  await expect(
    page.getByTestId("transaction").filter({ visible: true }),
  ).toHaveCount(10);
  await expect(page.getByRole("link", { name: "previous" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(pages.first()).toHaveAttribute("aria-current", "page");
  await expect(pages.last()).not.toHaveAttribute("aria-current");
  await expect(page.getByRole("link", { name: "next" })).not.toHaveAttribute(
    "aria-current",
  );

  await pages.last().click();

  await expect(
    page.getByTestId("transaction").filter({ visible: true }),
  ).toHaveCount(9);
  await expect(
    page.getByRole("link", { name: "previous" }),
  ).not.toHaveAttribute("aria-current");
  await expect(pages.first()).not.toHaveAttribute("aria-current");
  await expect(pages.last()).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("link", { name: "next" })).toHaveAttribute(
    "aria-current",
    "page",
  );
});

test.describe("on mobile", () => {
  test.use({
    viewport: {
      width: 400,
      height: 720,
    },
  });

  test("can search transactions", async ({ page }) => {
    await page.goto("/transactions");
    await page.getByRole("textbox", { name: "search" }).fill("am h");

    await expect(
      page.getByRole("status").and(page.getByText(/loading/i)),
    ).toBeAttached();
    await expect(
      page.getByRole("status").and(page.getByText(/loaded/i)),
    ).toBeAttached();
    await expect(
      page
        .getByTestId("transaction")
        .getByTestId("name")
        .filter({ visible: true }),
    ).toHaveText([/am h/i, /am h/i, /am h/i, /am h/i]);
  });

  test("can filter transactions by category", async ({ page }) => {
    await page.goto("/transactions");
    // todo: Waiting for JS..?
    await page.waitForFunction(() => true);
    await page.getByLabel("category").click();
    await page.getByRole("option", { name: "groceries" }).click();

    await expect(
      page.getByRole("status").and(page.getByText(/loading/i)),
    ).toBeAttached();
    await expect(
      page.getByRole("status").and(page.getByText(/loaded/i)),
    ).toBeAttached();
    await expect(
      page
        .getByTestId("transaction")
        .getByTestId("category")
        .filter({ visible: true }),
    ).toHaveText([/groceries/i, /groceries/i, /groceries/i]);
  });

  test("can sort transactions", async ({ page }) => {
    await page.goto("/transactions");
    // todo: Waiting for JS..?
    await page.waitForFunction(() => true);
    await page.getByRole("combobox", { name: "sort by" }).click();
    await page.getByRole("option", { name: "highest" }).click();

    await expect(
      page.getByRole("status").and(page.getByText(/loading/i)),
    ).toBeAttached();
    await expect(
      page.getByRole("status").and(page.getByText(/loaded/i)),
    ).toBeAttached();
    await expect(
      page
        .getByTestId("transaction")
        .getByTestId("amount")
        .filter({ visible: true }),
    ).toHaveText([
      /\+\$3,358.00/i,
      /\+\$120.00/i,
      /\+\$75.00/i,
      /\+\$75.00/i,
      /\+\$65.00/i,
      /\+\$50.00/i,
      /\+\$50.00/i,
      /\+\$20.00/i,
      /-\$5.00/i,
      /-\$9.00/i,
    ]);

    await page.getByLabel("sort by").click();
    await page.getByRole("option", { name: "lowest" }).click();

    await expect(
      page.getByRole("status").and(page.getByText(/loading/i)),
    ).toBeAttached();
    await expect(
      page.getByRole("status").and(page.getByText(/loaded/i)),
    ).toBeAttached();
    await expect(
      page
        .getByTestId("transaction")
        .getByTestId("amount")
        .filter({ visible: true }),
    ).toHaveText([
      /-\$100.00/i,
      /-\$100.00/i,
      /-\$100.00/i,
      /-\$95.00/i,
      /-\$89.00/i,
      /-\$78.00/i,
      /-\$65.00/i,
      /-\$65.00/i,
      /-\$55.00/i,
      /-\$52.00/i,
    ]);
  });
});

test.describe("javascript disabled", () => {
  test.use({
    javaScriptEnabled: false,
  });

  test("can search transactions", async ({ page }) => {
    await page.goto("/transactions");

    const textbox = page.getByRole("textbox", { name: "search" });
    await textbox.fill("rina");
    await textbox.press("Enter");

    await expect(
      page
        .getByTestId("transaction")
        .getByTestId("name")
        .filter({ visible: true }),
    ).toHaveText([/rina/i, /rina/i]);
  });

  test("can filter transactions by category", async ({ page }) => {
    await page.goto("/transactions");
    await page.getByLabel("category").selectOption("Personal Care");
    await page.getByRole("textbox", { name: "search" }).press("Enter");

    await expect(
      page
        .getByTestId("transaction")
        .getByTestId("category")
        .filter({ visible: true }),
    ).toHaveText([/personal care/i, /personal care/i, /personal care/i]);
  });

  test("can sort transactions", async ({ page }) => {
    await page.goto("/transactions");
    await page.getByLabel("sort by").selectOption("Latest");
    await page.getByRole("textbox", { name: "search" }).press("Enter");

    await expect(
      page
        .getByTestId("transaction")
        .getByTestId("date")
        .filter({ visible: true }),
    ).toHaveText([
      /Aug 19, 2024/i,
      /Aug 19, 2024/i,
      /Aug 18, 2024/i,
      /Aug 17, 2024/i,
      /Aug 17, 2024/i,
      /Aug 15, 2024/i,
      /Aug 14, 2024/i,
      /Aug 13, 2024/i,
      /Aug 11, 2024/i,
      /Aug 11, 2024/i,
    ]);

    await page.getByLabel("sort by").selectOption("Oldest");
    await page.getByRole("textbox", { name: "search" }).press("Enter");

    await expect(
      page
        .getByTestId("transaction")
        .getByTestId("date")
        .filter({ visible: true }),
    ).toHaveText([
      /Jul 2, 2024/i,
      /Jul 2, 2024/i,
      /Jul 3, 2024/i,
      /Jul 5, 2024/i,
      /Jul 6, 2024/i,
      /Jul 7, 2024/i,
      /Jul 8, 2024/i,
      /Jul 9, 2024/i,
      /Jul 10, 2024/i,
      /Jul 11, 2024/i,
    ]);
  });
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

test("add budget a11y", async ({ page }) => {
  await page.goto("/budgets/add");

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});

test("pots title", async ({ page }) => {
  await page.goto("/pots");

  await expect(page).toHaveTitle(/pots/i);
});

test("can create pot", async ({ page, resetDatabase }) => {
  await page.goto("/pots");

  await expect(page.getByTestId("pot").getByTestId("name")).toHaveText([
    /savings/i,
    /concert ticket/i,
    /gift/i,
    /new laptop/i,
    /holiday/i,
  ]);

  await page
    .getByRole("link", {
      name: "add new pot",
    })
    .click();

  await expect(page).toHaveURL(/\/pots\/add$/i);

  const dialog = page.getByRole("dialog", { name: "add new pot" });
  await dialog.getByLabel("name").fill("A new pot");
  await dialog.getByLabel("target").fill("2000");
  await dialog.getByLabel("theme").click();
  await page.getByLabel("Magenta").click();
  await dialog.getByRole("button", { name: "add pot" }).click();

  await expect(
    page.getByRole("status").and(page.getByText("adding pot")),
  ).toBeAttached();
  await expect(page).toHaveURL(/\/pots$/i);
  await expect(page.getByTestId("pot").getByTestId("name")).toHaveText([
    /savings/i,
    /concert ticket/i,
    /gift/i,
    /new laptop/i,
    /holiday/i,
    /a new pot/i,
  ]);
});

test("can edit pot", async ({ page, resetDatabase }) => {
  await page.goto("/pots");

  await expect(page.getByTestId("pot").getByTestId("name")).toHaveText([
    /savings/i,
    /concert ticket/i,
    /gift/i,
    /new laptop/i,
    /holiday/i,
  ]);

  const firstPot = page.getByTestId("pot").first();
  await firstPot.getByRole("button", { name: "actions" }).click();
  await page.getByRole("menuitem", { name: "edit" }).click();

  await expect(page).toHaveURL(/\/pots\/.*\/edit$/i);

  const dialog = page.getByRole("dialog", { name: "edit pot" });
  await dialog.getByLabel("name").fill("An edited pot");
  await dialog.getByLabel("target").fill("3000");
  await dialog.getByLabel("theme").click();
  await page.getByLabel("Blue").click();
  await dialog.getByRole("button", { name: "save" }).click();

  await expect(
    page.getByRole("status").and(page.getByText("saving")),
  ).toBeAttached();
  await expect(page).toHaveURL(/\/pots$/i);
  await expect(page.getByTestId("pot").getByTestId("name")).toHaveText([
    /an edited pot/i,
    /concert ticket/i,
    /gift/i,
    /new laptop/i,
    /holiday/i,
  ]);
});

test("can delete pot", async ({ page, resetDatabase }) => {
  await page.goto("/pots");

  await expect(page.getByTestId("pot").getByTestId("name")).toHaveText([
    /savings/i,
    /concert ticket/i,
    /gift/i,
    /new laptop/i,
    /holiday/i,
  ]);

  const thirdPot = page.getByTestId("pot").nth(2);
  await thirdPot.getByRole("button", { name: "actions" }).click();
  await page.getByRole("menuitem", { name: "delete" }).click();

  await page
    .getByRole("alertdialog", { name: "delete" })
    .getByRole("button", { name: "confirm" })
    .click();

  await expect(
    page.getByRole("status").and(page.getByText("deleting")),
  ).toBeAttached();
  await expect(page).toHaveURL(/\/pots$/i);
  await expect(page.getByTestId("pot").getByTestId("name")).toHaveText([
    /savings/i,
    /concert ticket/i,
    /new laptop/i,
    /holiday/i,
  ]);
});

test("can add money to pot", async ({ page, resetDatabase }) => {
  await page.goto("/");

  const balance = page.getByTestId("current-balance");
  await expect(balance).toHaveText(/\$4,836.00/i);

  await page.goto("/pots");

  const firstPot = page.getByTestId("pot").first();
  const total = firstPot.getByTestId("total");
  await expect(total).toHaveText(/\$159.00/i);

  await firstPot.getByRole("link", { name: "add" }).click();

  await expect(page).toHaveURL(/\/pots\/.*\/add-money/i);

  const dialog = page.getByRole("dialog", { name: "add to" });
  await dialog.getByLabel("amount to add").fill("336");
  await dialog.getByRole("button", { name: "confirm" }).click();

  await expect(
    page.getByRole("status").and(page.getByText("adding")),
  ).toBeAttached();
  await expect(page).toHaveURL(/\/pots$/i);
  await expect(total).toHaveText(/\$495.00/i);

  await page.goto("/");

  await expect(balance).toHaveText(/\$4,500.00/i);
});

test("can withdraw money from pot", async ({ page, resetDatabase }) => {
  await page.goto("/pots");

  const thirdPot = page.getByTestId("pot").nth(2);
  await thirdPot.getByRole("link", { name: "withdraw" }).click();

  await expect(page).toHaveURL(/\/pots\/.*\/withdraw$/i);

  const dialog = page.getByRole("dialog", { name: "withdraw" });
  await dialog.getByLabel("amount to withdraw").fill("10");
  await dialog.getByRole("button", { name: "confirm" }).click();

  await expect(
    page.getByRole("status").and(page.getByText("withdrawing")),
  ).toBeAttached();
  await expect(page).toHaveURL(/\/pots$/i);
  await expect(thirdPot.getByTestId("total")).toHaveText(/\$100.00/i);

  await page.goto("/");

  await expect(page.getByTestId("current-balance")).toHaveText(/\$4,846.00/i);
});

test("can't add more money than current balance", async ({ page }) => {
  await page.goto("/pots");
  await page
    .getByTestId("pot")
    .first()
    .getByRole("link", { name: "add" })
    .click();

  const dialog = page.getByRole("dialog", { name: "add to" });
  const textbox = dialog.getByLabel("amount to add");
  await textbox.fill("4837");
  await dialog.getByRole("button", { name: "confirm" }).click();

  await expect(textbox).toHaveAccessibleDescription(/insufficient funds/i);
});

test("can't withdraw more money than what's in the pot", async ({ page }) => {
  await page.goto("/pots");
  await page
    .getByTestId("pot")
    .first()
    .getByRole("link", { name: "withdraw" })
    .click();

  const dialog = page.getByRole("dialog", { name: "withdraw" });
  const textbox = dialog.getByLabel("amount to withdraw");
  await textbox.fill("160");
  await dialog.getByRole("button", { name: "confirm" }).click();

  await expect(textbox).toHaveAccessibleDescription(/insufficient funds/i);
});

test.describe("javascript disabled", () => {
  test.use({
    javaScriptEnabled: false,
  });

  test("can create pot", async ({ page, resetDatabase }) => {
    await page.goto("/pots");

    await expect(page.getByTestId("pot").getByTestId("name")).toHaveText([
      /savings/i,
      /concert ticket/i,
      /gift/i,
      /new laptop/i,
      /holiday/i,
    ]);

    await page
      .getByRole("link", {
        name: "add new pot",
      })
      .click();
    await page.getByLabel("name").fill("A new pot");
    await page.getByLabel("target").fill("2000");
    await page.getByLabel("theme").selectOption("Magenta");
    await page.getByRole("button", { name: "add pot" }).click();

    await expect(page.getByTestId("pot").getByTestId("name")).toHaveText([
      /savings/i,
      /concert ticket/i,
      /gift/i,
      /new laptop/i,
      /holiday/i,
      /a new pot/i,
    ]);
  });

  test("can edit pot", async ({ page, resetDatabase }) => {
    await page.goto("/pots");

    await expect(page.getByTestId("pot").getByTestId("name")).toHaveText([
      /savings/i,
      /concert ticket/i,
      /gift/i,
      /new laptop/i,
      /holiday/i,
    ]);

    const secondPot = page.getByTestId("pot").nth(1);
    await secondPot.getByRole("link", { name: "edit" }).click();

    await expect(page).toHaveURL(/\/pots\/.*\/edit$/i);

    await page.getByLabel("name").fill("An edited pot");
    await page.getByLabel("target").fill("4000");
    await page.getByLabel("theme").selectOption("Blue");
    await page.getByRole("button", { name: "save" }).click();

    await expect(page).toHaveURL(/\/pots$/i);
    await expect(page.getByTestId("pot").getByTestId("name")).toHaveText([
      /savings/i,
      /an edited pot/i,
      /gift/i,
      /new laptop/i,
      /holiday/i,
    ]);
  });

  test("can delete pot", async ({ page, resetDatabase }) => {
    await page.goto("/pots");

    await expect(page.getByTestId("pot").getByTestId("name")).toHaveText([
      /savings/i,
      /concert ticket/i,
      /gift/i,
      /new laptop/i,
      /holiday/i,
    ]);

    const fourthPot = page.getByTestId("pot").nth(3);
    await fourthPot.getByRole("link", { name: "edit" }).click();
    await page.getByRole("button", { name: "delete" }).click();

    await expect(page).toHaveURL(/\/pots$/i);
    await expect(page.getByTestId("pot").getByTestId("name")).toHaveText([
      /savings/i,
      /concert ticket/i,
      /gift/i,
      /holiday/i,
    ]);
  });

  test("can add money to pot", async ({ page, resetDatabase }) => {
    await page.goto("/pots");

    const lastPot = page.getByTestId("pot").last();
    const total = lastPot.getByTestId("total");

    await lastPot.getByRole("link", { name: "add" }).click();

    await expect(page).toHaveURL(/\/pots\/.*\/add-money/i);

    await page.getByLabel("amount to add").fill("69");
    await page.getByRole("button", { name: "confirm" }).click();

    await expect(page).toHaveURL(/\/pots$/i);
    await expect(total).toHaveText(/\$600.00/i);

    await page.goto("/");

    await expect(page.getByTestId("current-balance")).toHaveText(/\$4,767.00/i);
  });

  test("can withdraw money from pot", async ({ page, resetDatabase }) => {
    await page.goto("/pots");

    const lastPot = page.getByTestId("pot").last();
    await lastPot.getByRole("link", { name: "withdraw" }).click();

    await expect(page).toHaveURL(/\/pots\/.*\/withdraw$/i);

    await page.getByLabel("amount to withdraw").fill("531");
    await page.getByRole("button", { name: "confirm" }).click();

    await expect(page).toHaveURL(/\/pots$/i);
    await expect(lastPot.getByTestId("total")).toHaveText(/\$0.00/i);

    await page.goto("/");

    await expect(page.getByTestId("current-balance")).toHaveText(/\$5,367.00/i);
  });
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

test("can search recurring bills", async ({ page }) => {
  await page.goto("/recurring-bills");
  await page.getByRole("textbox", { name: "search" }).fill("p");

  await expect(
    page.getByRole("status").and(page.getByText(/loading/i)),
  ).toBeAttached();
  await expect(
    page.getByRole("status").and(page.getByText(/loaded/i)),
  ).toBeAttached();
  await expect(
    page.getByTestId("bill").getByTestId("name").filter({ visible: true }),
  ).toHaveText([/p/i, /p/i, /p/i]);
});

test("can sort recurring bills", async ({ page }) => {
  await page.goto("/recurring-bills");
  await page.getByRole("combobox", { name: "sort by" }).click();
  await page.getByRole("option", { name: "a to z" }).click();

  await expect(
    page.getByRole("status").and(page.getByText(/loading/i)),
  ).toBeAttached();
  await expect(
    page.getByRole("status").and(page.getByText(/loaded/i)),
  ).toBeAttached();
  await expect(
    page.getByTestId("bill").getByTestId("name").filter({ visible: true }),
  ).toHaveText([
    /Aqua Flow Utilities/i,
    /ByteWise/i,
    /EcoFuel Energy/i,
    /Elevate Education/i,
    /Nimbus Data Storage/i,
    /Pixel Playground/i,
    /Serenity Spa & Wellness/i,
    /Spark Electric Solutions/i,
  ]);
});

test.describe("on mobile", () => {
  test.use({
    viewport: {
      width: 400,
      height: 720,
    },
  });

  test("can search recurring bills", async ({ page }) => {
    await page.goto("/recurring-bills");
    await page.getByRole("textbox", { name: "search" }).fill("education");

    await expect(
      page.getByRole("status").and(page.getByText(/loading/i)),
    ).toBeAttached();
    await expect(
      page.getByRole("status").and(page.getByText(/loaded/i)),
    ).toBeAttached();
    await expect(
      page.getByTestId("bill").getByTestId("name").filter({ visible: true }),
    ).toHaveText([/education/i]);
  });

  test("can sort recurring bills", async ({ page }) => {
    await page.goto("/recurring-bills");
    await page.waitForFunction(() => true);
    await page.getByRole("combobox", { name: "sort by" }).click();
    await page.getByRole("option", { name: "Highest" }).click();

    await expect(
      page.getByRole("status").and(page.getByText(/loading/i)),
    ).toBeAttached();
    await expect(
      page.getByRole("status").and(page.getByText(/loaded/i)),
    ).toBeAttached();
    await expect(
      page.getByTestId("bill").getByTestId("amount").filter({ visible: true }),
    ).toHaveText([
      /\$100.00/i,
      /\$100.00/i,
      /\$50.00/i,
      /\$49.00/i,
      /\$35.00/i,
      /\$30.00/i,
      /\$10.00/i,
      /\$9.00/i,
    ]);
  });
});

test.describe("javascript disabled", () => {
  test.use({
    javaScriptEnabled: false,
  });

  test("can search recurring bills", async ({ page }) => {
    await page.goto("/recurring-bills");

    const textbox = page.getByRole("textbox", { name: "search" });
    await textbox.fill("a");
    await textbox.press("Enter");

    await expect(
      page.getByTestId("bill").getByTestId("name").filter({ visible: true }),
    ).toHaveText([/a/i, /a/i, /a/i, /a/i, /a/i, /a/i]);
  });

  test("can sort recurring bills", async ({ page }) => {
    test.setTimeout(5000);

    await page.goto("/recurring-bills");
    await page
      .getByRole("combobox", { name: "sort by" })
      .selectOption("Z to A");
    await page.getByRole("textbox", { name: "search" }).press("Enter");

    await expect(
      page.getByTestId("bill").getByTestId("name").filter({ visible: true }),
    ).toHaveText([
      /Spark Electric Solutions/i,
      /Serenity Spa & Wellness/i,
      /Pixel Playground/i,
      /Nimbus Data Storage/i,
      /Elevate Education/i,
      /EcoFuel Energy/i,
      /ByteWise/i,
      /Aqua Flow Utilities/i,
    ]);
  });
});

test("recurring bills a11y", async ({ page }) => {
  await page.goto("/recurring-bills");

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});
