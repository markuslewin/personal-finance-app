import { getRelevantBudgetIds } from "~/app/(main)/_budget";

test.each<{ value: { id: string; spent: number }[]; expected: string[] }>([
  { value: [{ id: "1", spent: -100 }], expected: ["1"] },
  {
    value: [
      { id: "1", spent: -100 },
      { id: "2", spent: -50 },
      { id: "3", spent: -110 },
      { id: "4", spent: -700 },
      { id: "5", spent: -10 },
    ],
    expected: ["4", "3", "1", "2"],
  },
])("getRelevantBudgetIds($value)", ({ value, expected }) => {
  expect([...getRelevantBudgetIds(value)]).toEqual(expected);
});
