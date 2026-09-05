# Стадия сборки
FROM node:18.20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig*.json ./
COPY src ./src

RUN npm run build

# Стадия production
FROM node:18.20

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/src/views ./views

CMD ["node", "dist/index.js"]