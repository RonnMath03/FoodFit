@echo off
echo Starting Flask Backend...
cd backend
call foodfit\Scripts\activate
start python app.py

echo Starting React Frontend...
cd ..\frontend
npm run dev