# Use Node.js LTS version as base image
# previously used 14
FROM node:20 AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm ci
# Install dependencies production
# RUN npm install --only=production

# Copy the rest of the application files
COPY . .

# Expose port 5000 (or any other required port)
EXPOSE 5000

# Development stage
FROM node:20 AS development

WORKDIR /app

COPY --from=builder /app .
COPY nodemon.json .
COPY .env.development .env


EXPOSE 3000

CMD ["npm", "run", "devstart"]

# Production stage
FROM node:20-slim AS production

WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/src ./src
COPY .env.production .env

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "run", "start"]
