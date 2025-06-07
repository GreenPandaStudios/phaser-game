FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE ${PORT:-3001}


CMD ["sh", "-c", "npm run start"]