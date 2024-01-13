#!/bin/bash

echo "Stopping background ngrok process"
kill -9 $(ps -ef | grep 'ngrok' | grep -v 'grep' | awk '{print $2}')
echo "ngrok stopped 🤠"