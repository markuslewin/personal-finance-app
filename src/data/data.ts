import data from "~/data/data.json";

export const categories = [
  ...new Set([...data.budgets, ...data.transactions].map((d) => d.category)),
];

// Point transaction avatars to `/public`
export const transactions = data.transactions.map((t) => ({
  ...t,
  avatar: t.avatar.replace(/^\./, ""),
}));

export const themes = [
  { name: "Green", color: "var(--color-green)" },
  { name: "Yellow", color: "var(--color-yellow)" },
  { name: "Cyan", color: "var(--color-cyan)" },
  { name: "Navy", color: "var(--color-navy)" },
  { name: "Red", color: "var(--color-red)" },
  { name: "Purple", color: "var(--color-purple)" },
  { name: "Turquoise", color: "var(--color-turquoise)" },
  { name: "Brown", color: "var(--color-brown)" },
  { name: "Magenta", color: "var(--color-magenta)" },
  { name: "Blue", color: "var(--color-blue)" },
  { name: "Navy Grey", color: "var(--color-navy-grey)" },
  { name: "Army Green", color: "var(--color-army-green)" },
  { name: "Pink", color: "var(--color-pink)" },
  { name: "Gold", color: "var(--color-gold)" },
  { name: "Orange", color: "var(--color-orange)" },
];

const themeNameByHex = new Map([
  ["#277C78", "Green"],
  ["#82C9D7", "Cyan"],
  ["#F2CDAC", "Yellow"],
  ["#626070", "Navy"],
  ["#826CB0", "Purple"],
]);

const getThemeNameByHex = (hex: string) => {
  const name = themeNameByHex.get(hex);
  if (typeof name !== "string") {
    throw new Error(`No name found for theme with hex "${hex}"`);
  }

  return name;
};

export const userSeed = (createdAt: Date) => {
  return {
    balance: {
      create: {
        current: data.balance.current,
        expenses: data.balance.expenses,
        income: data.balance.income,
      },
    },
    budgets: {
      create: data.budgets.map((budget, i) => {
        return {
          maximum: budget.maximum,
          category: {
            connect: {
              name: budget.category,
            },
          },
          theme: {
            // todo: or create?
            connect: {
              name: getThemeNameByHex(budget.theme),
            },
          },
          // Guarantee order for sorted reads
          createdAt: new Date(createdAt.getTime() + i),
        };
      }),
    },
    pots: {
      create: data.pots.map((pot, i) => {
        return {
          name: pot.name,
          target: pot.target,
          total: pot.total,
          theme: {
            // todo: or create?
            connect: {
              name: getThemeNameByHex(pot.theme),
            },
          },
          // Guarantee order for sorted reads
          createdAt: new Date(createdAt.getTime() + i),
        };
      }),
    },
  };
};
