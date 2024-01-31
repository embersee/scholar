#!/bin/bash

SCRIPTS_DIR="scripts"

# Function to handle cleanup and execute stop-tunnel
cleanup() {
    printf "\n\nShutting down docker container...\n\n"
    docker-compose down
    printf "\n\nCleaning up and stopping tunnel...\n\n"
    "${SCRIPTS_DIR}/stop-tunnel.sh"
    exit 0
}

# Trap Ctrl+C to call the cleanup function
trap cleanup INT

# Execute start-tunnel script
"${SCRIPTS_DIR}/start-tunnel-ubuntu.sh"

printf "\nStarting docker build in de-attached mode."
# Run docker compose up in the background
docker-compose up -d --build

# Keep the script running until Ctrl+C is pressed
printf "\nProject is now up & running. Press Ctrl+C to stop."

# Wait indefinitely
while true; do
    sleep 1
done
