# syntax=docker/dockerfile:1

# -- Stage 1: Prune ---------------------------------------------------------
# Use turbo prune to create a sparse workspace with only dependencies needed
FROM node:20-alpine AS pruner

WORKDIR /app

RUN corepack enable
RUN npm install -g turbo

COPY . .

RUN turbo prune --scope=@ts-project-template/web --docker

# -- Stage 2: Install -------------------------------------------------------
FROM node:20-alpine AS installer

WORKDIR /app

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

RUN corepack enable

# Copy installed dependencies
COPY --from=installer /app .

# Copy source code
COPY --from=pruner /app/out/full .

# Also copy root tsconfig
COPY --from=pruner /app/tsconfig.base.json ./tsconfig.base.json

ARG NEXT_PUBLIC_API_URL=http://localhost:3001
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build with turbo
RUN pnpm turbo build --filter=@ts-project-template/web

# -- Stage 4: Runtime ------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ARG NEXT_PUBLIC_API_URL=http://localhost:3001
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN corepack enable

# Copy necessary files from builder
COPY --from=builder /app/frontend/web/.next/standalone .
COPY --from=builder /app/frontend/web/.next/static ./frontend/web/.next/static
COPY --from=builder /app/frontend/web/public ./frontend/web/public

EXPOSE 3000

CMD ["node", "frontend/web/server.js"]
