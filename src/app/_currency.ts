import * as z from "zod";
import { Big } from "~/app/_big";
import { locales } from "~/app/_format";
import { maxInt } from "~/app/_prisma";
import { requiredParams } from "~/app/_zod";

// Dollar string to integer cents
export const centsSchema = z
  .string(requiredParams)
  .transform((val, ctx) => {
    try {
      return toCents(val);
    } catch (err) {
      ctx.issues.push({
        code: "custom",
        input: val,
        message:
          err instanceof Error ? getErrorMessage(err.message) : undefined,
      });
    }
  })
  .pipe(
    z
      .number()
      .int("Invalid decimals")
      .positive("Number must be positive")
      .lte(maxInt, "Number is too large"),
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

export const toDollarValue = (cents: number) => {
  return Big(String(cents)).div("100").toString();
};

const defaultOptions: Intl.NumberFormatOptions = {
  style: "currency",
  currency: "USD",
  signDisplay: "negative",
};

export type CurrencyOptions = {
  trailingZeroDisplay?: "stripIfInteger";
  signDisplay?: "always";
};

export const formatCents = (cents: number, options?: CurrencyOptions) => {
  return new Intl.NumberFormat(locales, {
    ...defaultOptions,
    ...options,
  }).format(cents / 100);
};
