# syntax=docker/dockerfile:1

# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl
RUN corepack enable

# Copy workspace manifests
COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY backend/layer/package.json ./backend/layer/
COPY backend/db/package.json ./backend/db/
COPY backend/api/package.json ./backend/api/

RUN pnpm install --filter @news-summarizer/layer \
                 --filter @news-summarizer/db \
                 --filter @news-summarizer/api \
                 --ignore-scripts

COPY backend/layer ./backend/layer
COPY backend/db ./backend/db
COPY backend/api ./backend/api

# Generate Prisma client before build
COPY backend/db/prisma ./backend/db/prisma
RUN pnpm --filter @news-summarizer/db db:generate

RUN pnpm --filter @news-summarizer/layer build \
 && pnpm --filter @news-summarizer/db build \
 && pnpm --filter @news-summarizer/api build

# ── Stage 2: Runtime ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache openssl

COPY --from=builder /app/backend/api ./backend/api
COPY --from=builder /app/backend/layer ./backend/layer
COPY --from=builder /app/backend/db ./backend/db
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3001

CMD ["node", "backend/api/dist/main"]
