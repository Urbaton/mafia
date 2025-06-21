FROM node:22-bookworm-slim

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

CMD ["node", "server.js"]
