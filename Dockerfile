# Dockerfile
FROM node:16-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose ports for both HTTP and WebSocket
EXPOSE 5000

# Set environment variables
#REMEMBER TO MAKE THIS DYNAMIC
# ENV NODE_ENV=LCL
ENV NODE_ENV=PRD
ENV AWS_REGION=us-east-2
# ENV AWS_ACCESS_KEY_ID=dummy
# ENV AWS_SECRET_ACCESS_KEY=dummy

# Start the server
CMD ["node", "dist/server.js"]