const locales: Intl.LocalesArgument = "en-US";
const defaultOptions: Intl.NumberFormatOptions = {
  style: "currency",
  currency: "USD",
  signDisplay: "negative",
};

export type CurrencyOptions = {
  trailingZeroDisplay?: "stripIfInteger";
  signDisplay?: "always";
};

export const currency = (value: number, options?: CurrencyOptions) => {
  return new Intl.NumberFormat(locales, {
    ...defaultOptions,
    ...options,
  }).format(value);
};

export const percent = (value: number) => {
  return new Intl.NumberFormat(locales, {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value);
};

export const date = (value: Date) => {
  return new Intl.DateTimeFormat(locales, {
    dateStyle: "medium",
  }).format(value);
};
