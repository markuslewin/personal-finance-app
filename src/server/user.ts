import "server-only";
import { db } from "~/server/db";
import bcrypt from "bcrypt";
import { createSession } from "~/app/_auth";

export const logIn = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await db.user.findUnique({
    select: {
      id: true,
      password: {
        select: {
          hash: true,
        },
      },
    },
    where: {
      email,
    },
  });
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (!user || user.password === null) {
    throw new UserError("Invalid credentials", {
      cause: {
        field: "password",
      },
    });
  }

  const isSuccess = await bcrypt.compare(password, user.password.hash);
  if (!isSuccess) {
    throw new UserError("Invalid credentials", {
      cause: {
        field: "password",
      },
    });
  }

  await createSession(user.id);
};

export const signUp = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  const existingUser = await db.user.findUnique({
    select: {
      id: true,
    },
    where: {
      email,
    },
  });
  if (existingUser) {
    // todo: Don't expose this information. Send email with link to onboarding
    throw new UserError("This email is already in use", {
      cause: {
        field: "email",
      },
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  // todo: Seed tables of mutable data with `user.id`
  const user = await db.user.create({
    data: {
      email,
      name,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
    select: {
      id: true,
    },
  });

  await createSession(user.id);
};

export class UserError extends Error {
  cause: Cause;

  constructor(message: string, options: ErrorOptions & { cause: Cause }) {
    super(message, options);
    this.name = "UserError";
    this.cause = options.cause;
  }
}

type Cause = {
  field: "email" | "password";
  error?: Error;
};
