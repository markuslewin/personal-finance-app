export const locales: Intl.LocalesArgument = "en-US";

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
