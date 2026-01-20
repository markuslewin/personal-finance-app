/* eslint-disable react-hooks/rules-of-hooks */

import type AxeBuilder from "@axe-core/playwright";
import { faker } from "@faker-js/faker";
import { test as baseTest, type Page } from "@playwright/test";
import { PrismaMssql } from "@prisma/adapter-mssql";
import { createConfig } from "~/app/_prisma";
import { PrismaClient } from "../prisma/generated/prisma/client";

type AxeResults = Awaited<
  ReturnType<InstanceType<typeof AxeBuilder>["analyze"]>
>;

// https://playwright.dev/docs/accessibility-testing#using-snapshots-to-allow-specific-known-issues
export const violationFingerprints = (accessibilityScanResults: AxeResults) => {
  const violationFingerprints = accessibilityScanResults.violations.map(
    (violation) => ({
      rule: violation.id,
      // These are CSS selectors which uniquely identify each element with
      // a violation of the rule in question.
      targets: violation.nodes.map((node) => node.target),
    }),
  );

  return JSON.stringify(violationFingerprints, null, 2);
};

export const waitForHydration = (page: Page) => {
  return page.waitForSelector('html[data-hydrated="true"]', {
    state: "attached",
  });
};

const db = new PrismaClient({
  adapter: new PrismaMssql(
    createConfig(process.env as Partial<Record<string, string>>),
  ),
  log: ["error"],
});

type User = {
  name: string;
  email: string;
  password: string;
};

export const test = baseTest.extend<{
  login: () => Promise<{ user: User }>;
}>({
  login: async ({ page }, use) => {
    const user = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await use(async () => {
      // todo: Would be more efficient to run `signUp` here
      await page.goto("/signup");
      await page.getByRole("textbox", { name: "name" }).fill(user.name);
      await page.getByRole("textbox", { name: "email" }).fill(user.email);
      await page.getByRole("textbox", { name: "password" }).fill(user.password);
      await page.getByRole("button", { name: "create account" }).click();
      await page.waitForURL("/");

      return {
        user,
      };
    });

    await db.user.delete({
      where: {
        email: user.email,
      },
    });
  },
});
