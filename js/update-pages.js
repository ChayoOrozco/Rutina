/**
 * Script para actualizar todas las páginas HTML de una vez
 * Para usar: node update-pages.js
 * 
 * Requiere Node.js instalado con módulo 'fs' y 'path'
 */

const fs = require('fs');
const path = require('path');

// Configuración
const config = {
    rootDir: path.join(__dirname, '..'),
    dirsToProcess: ['', 'dias'],
    scriptToAdd: '<script src="{prefix}js/config.js"></script>',
    searchBefore: '<script src="{prefix}js/users-db.js"></script>'
};

/**
 * Actualiza un archivo HTML
 * @param {string} filePath - Ruta del archivo
 * @param {string} prefix - Prefijo para las rutas (../ o vacío)
 */
function updateHtmlFile(filePath, prefix) {
    console.log(`Procesando: ${filePath}`);
    
    try {
        // Leer el contenido del archivo
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Preparar script a agregar
        const scriptToAdd = config.scriptToAdd.replace('{prefix}', prefix);
        const searchBefore = config.searchBefore.replace('{prefix}', prefix);
        
        // Verificar si el script ya está presente
        if (content.includes(scriptToAdd)) {
            console.log(`  - El script ya está presente en ${filePath}`);
            return;
        }
        
        // Agregar el script antes del script de users-db.js
        content = content.replace(searchBefore, `${scriptToAdd}\n    ${searchBefore}`);
        
        // Escribir el contenido actualizado
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  - Actualizado correctamente: ${filePath}`);
    } catch (error) {
        console.error(`  - Error al procesar ${filePath}:`, error.message);
    }
}

/**
 * Procesa un directorio y actualiza todos los archivos HTML encontrados
 * @param {string} dir - Directorio a procesar
 */
function processDirectory(dir) {
    const dirPath = path.join(config.rootDir, dir);
    const prefix = dir ? '../' : '';
    
    // Obtener lista de archivos
    const files = fs.readdirSync(dirPath);
    
    // Procesar cada archivo HTML
    files.forEach(file => {
        if (file.endsWith('.html')) {
            const filePath = path.join(dirPath, file);
            updateHtmlFile(filePath, prefix);
        }
    });
}

// Procesar todos los directorios configurados
console.log('Iniciando actualización de páginas HTML...');
config.dirsToProcess.forEach(processDirectory);
console.log('Actualización completa.');
