import { expect, test } from "@jest/globals";
import { isUnavailable } from "~/app/(main)/@dialog/(.)pots/[id]/edit/_utils";

test.each([
  { items: [], id: "1", expected: false },
  { items: [{ id: "1" }], id: "1", expected: false },
  { items: [{ id: "2" }], id: "1", expected: true },
  // Shouldn't ever happen
  { items: [{ id: "2" }, { id: "1" }], id: "1", expected: true },
])("isUnavailable($items, $id)", ({ items, id, expected }) => {
  expect(isUnavailable(items, id)).toBe(expected);
});
