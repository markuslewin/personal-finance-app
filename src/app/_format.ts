const locales: Intl.LocalesArgument = "en-US";
const defaultOptions: Intl.NumberFormatOptions = {
  style: "currency",
  currency: "USD",
};

type CurrencyOptions = {
  trailingZeroDisplay?: "stripIfInteger";
  signDisplay?: "always";
};

export const currency = (value: number, options?: CurrencyOptions) => {
  return new Intl.NumberFormat(locales, {
    ...defaultOptions,
    ...options,
  }).format(value);
};
