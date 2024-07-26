# Use Node.js LTS version as base image
FROM node:20 AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .

# Development stage
FROM node:20 AS development

WORKDIR /app

# Copy all files from the builder stage
COPY --from=builder /app .

# Copy additional development-specific configuration files
COPY nodemon.json .
COPY .env.development .env

# make uploads dir in development setup
RUN mkdir -p /app/uploads

# Reinstall node_modules to ensure compatibility
RUN npm ci

# Expose port 5000 for development
EXPOSE 5000

# Command to run the application in development mode
CMD ["npm", "run", "devstart"]

# Production stage
FROM node:20-slim AS production

WORKDIR /app

# Copy package.json and package-lock.json for production install
COPY --from=builder /app/package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy source files from the builder stage
COPY --from=builder /app/src ./src

# Copy production environment configuration
COPY .env.production .env

# make uploads dir in production
RUN mkdir -p /app/uploads

# Expose port 3000 for production
EXPOSE 3000

# Set environment variable for production
ENV NODE_ENV=production

# Command to run the application in production mode
CMD ["npm", "run", "start"]
