import * as z from "zod";
import { type Prisma } from "~/../prisma/generated/prisma/client";
import { sortingOptions, type SortingOption } from "~/app/_sort";

export const DEFAULT_SORT: SortingOption = "Latest";

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
  sort: z.optional(z.enum(sortingOptions)).catch(undefined),
  category: z.optional(z.string().min(1)).catch(undefined),
});

export type SearchSchema = z.infer<typeof searchSchema>;
