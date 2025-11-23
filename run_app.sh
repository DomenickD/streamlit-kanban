#!/bin/bash

# Function to kill the frontend process on exit
cleanup() {
    echo "Stopping frontend..."
    kill $FRONTEND_PID
    exit
}

# Trap SIGINT (Ctrl+C) to run cleanup
trap cleanup SIGINT

echo "Starting React Frontend..."
cd kanban_board/frontend
npm run dev &
FRONTEND_PID=$!

# Wait a moment for Vite to start
sleep 2

echo "Starting Streamlit App..."
cd ../..
streamlit run app.py
