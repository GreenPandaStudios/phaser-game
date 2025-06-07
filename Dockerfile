FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE ${PORT:-8080}


CMD ["sh", "-c", "npm run start"]