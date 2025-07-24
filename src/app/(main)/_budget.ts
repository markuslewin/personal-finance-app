export const getRelevantBudgetIds = (
  budgets: { id: string; spent: number }[],
) => {
  return budgets
    .toSorted((a, b) => {
      return a.spent - b.spent;
    })
    .slice(0, 4)
    .map((budget) => {
      return budget.id;
    });
};
