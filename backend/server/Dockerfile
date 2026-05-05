FROM node:20
WORKDIR /app
COPY database/package.json ./database/package.json
COPY database/prisma ./database/prisma
WORKDIR /app/database
RUN npm install
RUN npx prisma generate --schema prisma/schema.prisma
WORKDIR /app
COPY server/package.json ./server/package.json
COPY layer ./layer
WORKDIR /app/layer
RUN npm install
RUN npx prisma generate --schema /app/database/prisma/schema.prisma
WORKDIR /app
WORKDIR /app/server
RUN npm install
WORKDIR /app
COPY server ./server
COPY database ./database
WORKDIR /app/server
EXPOSE 3000
CMD ["npm", "run", "start:server"]
