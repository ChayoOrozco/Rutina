@echo off
echo ======================================================
echo   SINCRONIZACION DE RUTINA FAMILIAR AL SERVIDOR
echo ======================================================
echo.

rem Configuración (modifica estas variables según tu entorno)
set SERVER_IP=192.168.200.124
set SERVER_PORT=8080
set SERVER_USER=tu_usuario
set SERVER_PASS=tu_password
set SERVER_PATH=/var/www/html/rutina
set LOCAL_PATH=C:\Users\chayo\OneDrive\Escritorio\chayodev\Rutina

echo Configuración:
echo - Servidor: %SERVER_IP%:%SERVER_PORT%
echo - Ruta local: %LOCAL_PATH%
echo - Ruta servidor: %SERVER_PATH%
echo.

echo Selecciona qué deseas sincronizar:
echo 1. Todos los archivos (sincronización completa)
echo 2. Solo archivos actualizados (más rápido)
echo 3. Solo archivos JavaScript
echo 4. Solo archivos HTML
echo 5. Solo archivos CSS
echo 6. Cancelar
echo.

set /p OPTION="Ingresa tu opción (1-6): "

if "%OPTION%"=="1" (
    echo.
    echo Sincronizando TODOS LOS ARCHIVOS...
    
    rem Esta sección usaría comandos como scp, rsync o xcopy dependiendo de tu entorno
    echo NOTA: Necesitas configurar esta sección con los comandos específicos para tu servidor
    
    rem Ejemplo usando scp (descomenta y ajusta si usas SSH):
    rem scp -r -P %SERVER_PORT% %LOCAL_PATH%\* %SERVER_USER%@%SERVER_IP%:%SERVER_PATH%
    
    rem Ejemplo usando xcopy para servidores de red local (descomenta y ajusta si es una unidad de red):
    rem xcopy /E /Y /D %LOCAL_PATH%\* \\%SERVER_IP%\%SERVER_PATH%\
    
) else if "%OPTION%"=="2" (
    echo.
    echo Sincronizando ARCHIVOS ACTUALIZADOS...
    
    rem Ejemplo para sincronizar solo archivos más nuevos
    rem xcopy /E /Y /D:%date:~-4,4%-%date:~-7,2%-%date:~0,2% %LOCAL_PATH%\* \\%SERVER_IP%\%SERVER_PATH%\
    
) else if "%OPTION%"=="3" (
    echo.
    echo Sincronizando ARCHIVOS JAVASCRIPT...
    
    rem Ejemplo para sincronizar solo archivos JS
    rem xcopy /E /Y %LOCAL_PATH%\js\*.js \\%SERVER_IP%\%SERVER_PATH%\js\
    
) else if "%OPTION%"=="4" (
    echo.
    echo Sincronizando ARCHIVOS HTML...
    
    rem Ejemplo para sincronizar solo archivos HTML
    rem xcopy /Y %LOCAL_PATH%\*.html \\%SERVER_IP%\%SERVER_PATH%\
    rem xcopy /Y %LOCAL_PATH%\dias\*.html \\%SERVER_IP%\%SERVER_PATH%\dias\
    
) else if "%OPTION%"=="5" (
    echo.
    echo Sincronizando ARCHIVOS CSS...
    
    rem Ejemplo para sincronizar solo archivos CSS
    rem xcopy /Y %LOCAL_PATH%\*.css \\%SERVER_IP%\%SERVER_PATH%\
    
) else if "%OPTION%"=="6" (
    echo.
    echo Operación cancelada.
    goto end
) else (
    echo.
    echo Opción no válida. Por favor selecciona una opción entre 1 y 6.
    goto end
)

echo.
echo =============================================================
echo IMPORTANTE: Este script es una plantilla que debes configurar
echo específicamente para tu entorno y servidor.
echo =============================================================
echo.
echo Para configurarlo correctamente:
echo 1. Edita este archivo (sync-to-server.bat) con Notepad
echo 2. Modifica las variables SERVER_IP, SERVER_USER, etc.
echo 3. Descomenta y ajusta los comandos de sincronización
echo    según el tipo de servidor y acceso que tengas
echo.

:end
pause
