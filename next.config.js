/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
// Don't validate for `next dev`, `next build`, `next lint`, etc
// import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  output: "standalone",
  // Faker 10 is ESM-only and needs to be `transform`ed to work with Jest.
  // Transform the Faker package using the Next.js Compiler set up by `nextJest`.
  transpilePackages: ["@faker-js/faker"],
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

export default config;
