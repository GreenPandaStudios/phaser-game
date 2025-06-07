# Build stage
FROM node:lts-alpine AS build

WORKDIR /app

# Copy package.json files for both main app and server
COPY package*.json ./
COPY server/package*.json ./server/

# Install dependencies for main app
RUN npm install

# Install dependencies for server
RUN cd server && npm install

# Copy all source files
COPY . .

# Build frontend and backend
RUN npm run build:frontend
RUN npm run build:backend

# Production stage
FROM node:lts-alpine

WORKDIR /app

# Copy package.json files
COPY package*.json ./
COPY server/package*.json ./server/

# Install only production dependencies
RUN npm install --production
RUN cd server && npm install --production

# Copy built assets from build stage
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/server/dist/vite-build ./server/dist/vite-build

EXPOSE ${PORT:-8080}

# Run the server directly instead of using npm scripts
CMD ["node", "server/dist/server.js"]