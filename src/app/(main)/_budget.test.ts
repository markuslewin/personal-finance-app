import { getRelevantBudgets } from "~/app/(main)/_budget";

test.each<{
  value: { id: string; spent: number }[];
  expected: { id: string; spent: number }[];
}>([
  { value: [{ id: "1", spent: -100 }], expected: [{ id: "1", spent: -100 }] },
  {
    value: [
      { id: "1", spent: -100 },
      { id: "2", spent: -10 },
      { id: "3", spent: -110 },
      { id: "4", spent: -700 },
      { id: "5", spent: -50 },
    ],
    expected: [
      { id: "1", spent: -100 },
      // { id: "2", spent: -10 },
      { id: "3", spent: -110 },
      { id: "4", spent: -700 },
      { id: "5", spent: -50 },
    ],
  },
])("getRelevantBudgets($value)", ({ value, expected }) => {
  expect(getRelevantBudgets(value)).toEqual(expected);
});
