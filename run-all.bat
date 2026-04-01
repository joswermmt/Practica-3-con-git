@echo off
setlocal

set "ROOT_DIR=%~dp0"
set "FRONTEND_DIR=%ROOT_DIR%frontend"
set "BACKEND_DIR=%ROOT_DIR%backend"

if not exist "%FRONTEND_DIR%\package.json" (
  echo [ERROR] No se encontro frontend\package.json
  pause
  exit /b 1
)

if not exist "%BACKEND_DIR%\package.json" (
  echo [ERROR] No se encontro backend\package.json
  pause
  exit /b 1
)

echo Iniciando Backend y Frontend...
echo.

start "Backend - Practica 3" cmd /k "cd /d ""%BACKEND_DIR%"" && npm run dev"
start "Frontend - Practica 3" cmd /k "cd /d ""%FRONTEND_DIR%"" && npm run dev"

echo Listo. Se abrieron dos ventanas:
echo - Backend en http://localhost:3001
echo - Frontend en la URL que muestre Vite (normalmente http://localhost:5173)
echo.
pause

