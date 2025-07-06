import { test, expect } from "@jest/globals";
import { clamp, sum } from "~/app/_math";

test("sum nothing", () => {
  expect(sum([], (i) => i)).toBe(0);
});

test("sum integers", () => {
  expect(sum([1, 2, 3], (i) => i)).toBe(6);
});

test("sum length", () => {
  expect(sum([null], () => 1)).toBe(1);
});

test("sum objects", () => {
  expect(sum([{ value: 12 }, { value: 3 }], (i) => i.value)).toBe(15);
});

test.each([
  {
    min: 1,
    max: 100,
    value: -50,
    expected: 1,
  },
  {
    min: 1,
    max: 100,
    value: 50,
    expected: 50,
  },
  {
    min: 1,
    max: 100,
    value: 150,
    expected: 100,
  },
])("clamp($min, $max, $value)", ({ min, max, value, expected }) => {
  expect(clamp(min, max, value)).toBe(expected);
});
