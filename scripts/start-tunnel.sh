#!/bin/bash

# Get script parent folder to point to .env file and get BOT_TOKEN dynamically
PARENT_PATH=$( cd "$(dirname "${BASH_SOURCE[0]}")" || exit ; pwd -P )

# Get BOT_TOKEN dynamically from local .env file
BOT_TOKEN=$(grep BOT_TOKEN ${PARENT_PATH}/../.env | cut -d '=' -f2)
if test -z "${BOT_TOKEN}"
then
  echo "❌ ERROR: cannot find BOT_TOKEN in your local .env variables file."
  exit 1
fi

# Start NGROK in background
echo "⚡️ Starting ngrok"
ngrok http 3000 > /dev/null &

sleep 2

# Wait for ngrok to be available
while ! nc -z localhost 4040; do
  sleep 1/5 # wait Ngrok to be available
done

# Get NGROK dynamic URL from its own exposed local API
NGROK_REMOTE_URL="$(curl "http://localhost:4040/api/tunnels" | jq ".tunnels[0].public_url")"
if test -z "${NGROK_REMOTE_URL}"
then
  echo "❌ ERROR: ngrok doesn't seem to return a valid URL (${NGROK_REMOTE_URL})."
  exit 1
fi

# Trim double quotes from variable
NGROK_REMOTE_URL=$(echo ${NGROK_REMOTE_URL} | tr -d '"')
# If http protocol is returned, replace by https
NGROK_REMOTE_URL=${NGROK_REMOTE_URL/http:\/\//https:\/\/}

PROJECT_PATH=$( cd "$(dirname "${PARENT_PATH}")" || exit ; pwd -P )

# Remove the NextAuth Env Var to replace it with the new NGROK_REMOTE_URL
sed -i '' "s#NEXTAUTH_URL=.*#NEXTAUTH_URL=${NGROK_REMOTE_URL}#" "${PROJECT_PATH}/.env" && printf "\n👨🏻‍🎨 Changed .env variables to match new NextAuth address. \n"

# Set our NGROK remote url to our development
curl -F "url=${NGROK_REMOTE_URL}/api/bot/${BOT_TOKEN}/" https://api.telegram.org/bot${BOT_TOKEN}/setWebhook

bold=$(tput bold)
normal=$(tput sgr0)
echo ${NGROK_REMOTE_URL} | tr -d '\n' | pbcopy
printf "\n\n🌍 Your ngrok remote URL is 👉 ${bold}${NGROK_REMOTE_URL} 👈\n📋 ${normal}I've just copied it to your clipboard. \n🤖 You may now message  https://t.me/botfather to add the domain to your telegram bot. \n"