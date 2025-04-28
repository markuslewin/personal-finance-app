FROM node:lts-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# `postinstall` generates the Prisma Client
COPY prisma ./prisma
RUN npm ci

FROM base AS seed
# ARG DATABASE_URL
# ARG SESSION_SECRET
# ENV DATABASE_URL=postgresql://postgres:prisma@db/postgres?schema=public
# ENV SESSION_SECRET=secret
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# RUN npm run db:seed

FROM base AS build
# ARG DATABASE_URL
# ARG SESSION_SECRET
ENV DATABASE_URL=postgresql://postgres:prisma@db/postgres?schema=public
ENV SESSION_SECRET=secret
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base
WORKDIR /app
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/public ./public
COPY --from=build /app/.next/static ./.next/static
ENV NODE_ENV=production
RUN adduser --system nextjs
USER nextjs
