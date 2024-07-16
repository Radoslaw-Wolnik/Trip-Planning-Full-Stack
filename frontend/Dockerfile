# Use Node.js LTS version as base image
FROM node:14 as build-stage

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy the built app from build-stage
COPY --from=build-stage /app/build /usr/share/nginx/html

# Expose port 80 to the outside world - for production
# Expose port 3000 for development purposes
EXPOSE 3000

# Command to run the app (development server)
CMD ["npm", "start"]

# Production
# Command to run the nginx server
# CMD ["nginx", "-g", "daemon off;"]
