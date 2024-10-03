FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# it would be better if i managed to only copy this one
#COPY ./src/socketio ./socketio
COPY ./src ./src

COPY .env.production .env

EXPOSE 5001

CMD ["npm", "run", "start:socket"]