# Stage 1: base
FROM node:20 AS base
WORKDIR /app

COPY package.json package-lock.json turbo.json ./
COPY . .

RUN npm install

# Stage 2: dev
FROM base AS dev
WORKDIR /app

USER node

CMD ["npx", "turbo", "run", "docker:with-nginx:run", "--filter=frontend"]