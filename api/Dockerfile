# Stage 1: Build the application
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy the rest of the application code
COPY . .

# Build the application if necessary
# RUN npm run build  <-- Uncomment if you have a build step like compiling TypeScript

# Stage 2: Setup the runtime environment
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy environment configuration
COPY --from=builder /app/.env.docker ./.env

# Copy node_modules and build artifacts from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

# Expose the application port
EXPOSE 3333

# Start the application
CMD ["npm", "start"]
