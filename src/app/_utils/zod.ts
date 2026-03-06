export const requiredParams = {
  error: (issue: { input: unknown }) =>
    issue.input === undefined ? "Required" : undefined,
};
