#!/bin/bash

echo "Starting Flask Backend..."
cd backend
source foodfit/bin/activate
python app.py &

echo "Starting React Frontend..."
cd ../frontend
npm run dev
