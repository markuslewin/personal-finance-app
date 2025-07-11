import { Prisma } from "@prisma/client";
import "server-only";
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
  // todo: Transaction
  const pot = await db.pot.delete({
    select: {
      total: true,
    },
    where: {
      id,
    },
  });

  const balance = await db.balance.findFirstOrThrow();
  await db.balance.update({
    data: {
      current: balance.current + pot.total,
    },
    where: {
      id: balance.id,
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
  field: "theme";
  error: Error;
};
