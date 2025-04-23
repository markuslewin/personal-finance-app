FROM node:22

WORKDIR /app

COPY package.json package-lock.json ./
# `postinstall` generates the Prisma Client
COPY prisma ./prisma
RUN npm i

COPY src ./src
COPY public ./public
COPY next.config.js .
COPY tsconfig.json .

