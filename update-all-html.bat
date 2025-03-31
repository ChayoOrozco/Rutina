@echo off
echo Actualizando archivos HTML...

set DIAS_DIR=C:\Users\chayo\OneDrive\Escritorio\chayodev\Rutina\dias
set FILES_TO_UPDATE=martes.html miercoles.html jueves.html viernes.html sabado.html domingo.html estrategias.html limpieza.html dieta.html estadisticas.html

for %%f in (%FILES_TO_UPDATE%) do (
    echo Actualizando %%f
    powershell -Command "(Get-Content '%DIAS_DIR%\%%f') | ForEach-Object { $_ -replace '<head>', '<head>^

    <meta charset=\"UTF-8\">^

    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">^

    <title>%%~nf - Nuestra Rutina Semanal</title>^

    <link rel=\"stylesheet\" href=\"../estilos.css\">^

    <link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css\">^

    <script src=\"../js/users-db.js\"></script>^

    <script src=\"../js/activity-tracker.js\"></script>^

    <script src=\"../js/nav-icons.js\"></script>' } | Set-Content '%DIAS_DIR%\%%f.temp'"
    
    powershell -Command "(Get-Content '%DIAS_DIR%\%%f.temp') | ForEach-Object { $_ -replace '<nav id=\"nav-days\">.*?</nav>', '<nav id=\"nav-days\">^

        <!-- La navegación de días se genera dinámicamente con JavaScript -->^

    </nav>^

    <nav id=\"nav-tools\">^

        <!-- La barra de herramientas se genera dinámicamente con JavaScript -->^

    </nav>' } | Set-Content '%DIAS_DIR%\%%f'"
    
    del "%DIAS_DIR%\%%f.temp"
)

echo Actualización completada.
pause
