FROM node:20-slim

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm build

RUN npm i -g pm2

EXPOSE 8080

CMD ["node", "dist/index.js"]
