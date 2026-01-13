import { test, expect } from "@jest/globals";
import {
  centsSchema,
  type CurrencyOptions,
  formatCents,
  toDollarValue,
} from "~/app/_currency";

test.each([
  {
    value: "100.50",
    data: 10050,
  },
  {
    value: "100.5",
    data: 10050,
  },
  {
    value: "0.1",
    data: 10,
  },
  {
    value: "0.01",
    data: 1,
  },
  {
    value: "100.99",
    data: 10099,
  },
  {
    value: "20.1",
    data: 2010,
  },
])("valid centsSchema: $value -> $data", ({ value, data }) => {
  const result = centsSchema.safeParse(value);

  expect(result.success).toBe(true);
  expect(result.data).toBe(data);
});

test.each([
  {
    value: "100.501",
    message: "Invalid decimals",
  },
  {
    value: "0",
    message: "Number must be positive",
  },
  {
    value: "0.001",
    message: "Invalid decimals",
  },
  {
    value: "-0.01",
    message: "Number must be positive",
  },
  {
    value: "-100",
    message: "Number must be positive",
  },
  {
    value: "100,50",
    message: "Invalid value",
  },
  {
    value: "100a",
    message: "Invalid value",
  },
  {
    value: "a",
    message: "Invalid value",
  },
  {
    value: "100 .12",
    message: "Invalid value",
  },
])("invalid centsSchema: $value -> $message", ({ value, message }) => {
  const result = centsSchema.safeParse(value);

  expect(result.success).toBe(false);
  expect(result.error?.issues).toMatchObject([{ message }]);
});

test.each<{ value: number; options?: CurrencyOptions; expected: string }>([
  { value: 483600, expected: "$4,836.00" },
  { value: 381425, expected: "$3,814.25" },
  { value: 170050, expected: "$1,700.50" },
  {
    value: 85000,
    options: {
      trailingZeroDisplay: "stripIfInteger",
    },
    expected: "$850",
  },
  { value: 7550, options: { signDisplay: "always" }, expected: "+$75.50" },
  { value: -5550, options: { signDisplay: "always" }, expected: "-$55.50" },
])("formatCents($value, $options)", ({ value, options, expected }) => {
  expect(formatCents(value, options)).toBe(expected);
});

test.each([
  { value: 483600, expected: "4836" },
  { value: 381425, expected: "3814.25" },
  { value: 170050, expected: "1700.5" },
  {
    value: 85000,
    expected: "850",
  },
  { value: 7550, expected: "75.5" },
  { value: -5550, expected: "-55.5" },
  { value: 2010, expected: "20.1" },
])("toDollarValue($value, $expected)", ({ value, expected }) => {
  expect(toDollarValue(value)).toBe(expected);
});
