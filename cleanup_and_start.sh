#!/bin/bash

# Step 1: Clean up old containers, volumes, and images
echo "Cleaning up old containers, volumes, and images for the current project..."
docker-compose down --volumes --rmi all --remove-orphans

# Step 2: Rebuild the images (if applicable)
echo "Rebuilding and starting the project..."
docker-compose up --build
