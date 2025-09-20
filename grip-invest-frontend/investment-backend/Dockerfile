# Stage 1: Node environment
FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy backend source code including db-init.js
COPY . .

# Expose backend port
EXPOSE 5000

# Run DB init script first, then start backend
CMD ["sh", "-c", "node db-init.js && node index.js"]
