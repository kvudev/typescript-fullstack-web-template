# syntax=docker/dockerfile:1

# -- Stage 1: Prune ---------------------------------------------------------
# Use turbo prune to create a sparse workspace with only dependencies needed
FROM node:20-alpine AS pruner

WORKDIR /app

RUN apk add --no-cache openssl
RUN corepack enable
RUN npm install -g turbo

COPY . .

RUN turbo prune --scope=@ts-project-template/batch --docker

# -- Stage 2: Install -------------------------------------------------------
FROM node:20-alpine AS installer

WORKDIR /app

RUN apk add --no-cache openssl
RUN corepack enable

# Copy pruned monorepo
COPY --from=pruner /app/out/json .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/tsconfig.base.json ./tsconfig.base.json

# Install dependencies
RUN pnpm install --frozen-lockfile

# -- Stage 3: Build --------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl
RUN corepack enable

# Copy installed dependencies
COPY --from=installer /app .

# Copy source code
COPY --from=pruner /app/out/full .

# Also copy root tsconfig
COPY --from=pruner /app/tsconfig.base.json ./tsconfig.base.json

# Generate Prisma client before build
RUN pnpm --filter @ts-project-template/db db:generate

# Build with turbo
RUN pnpm turbo build --filter=@ts-project-template/batch

# -- Stage 4: Runtime ------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache openssl
RUN corepack enable

# Copy pruned dependencies (production only)
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/backend/layer ./backend/layer
COPY --from=installer /app/backend/db ./backend/db

# Copy built application
COPY --from=builder /app/backend/batch ./backend/batch

EXPOSE 3000

CMD ["node", "backend/batch/dist/main.js"]
