FROM node:18.20

WORKDIR /app

ARG NODE_ENV=production

COPY ./*.json ./
RUN npm install
COPY middleware middleware/
COPY routes routes/
COPY views views/
COPY index.js index.js
COPY library.js library.js

CMD ["npm", "run", "prod"]