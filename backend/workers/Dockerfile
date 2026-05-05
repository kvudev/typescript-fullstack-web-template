FROM node:20
WORKDIR /app
COPY database/package.json ./database/package.json
COPY database/prisma ./database/prisma
WORKDIR /app/database
RUN npm install
RUN npx prisma generate --schema prisma/schema.prisma
WORKDIR /app
COPY workers/package.json ./workers/package.json
COPY layer ./layer
WORKDIR /app/layer
RUN npm install
RUN npx prisma generate --schema /app/database/prisma/schema.prisma
WORKDIR /app
WORKDIR /app/workers
RUN npm install
WORKDIR /app
COPY workers ./workers
COPY database ./database
WORKDIR /app/workers
CMD ["npm", "run", "start:cron"]
