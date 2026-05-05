FROM node:20-alpine
WORKDIR /app
COPY workers/package.json ./package.json
RUN npm install
COPY workers ./workers
COPY database ./database
WORKDIR /app/workers
CMD ["npm", "run", "start:cron"]
