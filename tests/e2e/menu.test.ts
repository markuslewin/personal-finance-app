import { expect } from "@playwright/test";
import { test } from "tests/playwright-utils";

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
