export const sum = <T>(array: T[], f: (item: T) => number) => {
  return array.reduce((acc, item) => acc + f(item), 0);
};

export const clamp = (min: number, max: number, value: number) => {
  return Math.min(max, Math.max(min, value));
};
