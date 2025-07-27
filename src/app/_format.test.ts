import { expect, test } from "@jest/globals";
import { percent } from "~/app/_format";

test.each<{ value: number; expected: string }>([
  { value: 0.0795, expected: "7.95%" },
  { value: 0.733, expected: "73.3%" },
  { value: 0.01, expected: "1.0%" },
  { value: 0.00999, expected: "1.0%" },
])("percent($value)", ({ value, expected }) => {
  expect(percent(value)).toBe(expected);
});

test("date", () => {
  // todo
  // expect(date(new Date("2024-08-19T00:00Z"))).toBe("19 Aug 2024");
});
