# Stage 1: base
FROM node:20 AS base
WORKDIR /app

# Copy root files (IMPORTANT)
COPY package.json package-lock.json turbo.json ./

# Copy full monorepo
COPY . .

RUN npm install

FROM base AS builder

# Stage 2: dev
FROM base AS dev
WORKDIR /app

CMD ["npx", "turbo", "run", "docker:with-nginx:run", "--filter=frontend"]