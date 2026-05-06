# syntax=docker/dockerfile:1

FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY frontend/web/package.json ./frontend/web/

RUN pnpm install --filter @news-summarizer/web --ignore-scripts

COPY frontend/web ./frontend/web

# Ensure public exists so runtime COPY doesn't fail when empty/missing.
RUN mkdir -p frontend/web/public

ARG NEXT_PUBLIC_API_URL=http://localhost:3001
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN pnpm --filter @news-summarizer/web build

# ── Runtime ──────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/frontend/web/.next/standalone ./
COPY --from=builder /app/frontend/web/.next/static ./frontend/web/.next/static
COPY --from=builder /app/frontend/web/public ./frontend/web/public

EXPOSE 3000

CMD ["node", "frontend/web/server.js"]
