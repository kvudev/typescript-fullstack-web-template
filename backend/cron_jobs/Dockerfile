FROM node:20-alpine
WORKDIR /app
COPY cron_jobs/package.json ./package.json
RUN npm install
COPY cron_jobs ./cron_jobs
COPY database ./database
WORKDIR /app/cron_jobs
CMD ["npm", "run", "start:cron"]
