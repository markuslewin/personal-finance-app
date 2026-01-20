import {
  MSSQLServerContainer,
  type StartedMSSQLServerContainer,
} from "@testcontainers/mssqlserver";
import { execa } from "execa";
import {
  GenericContainer,
  Network,
  Wait,
  type StartedNetwork,
  type StartedTestContainer,
} from "testcontainers";
import { type Config } from "~/app/_prisma";

const { APP_IMAGE } = process.env;
if (!APP_IMAGE) {
  throw new Error("Invalid environment variable `APP_IMAGE`");
}

const APP_PORT = 3000;
const DATABASE_CONNECTION_OPTIONS = {
  database: "master",
  user: "sa",
  password: "Passw0rd",
};
const DATABASE_NETWORK_ALIAS = "db";

const createDbEnv = ({
  server,
  port,
}: {
  server: string;
  port: number;
}): Config => {
  return {
    DB_USER: DATABASE_CONNECTION_OPTIONS.user,
    DB_PASSWORD: DATABASE_CONNECTION_OPTIONS.password,
    DB_SERVER: server,
    DB_PORT: `${port}`,
    DB_DATABASE: DATABASE_CONNECTION_OPTIONS.database,
    DB_TRUST_SERVER_CERT: "true",
  };
};

const setUpDb = async (network: StartedNetwork) => {
  const db = await new MSSQLServerContainer(
    "mcr.microsoft.com/mssql/server:latest",
  )
    .withNetwork(network)
    .withNetworkAliases(DATABASE_NETWORK_ALIAS)
    .acceptLicense()
    .withDatabase(DATABASE_CONNECTION_OPTIONS.database)
    // .withUsername(OPTIONS.user)
    .withPassword(DATABASE_CONNECTION_OPTIONS.password)
    .start();

  const ex = execa({
    stdio: "inherit",
    env: createDbEnv({
      server: db.getHost(),
      port: db.getPort(),
    }),
  });
  await ex`prisma migrate reset --force`;
  await ex`prisma db seed`;

  return db;
};

let app: StartedTestContainer | undefined;
let db: StartedMSSQLServerContainer | undefined;
try {
  const network = await new Network().start();
  [app, db] = await Promise.all([
    new GenericContainer(APP_IMAGE)
      .withNetwork(network)
      .withEnvironment({
        ...createDbEnv({ server: DATABASE_NETWORK_ALIAS, port: 1433 }),
        SESSION_SECRET: "s3cret",
      })
      .withExposedPorts(APP_PORT)
      .withWaitStrategy(Wait.forListeningPorts())
      .start(),
    setUpDb(network),
  ]);

  await execa({
    stdio: "inherit",
    env: {
      ...createDbEnv({
        server: db.getHost(),
        port: db.getPort(),
      }),
      PORT: String(app.getMappedPort(APP_PORT)),
    },
  })`npm run test:e2e`;
} finally {
  await Promise.all([app?.stop(), db?.stop()]);
}
