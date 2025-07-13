import { Prisma } from "@prisma/client";
import "server-only";
import { requireRealUser } from "~/app/_auth";
import { db } from "~/server/db";
import { getUser } from "~/server/user";

export const getPot = async (id: string) => {
  const user = await getUser();
  return db.pot.findUnique({
    select: {
      id: true,
      name: true,
      total: true,
      target: true,
      theme: {
        select: {
          id: true,
        },
      },
    },
    where: {
      id,
      userId: user.id,
    },
  });
};

export const getPots = async () => {
  const user = await getUser();
  return db.pot.findMany({
    select: {
      id: true,
      name: true,
      target: true,
      theme: {
        select: {
          color: true,
        },
      },
      total: true,
    },
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const createPot = async (data: {
  name: string;
  target: number;
  themeId: string;
}) => {
  try {
    const user = await requireRealUser();
    return await db.pot.create({
      data: {
        name: data.name,
        target: data.target,
        total: 0,
        theme: {
          connect: {
            id: data.themeId,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      },
      select: {
        id: true,
      },
    });
  } catch (error) {
    // Currently no way to check related fields
    // https://github.com/prisma/prisma/issues/5040
    // Assume `theme` constraint failed
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2014") {
        throw new PotError("Theme already in use.", {
          cause: {
            field: "theme",
            error,
          },
        });
      } else if (error.code === "P2025") {
        throw new PotError("Theme doesn't exist.", {
          cause: {
            field: "theme",
            error,
          },
        });
      }
    }
    throw error;
  }
};

export const updatePot = async (data: {
  id: string;
  name?: string;
  target?: number;
  total?: number;
  themeId?: string;
}) => {
  try {
    const user = await requireRealUser();
    await db.pot.update({
      select: {
        id: true,
      },
      data: {
        name: data.name,
        target: data.target,
        total: data.total,
        ...(typeof data.themeId === "string"
          ? {
              theme: {
                connect: {
                  id: data.themeId,
                },
              },
            }
          : null),
      },
      where: {
        id: data.id,
        userId: user.id,
      },
    });
  } catch (error) {
    // Currently no way to check related fields
    // https://github.com/prisma/prisma/issues/5040
    // Assume `theme` constraint failed
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2014") {
        throw new PotError("Theme already in use.", {
          cause: {
            field: "theme",
            error,
          },
        });
      } else if (error.code === "P2025") {
        throw new PotError("Theme doesn't exist.", {
          cause: {
            field: "theme",
            error,
          },
        });
      }
    }
    throw error;
  }
};

export const deletePot = async (id: string) => {
  const user = await requireRealUser();

  // todo: Transaction
  const pot = await db.pot.delete({
    select: {
      total: true,
    },
    where: {
      id,
      userId: user.id,
    },
  });

  await db.balance.update({
    data: {
      current: {
        increment: pot.total,
      },
    },
    where: {
      userId: user.id,
    },
  });
};

export const addMoneyToPot = async (data: { id: string; amount: number }) => {
  const user = await requireRealUser();
  // todo: Transaction
  // todo: Lock
  const pot = await db.pot.findUnique({
    select: {
      total: true,
      user: {
        select: {
          balance: {
            select: {
              current: true,
            },
          },
        },
      },
    },
    where: {
      id: data.id,
      userId: user.id,
    },
  });
  if (!pot) {
    throw new Error("Pot not found");
  }
  if (!pot.user.balance) {
    throw new Error("Balance not found");
  }

  if (pot.user.balance.current < data.amount) {
    throw new PotError("Insufficient funds", {
      cause: {
        field: "amount",
      },
    });
  }

  await db.pot.update({
    data: {
      total: {
        increment: data.amount,
      },
      user: {
        update: {
          balance: {
            update: {
              current: {
                decrement: data.amount,
              },
            },
          },
        },
      },
    },
    where: {
      id: data.id,
      userId: user.id,
    },
  });
};

export class PotError extends Error {
  cause: Cause;

  constructor(message: string, options: ErrorOptions & { cause: Cause }) {
    super(message, options);
    this.name = "PotError";
    this.cause = options.cause;
  }
}

type Cause = {
  field: "theme" | "amount";
  error?: Error;
};
