# Server Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install server dependencies
RUN npm install

# Copy server code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose server port
EXPOSE 5000

# Start Express server
CMD ["npm", "start"]
