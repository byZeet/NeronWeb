@echo off
set location=C:\Users\USER\Desktop\Web\NeronWeb

echo Cerrando Nginx si está en ejecución...
taskkill /IM nginx.exe /F >nul 2>&1

echo Eliminando archivo nginx.pid si existe...
del /f /q "%location%\logs\nginx.pid" >nul 2>&1

echo Iniciando Nginx desde: %location%\nginx
cd /d "%location%\nginx"
start nginx.exe

echo 🔄 Nginx reiniciado correctamente.
pause
