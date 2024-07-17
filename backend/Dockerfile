# Use Node.js LTS version as base image
# previously used 14
FROM node:22

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install
# Install dependencies production
# RUN npm install --only=production

# Copy the rest of the application files
COPY . .

# Expose port 5000 (or any other required port)
EXPOSE 5000

# Command to run the app (development server)
CMD ["npm", "run", "dev"]

# Command to run the app production
# CMD ["node", "index.js"]
