export const sum = <T>(array: T[], f: (item: T) => number) => {
  return array.reduce((acc, item) => acc + f(item), 0);
};
