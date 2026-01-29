FROM node:18.20

WORKDIR /app

ARG NODE_ENV=production

COPY ./*.json ./
RUN npm install

COPY index.js index.js

CMD ["npm", "run", "prod"]