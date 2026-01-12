import { AxeBuilder } from "@axe-core/playwright";
import { faker } from "@faker-js/faker";
import { expect } from "@playwright/test";
import { test } from "tests/playwright-utils";

test("pots title", async ({ page }) => {
  await page.goto("/pots");

  await expect(page).toHaveTitle(/pots/i);
});

test("can create pot", async ({ page, login }) => {
  await login();
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

test("demo user can't create pot", async ({ page }) => {
  await page.goto("/pots");
  await page
    .getByRole("link", {
      name: "add new pot",
    })
    .click();

  await expect(page).toHaveURL(/\/login$/i);
});

test("can edit pot", async ({ page, login }) => {
  await login();
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
  await expect(dialog.getByRole("textbox", { name: "target" })).toHaveValue(
    "2000",
  );

  await dialog.getByLabel("name").fill("An edited pot");
  await dialog.getByLabel("target").fill("3000");
  await dialog.getByLabel("theme").click();
  await page.getByLabel("Blue").click();
  await dialog.getByRole("button", { name: "save" }).click();

  await expect(page).toHaveURL(/\/pots$/i);
  await expect(page.getByTestId("pot").getByTestId("name")).toHaveText([
    /an edited pot/i,
    /concert ticket/i,
    /gift/i,
    /new laptop/i,
    /holiday/i,
  ]);
});

test("demo user can't edit pot", async ({ page }) => {
  await page.goto("/pots");

  await page
    .getByTestId("pot")
    .first()
    .getByRole("button", { name: "actions" })
    .click();
  await page.getByRole("menuitem", { name: "edit" }).click();

  await expect(page).toHaveURL(/\/login$/i);
});

test("can delete pot", async ({ page, login }) => {
  await login();
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

  await expect(page).toHaveURL(/\/pots$/i);
  await expect(page.getByTestId("pot").getByTestId("name")).toHaveText([
    /savings/i,
    /concert ticket/i,
    /new laptop/i,
    /holiday/i,
  ]);
});

test("demo user can't delete pot", async ({ page }) => {
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

  await expect(page).toHaveURL(/\/login$/i);

  await page.goto("/pots");

  await expect(page.getByTestId("pot").getByTestId("name")).toHaveText([
    /savings/i,
    /concert ticket/i,
    /gift/i,
    /new laptop/i,
    /holiday/i,
  ]);
});

test("can add money to pot", async ({ page, login }) => {
  await login();
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

  await expect(page).toHaveURL(/\/pots$/i);
  await expect(total).toHaveText(/\$495.00/i);

  await page.goto("/");

  await expect(balance).toHaveText(/\$4,500.00/i);
});

test("demo user can't add money to pot", async ({ page }) => {
  await page.goto("/pots");
  await page
    .getByTestId("pot")
    .first()
    .getByRole("link", { name: "add" })
    .click();

  await expect(page).toHaveURL(/\/login$/i);
});

test("can withdraw money from pot", async ({ page, login }) => {
  await login();
  await page.goto("/pots");

  const thirdPot = page.getByTestId("pot").nth(2);
  await thirdPot.getByRole("link", { name: "withdraw" }).click();

  await expect(page).toHaveURL(/\/pots\/.*\/withdraw$/i);

  const dialog = page.getByRole("dialog", { name: "withdraw" });
  await dialog.getByLabel("amount to withdraw").fill("10");
  await dialog.getByRole("button", { name: "confirm" }).click();

  await expect(page).toHaveURL(/\/pots$/i);
  await expect(thirdPot.getByTestId("total")).toHaveText(/\$100.00/i);

  await page.goto("/");

  await expect(page.getByTestId("current-balance")).toHaveText(/\$4,846.00/i);
});

test("demo user can't withdraw money from pot", async ({ page }) => {
  await page.goto("/pots");
  await page
    .getByTestId("pot")
    .nth(2)
    .getByRole("link", { name: "withdraw" })
    .click();

  await expect(page).toHaveURL(/\/login$/i);
});

test("can't add more money than current balance", async ({ page, login }) => {
  await login();
  await page.goto("/pots");
  await page
    .getByTestId("pot")
    .first()
    .getByRole("link", { name: "add" })
    .click();

  const dialog = page.getByRole("dialog", { name: "add to" });
  const textbox = dialog.getByLabel("amount to add");
  await textbox.fill("4836.01");
  await dialog.getByRole("button", { name: "confirm" }).click();

  await expect(textbox).toHaveAccessibleDescription(/insufficient funds/i);
});

test("can't withdraw more money than what's in the pot", async ({
  page,
  login,
}) => {
  await login();
  await page.goto("/pots");
  await page
    .getByTestId("pot")
    .first()
    .getByRole("link", { name: "withdraw" })
    .click();

  const dialog = page.getByRole("dialog", { name: "withdraw" });
  const textbox = dialog.getByLabel("amount to withdraw");
  await textbox.fill("159.01");
  await dialog.getByRole("button", { name: "confirm" }).click();

  await expect(textbox).toHaveAccessibleDescription(/insufficient funds/i);
});

test.describe("javascript disabled", () => {
  test.use({
    javaScriptEnabled: false,
  });

  test("can create pot", async ({ page, login }) => {
    await login();
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

  test("can edit pot", async ({ page, login }) => {
    await login();
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
    await expect(page.getByRole("textbox", { name: "target" })).toHaveValue(
      "150",
    );

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

  test("can delete pot", async ({ page, login }) => {
    await login();
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

  test("can add money to pot", async ({ page, login }) => {
    await login();
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

  test("can withdraw money from pot", async ({ page, login }) => {
    await login();
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

test("receives error message when exceeding max pots", async ({
  page,
  login,
}) => {
  test.setTimeout(80_000);

  await login();
  await page.goto("/pots");
  for (let i = 5; i < 15; ++i) {
    await page
      .getByRole("link", {
        name: "add new pot",
      })
      .click();

    const dialog = page.getByRole("dialog", { name: "add new pot" });
    await dialog.getByLabel("name").fill(faker.lorem.words());
    await dialog.getByLabel("target").fill("2000");
    await dialog.getByRole("button", { name: "add pot" }).click();
  }
  await page
    .getByRole("link", {
      name: "add new pot",
    })
    .click();

  await expect(page.getByRole("dialog", { name: "error" })).toHaveText(
    /no themes left/i,
  );

  await page.getByRole("button", { name: "close" }).click();

  await expect(page).toHaveURL("/pots");

  await page.goto("/pots/add");

  await expect(page.getByRole("heading", { name: "error" })).toBeAttached();
  await expect(page.getByText(/no themes left/i)).toBeAttached();
});

test("pots a11y", async ({ page }) => {
  await page.goto("/pots");

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});

test("add pot a11y", async ({ page, login }) => {
  await login();
  await page.goto("/pots/add");

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});
