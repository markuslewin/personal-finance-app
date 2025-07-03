import { expect, test } from "vitest";
import { currency, type CurrencyOptions, date, percent } from "~/app/_format";

test.for<{ value: number; options?: CurrencyOptions; expected: string }>([
  { value: 4836, expected: "$4,836.00" },
  { value: 3814.25, expected: "$3,814.25" },
  { value: 1700.5, expected: "$1,700.50" },
  {
    value: 850,
    options: {
      trailingZeroDisplay: "stripIfInteger",
    },
    expected: "$850",
  },
  { value: 75.5, options: { signDisplay: "always" }, expected: "+$75.50" },
  { value: -55.5, options: { signDisplay: "always" }, expected: "-$55.50" },
])("currency($value, $options)", ({ value, options, expected }) => {
  expect(currency(value, options)).toBe(expected);
});

test.for<{ value: number; expected: string }>([
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
