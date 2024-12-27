#!/bin/bash

# Step 1: Clean up old containers, volumes, and images
echo "Cleaning up old containers, volumes, and images for the current project..."
docker-compose down --volumes --rmi all --remove-orphans

# Step 2: Choose environment
read -p "Choose environment (dev/prod): " ENV

if [ "$ENV" = "prod" ]; then
  export DOCKERFILE=Dockerfile.prod
  export NODE_ENV=production
  echo "Running in production mode..."
else
  export DOCKERFILE=Dockerfile.dev
  export NODE_ENV=development
  echo "Running in development mode..."
fi

# Step 3: Rebuild and start
echo "Rebuilding and starting the project..."
docker-compose up --build

# Step 4: Log the contents of the dist directory
echo "Checking dist directory..."
docker exec -it $(docker ps -qf "name=docker-nextjs-nodejs-backend-1") ls -l /app/dist
