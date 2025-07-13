import { AxeBuilder } from "@axe-core/playwright";
import { expect } from "@playwright/test";
import {
  test,
  violationFingerprints,
  waitForHydration,
} from "tests/playwright-utils";

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
  await waitForHydration(page);
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
  await waitForHydration(page);
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
    await waitForHydration(page);
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
    await waitForHydration(page);
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
