import type AxeBuilder from "@axe-core/playwright";

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
