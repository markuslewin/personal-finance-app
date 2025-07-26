import { z } from "zod";
import { maxInt } from "~/app/_prisma";
import { Big } from "~/app/_big";

// Dollar string to integer cents
export const centsSchema = z
  .string()
  .transform((val, ctx) => {
    try {
      return toCents(val);
    } catch (err) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          err instanceof Error ? getErrorMessage(err.message) : undefined,
      });
    }
  })
  .pipe(
    z.number().int({ message: "Invalid precision" }).positive().lte(maxInt),
  );

// https://mikemcl.github.io/big.js/#Errors
const getErrorMessage = (message: string) => {
  if (/^\[big\.js\]/i.test(message)) {
    return "Invalid value";
  }
  return undefined;
};

const toCents = (dollars: string) => {
  return new Big(dollars).mul("100").toNumber();
};

export const toCentsFromNumber = (dollars: number) => {
  return toCents(String(dollars));
};
