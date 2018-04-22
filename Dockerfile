FROM node:8-alpine

WORKDIR /app
COPY . .

RUN yarn

CMD ["node", "server.js"]
