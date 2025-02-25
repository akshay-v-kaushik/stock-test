FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --no-cache python3 make g++

RUN npm install --legacy-peer-deps
COPY . .

EXPOSE 8080

CMD ["npm", "start"]
