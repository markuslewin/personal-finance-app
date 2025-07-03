import { expect, test } from "vitest";
import { inUTCMonth } from "~/app/_prisma";

test.for([
  {
    date: new Date("2025-07-03T19:35Z"),
    expected: {
      gte: new Date("2025-07-01T00:00Z"),
      lt: new Date("2025-08-01T00:00Z"),
    },
  },
  {
    date: new Date("2025-07-01T00:00Z"),
    expected: {
      gte: new Date("2025-07-01T00:00Z"),
      lt: new Date("2025-08-01T00:00Z"),
    },
  },
  {
    date: new Date("2025-08-01T00:00Z"),
    expected: {
      gte: new Date("2025-08-01T00:00Z"),
      lt: new Date("2025-09-01T00:00Z"),
    },
  },
])("inUTCMonth($date)", ({ date, expected }) => {
  expect(inUTCMonth(date)).toEqual(expected);
});
