import { type Prisma } from "@prisma/client";
import { z } from "zod";

export const sortingOptions = [
  "Latest",
  "Oldest",
  "A to Z",
  "Z to A",
  "Highest",
  "Lowest",
] as const;

type SortingOption = (typeof sortingOptions)[number];

export const getOrderBy = (
  option: SortingOption,
): Prisma.TransactionOrderByWithRelationInput => {
  switch (option) {
    case "A to Z":
      return {
        name: "asc",
      };
    case "Highest":
      return {
        amount: "desc",
      };
    case "Latest":
      return { date: "desc" };
    case "Lowest":
      return { amount: "asc" };
    case "Oldest":
      return { date: "asc" };
    case "Z to A":
      return { name: "desc" };
  }
};

export const searchSchema = z.object({
  name: z.optional(z.string().min(1)).catch(undefined),
  sort: z.enum(sortingOptions).catch("Latest"),
  category: z.optional(z.string().min(1)).catch(undefined),
});

export type SearchSchema = z.infer<typeof searchSchema>;
