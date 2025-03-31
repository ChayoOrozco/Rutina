<?php
// Este archivo debe colocarse en el servidor
// Acceder a él mediante: http://tu-servidor/rutina/version-check.php

// Lista de archivos importantes a verificar
$files_to_check = [
    "index.html",
    "estilos.css",
    "js/config.js",
    "js/users-db.js",
    "js/nav-icons.js",
    "js/routine-manager.js",
    "js/index-nav.js",
    "dias/lunes.html",
    "dias/martes.html",
    "dias/miercoles.html",
    "dias/jueves.html",
    "dias/viernes.html",
    "dias/sabado.html",
    "dias/domingo.html"
];

// Directorio raíz del sitio (ajústalo según la estructura de tu servidor)
$root_dir = __DIR__;

// Información del servidor
$server_info = [
    "PHP Version" => phpversion(),
    "Server Software" => $_SERVER['SERVER_SOFTWARE'],
    "Document Root" => $_SERVER['DOCUMENT_ROOT'],
    "Current Directory" => $root_dir,
    "Current Time" => date("Y-m-d H:i:s")
];

// Función para obtener información de archivos
function get_file_info($file_path) {
    if (file_exists($file_path)) {
        return [
            "exists" => true,
            "size" => filesize($file_path),
            "modified" => date("Y-m-d H:i:s", filemtime($file_path)),
            "md5" => md5_file($file_path)
        ];
    } else {
        return [
            "exists" => false,
            "error" => "File not found"
        ];
    }
}

// Obtener información de todos los archivos
$files_info = [];
foreach ($files_to_check as $file) {
    $files_info[$file] = get_file_info($root_dir . '/' . $file);
}

// Formato de salida
$output_format = isset($_GET['format']) ? strtolower($_GET['format']) : 'html';

// Salida según formato solicitado
if ($output_format === 'json') {
    header('Content-Type: application/json');
    echo json_encode([
        'server_info' => $server_info,
        'files' => $files_info
    ], JSON_PRETTY_PRINT);
    exit;
}

// Salida HTML por defecto
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verificación de Versiones - Rutina Familiar</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        h1, h2 {
            color: #4a6fa5;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            padding: 10px;
            text-align: left;
            border: 1px solid #ddd;
        }
        th {
            background-color: #4a6fa5;
            color: white;
        }
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        .status-ok {
            color: green;
        }
        .status-error {
            color: red;
        }
    </style>
</head>
<body>
    <h1>Verificación de Versiones - Rutina Familiar</h1>
    
    <h2>Información del Servidor</h2>
    <table>
        <tr>
            <th>Propiedad</th>
            <th>Valor</th>
        </tr>
        <?php foreach ($server_info as $key => $value): ?>
        <tr>
            <td><?= htmlspecialchars($key) ?></td>
            <td><?= htmlspecialchars($value) ?></td>
        </tr>
        <?php endforeach; ?>
    </table>
    
    <h2>Archivos del Sistema</h2>
    <table>
        <tr>
            <th>Archivo</th>
            <th>Existe</th>
            <th>Tamaño</th>
            <th>Última Modificación</th>
            <th>Hash MD5</th>
        </tr>
        <?php foreach ($files_info as $file => $info): ?>
        <tr>
            <td><?= htmlspecialchars($file) ?></td>
            <td class="<?= $info['exists'] ? 'status-ok' : 'status-error' ?>">
                <?= $info['exists'] ? 'Sí' : 'No' ?>
            </td>
            <?php if ($info['exists']): ?>
            <td><?= number_format($info['size']) ?> bytes</td>
            <td><?= $info['modified'] ?></td>
            <td><?= $info['md5'] ?></td>
            <?php else: ?>
            <td colspan="3" class="status-error"><?= $info['error'] ?></td>
            <?php endif; ?>
        </tr>
        <?php endforeach; ?>
    </table>
    
    <p>
        <strong>Nota:</strong> Para ver esta información en formato JSON, añade <code>?format=json</code> a la URL.
    </p>

    <script>
        // Función para comparar esta información con otra instalación
        function compareWithLocal() {
            // Solicitar la URL del servidor local
            const localUrl = prompt("Ingresa la URL de la versión local para comparar:", "http://localhost:5500/version-check.php?format=json");
            if (!localUrl) return;
            
            // Obtener datos del servidor actual
            fetch('?format=json')
                .then(response => response.json())
                .then(serverData => {
                    // Obtener datos del servidor local
                    fetch(localUrl)
                        .then(response => response.json())
                        .then(localData => {
                            // Comparar archivos
                            const differences = [];
                            
                            for (const file in serverData.files) {
                                if (localData.files[file]) {
                                    const serverFile = serverData.files[file];
                                    const localFile = localData.files[file];
                                    
                                    if (serverFile.exists && localFile.exists) {
                                        if (serverFile.md5 !== localFile.md5) {
                                            differences.push({
                                                file: file,
                                                server_modified: serverFile.modified,
                                                local_modified: localFile.modified,
                                                server_size: serverFile.size,
                                                local_size: localFile.size,
                                                needs_update: new Date(localFile.modified) > new Date(serverFile.modified)
                                            });
                                        }
                                    } else {
                                        differences.push({
                                            file: file,
                                            exists_on_server: serverFile.exists,
                                            exists_on_local: localFile.exists,
                                            needs_update: localFile.exists && !serverFile.exists
                                        });
                                    }
                                }
                            }
                            
                            // Mostrar resultados
                            showComparisonResults(differences);
                        })
                        .catch(error => {
                            alert("Error al obtener datos locales: " + error.message);
                        });
                })
                .catch(error => {
                    alert("Error al obtener datos del servidor: " + error.message);
                });
        }
        
        // Mostrar resultados de la comparación
        function showComparisonResults(differences) {
            // Crear ventana modal
            const modal = document.createElement('div');
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
            modal.style.display = 'flex';
            modal.style.justifyContent = 'center';
            modal.style.alignItems = 'center';
            modal.style.zIndex = '9999';
            
            // Contenido de la modal
            const content = document.createElement('div');
            content.style.backgroundColor = 'white';
            content.style.padding = '20px';
            content.style.borderRadius = '8px';
            content.style.maxWidth = '800px';
            content.style.maxHeight = '80vh';
            content.style.overflow = 'auto';
            
            // Título
            const title = document.createElement('h2');
            title.textContent = 'Comparación de Versiones';
            content.appendChild(title);
            
            // Resumen
            const summary = document.createElement('p');
            if (differences.length === 0) {
                summary.textContent = '¡Todos los archivos están sincronizados! No hay diferencias entre las versiones.';
                summary.style.color = 'green';
            } else {
                summary.textContent = `Se encontraron ${differences.length} archivo(s) diferentes entre las versiones.`;
                summary.style.color = 'red';
            }
            content.appendChild(summary);
            
            // Tabla de diferencias
            if (differences.length > 0) {
                const table = document.createElement('table');
                table.style.width = '100%';
                table.style.borderCollapse = 'collapse';
                
                // Encabezado
                const thead = document.createElement('thead');
                const headerRow = document.createElement('tr');
                
                const headers = ['Archivo', 'Estado', 'Modificado (Servidor)', 'Modificado (Local)', 'Acción'];
                headers.forEach(text => {
                    const th = document.createElement('th');
                    th.textContent = text;
                    headerRow.appendChild(th);
                });
                
                thead.appendChild(headerRow);
                table.appendChild(thead);
                
                // Cuerpo
                const tbody = document.createElement('tbody');
                
                differences.forEach(diff => {
                    const row = document.createElement('tr');
                    
                    // Archivo
                    const fileCell = document.createElement('td');
                    fileCell.textContent = diff.file;
                    row.appendChild(fileCell);
                    
                    // Estado
                    const statusCell = document.createElement('td');
                    if (diff.exists_on_server === false) {
                        statusCell.textContent = 'Falta en servidor';
                        statusCell.style.color = 'red';
                    } else if (diff.exists_on_local === false) {
                        statusCell.textContent = 'Falta en local';
                        statusCell.style.color = 'orange';
                    } else {
                        statusCell.textContent = 'Diferente';
                        statusCell.style.color = 'blue';
                    }
                    row.appendChild(statusCell);
                    
                    // Fecha servidor
                    const serverDateCell = document.createElement('td');
                    serverDateCell.textContent = diff.server_modified || 'N/A';
                    row.appendChild(serverDateCell);
                    
                    // Fecha local
                    const localDateCell = document.createElement('td');
                    localDateCell.textContent = diff.local_modified || 'N/A';
                    row.appendChild(localDateCell);
                    
                    // Acción recomendada
                    const actionCell = document.createElement('td');
                    if (diff.needs_update) {
                        actionCell.textContent = 'Actualizar servidor';
                        actionCell.style.fontWeight = 'bold';
                        actionCell.style.color = 'green';
                    } else if (diff.exists_on_server && !diff.exists_on_local) {
                        actionCell.textContent = 'Eliminar del servidor';
                        actionCell.style.color = 'red';
                    } else {
                        actionCell.textContent = 'Verificar manualmente';
                        actionCell.style.color = 'orange';
                    }
                    row.appendChild(actionCell);
                    
                    tbody.appendChild(row);
                });
                
                table.appendChild(tbody);
                content.appendChild(table);
            }
            
            // Botón cerrar
            const closeButton = document.createElement('button');
            closeButton.textContent = 'Cerrar';
            closeButton.style.padding = '10px 20px';
            closeButton.style.marginTop = '20px';
            closeButton.style.backgroundColor = '#4a6fa5';
            closeButton.style.color = 'white';
            closeButton.style.border = 'none';
            closeButton.style.borderRadius = '4px';
            closeButton.style.cursor = 'pointer';
            closeButton.onclick = function() {
                document.body.removeChild(modal);
            };
            content.appendChild(closeButton);
            
            modal.appendChild(content);
            document.body.appendChild(modal);
        }
    </script>
    
    <button onclick="compareWithLocal()" style="padding: 10px 20px; background-color: #4a6fa5; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 20px;">
        Comparar con Versión Local
    </button>
</body>
</html>
