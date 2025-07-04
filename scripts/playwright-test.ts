import {
  GenericContainer,
  Network,
  type StartedNetwork,
  Wait,
  type StartedTestContainer,
} from "testcontainers";
import {
  MSSQLServerContainer,
  type StartedMSSQLServerContainer,
} from "@testcontainers/mssqlserver";
import { execa } from "execa";

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

const createJDBC = ({
  authority,
  database,
  user,
  password,
}: {
  authority: string;
  database: string;
  user: string;
  password: string;
}) => {
  return `sqlserver://${authority};database=${database};user=${user};password=${password};encrypt=true;trustServerCertificate=true;`;
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

  await execa({
    stdio: "inherit",
    env: {
      DATABASE_URL: createJDBC({
        ...DATABASE_CONNECTION_OPTIONS,
        authority: `${db.getHost()}:${db.getPort()}`,
      }),
    },
  })`prisma migrate reset --force --skip-generate`; // --skip-seed

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
        DATABASE_URL: createJDBC({
          ...DATABASE_CONNECTION_OPTIONS,
          authority: DATABASE_NETWORK_ALIAS,
        }),
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
      DATABASE_URL: createJDBC({
        ...DATABASE_CONNECTION_OPTIONS,
        authority: `${db.getHost()}:${db.getPort()}`,
      }),
      PORT: String(app.getMappedPort(APP_PORT)),
    },
  })`npm run test:e2e`;
} finally {
  await Promise.all([app?.stop(), db?.stop()]);
}
