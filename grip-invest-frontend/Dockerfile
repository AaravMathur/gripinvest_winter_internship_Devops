# Stage 1: Build Vite + TypeScript app
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy TypeScript + Vite configs
COPY tsconfig*.json ./
COPY vite.config.ts ./

# Copy index.html (Vite entry)
COPY index.html ./

# Copy source files
COPY src/ ./src/
COPY public/ ./public/

# Build the app
RUN npm run build

# Stage 2: Serve via nginx
FROM nginx:alpine

# Copy the built app (Vite outputs to /dist)
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
