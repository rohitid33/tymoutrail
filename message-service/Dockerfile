FROM node:18

WORKDIR /app

# Copy only package files first for better caching
COPY package.json ./

# Install dependencies with --no-optional flag to skip optional dependencies
RUN npm install --no-optional --production

# Copy the rest of the application
COPY . .

# Expose the port the app runs on
EXPOSE 3020

# Command to run the application
CMD ["node", "server.js"]
