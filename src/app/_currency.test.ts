import { test, expect } from "@jest/globals";
import { centsSchema } from "~/app/_currency";

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
    message: "Invalid precision",
  },
  {
    value: "0",
    message: "Number must be greater than 0",
  },
  {
    value: "0.001",
    message: "Invalid precision",
  },
  {
    value: "-0.01",
    message: "Number must be greater than 0",
  },
  {
    value: "-100",
    message: "Number must be greater than 0",
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
