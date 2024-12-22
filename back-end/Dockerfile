# Use the official Node.js image as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Expose the backend port
EXPOSE 3000

# Run migrations and then start the application
CMD ["sh", "-c", "yarn migration && yarn dev"]
