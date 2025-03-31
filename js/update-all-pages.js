/**
 * Script para actualizar todas las páginas del proyecto
 * Nuestra Rutina Semanal - Aplicación para usuarios con TDAH, TCA, TEA y Depresión Clínica
 * 
 * Este script debe ejecutarse manualmente desde la consola del navegador 
 * en la raíz del proyecto para actualizar todas las páginas HTML
 */

const fs = require('fs');
const path = require('path');

// Directorio de las páginas de días
const diasDir = path.join(__dirname, '..', 'dias');

// Procesar todos los archivos HTML en el directorio
fs.readdir(diasDir, (err, files) => {
    if (err) {
        console.error('Error al leer el directorio:', err);
        return;
    }

    // Filtrar solo archivos HTML
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    
    // Procesar cada archivo
    htmlFiles.forEach(htmlFile => {
        const filePath = path.join(diasDir, htmlFile);
        
        // Leer el contenido del archivo
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`Error al leer ${htmlFile}:`, err);
                return;
            }
            
            // Realizar reemplazos
            let updatedContent = data;
            
            // 1. Añadir Font Awesome y el nuevo script de navegación
            updatedContent = updatedContent.replace(
                /<link rel="stylesheet" href="..\/estilos.css">/,
                '<link rel="stylesheet" href="../estilos.css">\n    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">'
            );
            
            updatedContent = updatedContent.replace(
                /<script src="..\/js\/activity-tracker.js"><\/script>/,
                '<script src="../js/activity-tracker.js"></script>\n    <script src="../js/nav-icons.js"></script>'
            );
            
            // 2. Reemplazar la barra de navegación
            const navRegex = /<nav id="nav-days">[\s\S]*?<\/nav>/;
            updatedContent = updatedContent.replace(
                navRegex,
                '<nav id="nav-days">\n        <!-- La navegación se genera dinámicamente con JavaScript -->\n    </nav>'
            );
            
            // 3. Eliminar el script de autenticación que ahora está en nav-icons.js
            const scriptRegex = /<script>\s*document\.addEventListener\('DOMContentLoaded',[\s\S]*?<\/script>/;
            updatedContent = updatedContent.replace(
                scriptRegex,
                '<!-- El script de navegación ahora se carga desde nav-icons.js -->'
            );
            
            // Escribir el contenido actualizado
            fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
                if (err) {
                    console.error(`Error al escribir ${htmlFile}:`, err);
                } else {
                    console.log(`${htmlFile} actualizado correctamente.`);
                }
            });
        });
    });
});

console.log('Iniciando actualización de todas las páginas...');
