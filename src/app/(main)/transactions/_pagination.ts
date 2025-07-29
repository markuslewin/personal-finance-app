export const MIN_AVAILABLE = [1, "...", 4, "...", 7].length;

type Pages = (number | "...")[];

const getHoleSides = (
  available: number,
  current: number,
  total: number,
): "left" | "right" | "both" | "none" => {
  available =
    Math.max(MIN_AVAILABLE, available) - new Set([1, current, total]).size;
  if (current + Math.ceil(available / 2) >= total - 1) {
    if (current - Math.floor(available / 2) <= 2) {
      return "none";
    } else {
      return "left";
    }
  } else {
    if (current - Math.floor(available / 2) <= 2) {
      return "right";
    } else {
      return "both";
    }
  }
};

export const getPages = (
  available: number,
  current: number,
  total: number,
): Pages => {
  const myAvailable = Math.max(MIN_AVAILABLE, available);
  if (myAvailable >= total) {
    return [...Array(total).keys()].map((i) => {
      return i + 1;
    });
  } else if (current <= 3) {
    return [
      ...[...Array(myAvailable - 2).keys()].map((i) => {
        return i + 1;
      }),
      "...",
      total,
    ];
  } else if (current + 2 >= total) {
    return [
      1,
      "...",
      ...[...Array(myAvailable - 2).keys()].map((i) => {
        return i + 1 + 2 + total - myAvailable;
      }),
    ];
  }

  const sides = getHoleSides(available, current, total);
  available = Math.max(MIN_AVAILABLE, available);
  switch (sides) {
    case "both":
      return [
        1,
        "...",
        ...[...Array(available - 4).keys()].map((i) => {
          return i + current - Math.floor((available - 5) / 2);
        }),
        "...",
        total,
      ];
    case "none":
      return [...Array(total).keys()].map((i) => {
        return i + 1;
      });
    case "left":
      return [
        1,
        "...",
        ...[...Array(available - 2).keys()].map((i) => {
          return i + 1 + 2 + total - available;
        }),
      ];
    case "right":
      return [
        ...[...Array(available - 2).keys()].map((i) => {
          return i + 1;
        }),
        "...",
        total,
      ];
  }
};
