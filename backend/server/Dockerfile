FROM node:20-alpine
WORKDIR /app
COPY server/package.json ./package.json
RUN npm install
COPY server ./server
COPY database ./database
WORKDIR /app/server
EXPOSE 3000
CMD ["npm", "run", "start:server"]
