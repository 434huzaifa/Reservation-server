# Stage 1: Build the application
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src

# Build the TypeScript application
RUN npm run build

# Stage 2: Runtime environment
FROM node:20

WORKDIR /app

# Copy only the built artifacts from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the port the app runs on
EXPOSE 3030

# Start the application
CMD ["node", "dist/index.js"]
