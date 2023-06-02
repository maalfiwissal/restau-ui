FROM node:18.16.0 as build


WORKDIR /app

COPY package*.json ./


RUN npm install


COPY . .


RUN npm run build

EXPOSE 3000


CMD ["npx", "serve", "build"]
