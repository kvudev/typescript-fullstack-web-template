FROM node:20-alpine AS base
WORKDIR /app

# Install backend and frontend dependencies
COPY backend/package.json backend/package-lock.json ./backend/
COPY frontend/package.json frontend/package-lock.json ./frontend/

FROM base AS deps
RUN cd backend && npm install
RUN cd frontend && npm install

FROM deps AS build
COPY backend ./backend
COPY frontend ./frontend
RUN cd backend && if [ -f package.json ]; then npm run build || true; fi
RUN cd frontend && npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY backend ./backend
COPY frontend ./frontend

EXPOSE 3000
CMD ["sh", "-c", "cd backend && npm start"]