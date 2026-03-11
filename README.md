# Frontend Mentor - Personal Finance App

I document my experience building this app in the post "[Progressive Enhancement in a Finance App](https://markuslewin.github.io/blog/personal-finance-app/)" on my blog.

## Development

The web app fetches data from an MS SQL database. The project contains configurations for managing a local database using Docker.

The database client is generated `postinstall`.

1. Start the database: `docker compose up`
2. Apply the database migrations: `npm run db:reset`
3. Seed the database with the required data: `npm run db:seed`
4. Start the dev server of the web app: `npm run dev`

The connection data inside `.env.example` points to the database server initialized by Docker Compose. To use these settings, copy the example file to the file read by the app:

```sh
cp .env.example .env
```

Data is persisted to the volume `mssql_data`.

### Making changes to the database

The common flow for schema changes:

1. Test things out: `npm run db:push`
2. Generate new migration: `npm run db:generate`
3. Commit migration to version control

Use `npm run db:reset` to reset the database. Don't forget to seed the database with the required app data using `npm run db:seed`.
