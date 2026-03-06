export const getRelevantBudgets = <T extends { id: string; spent: number }>(
  budgets: T[],
) => {
  const relevantIds = new Set(
    budgets
      .toSorted((a, b) => {
        return a.spent - b.spent;
      })
      .slice(0, 4)
      .map((budget) => {
        return budget.id;
      }),
  );
  // Keep the original order
  return budgets.filter((budget) => {
    return relevantIds.has(budget.id);
  });
};
