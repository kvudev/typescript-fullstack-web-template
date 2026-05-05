FROM node:20-alpine
WORKDIR /app
COPY api/package.json ./package.json
RUN npm install
COPY api ./api
COPY database ./database
WORKDIR /app/api
EXPOSE 3000
CMD ["npm", "run", "start:server"]
