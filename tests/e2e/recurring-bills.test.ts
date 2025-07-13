import { AxeBuilder } from "@axe-core/playwright";
import { expect } from "@playwright/test";
import { test, waitForHydration } from "tests/playwright-utils";

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
  await waitForHydration(page);
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
    await waitForHydration(page);
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
