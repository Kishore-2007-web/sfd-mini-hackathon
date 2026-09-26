@echo off
echo ============================================================
echo   USBShield - AI-Based USB Malware Detection & Protection
echo ============================================================
echo.
echo [1/2] Starting Flask Backend Engine (http://127.0.0.1:5000)...
start "USBShield Backend API" /min cmd /k "py -3 backend\app.py"

echo [2/2] Starting React Vite Frontend Console (http://localhost:5173)...
start "USBShield React Console" cmd /k "cd frontend && npm run dev"

echo.
echo ============================================================
echo   USBShield System Initialized!
echo   Backend API:        http://127.0.0.1:5000
echo   Frontend Dashboard: http://localhost:5173
echo ============================================================
echo.
pause
