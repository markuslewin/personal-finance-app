export const sortingOptions = [
  "Latest",
  "Oldest",
  "A to Z",
  "Z to A",
  "Highest",
  "Lowest",
] as const;

export type SortingOption = (typeof sortingOptions)[number];
