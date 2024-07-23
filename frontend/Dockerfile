# Build stage
FROM node:20 AS build-stage

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the app
RUN npm run build

# Development stage
FROM node:20 AS dev-stage

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .

# Expose port 5173 for development purposes
EXPOSE 5173

# Command to run the development server
CMD ["npm", "run", "dev"]

# Production stage
FROM nginx:alpine

# Copy the built app from the build-stage
COPY --from=build-stage /app/build /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Command to run the nginx server
CMD ["nginx", "-g", "daemon off;"]
