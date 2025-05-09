FROM node:lts-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# `postinstall` generates the Prisma Client
COPY prisma ./prisma
RUN npm ci

FROM base AS seed
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
CMD [ "npm", "run", "db:seed" ]

FROM base AS build
# Skip validating runtime variables of app during build
ENV SKIP_ENV_VALIDATION=true
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
EXPOSE 3000
CMD [ "node", "server.js" ]
