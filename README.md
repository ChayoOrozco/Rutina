# Rutina Familiar de Chayo e Isra

Aplicación web para gestionar la rutina familiar personalizada para TDAH, TCA, TEA y Depresión Clínica.

## Información sobre versiones y sincronización

Este proyecto se puede ejecutar localmente y en un servidor. Para evitar problemas con las versiones, sigue estas instrucciones:

### Verificar versiones

1. Coloca el archivo `version-check.php` tanto en tu entorno local como en el servidor
2. Accede a este archivo desde tu navegador:
   - Local: http://localhost:5500/version-check.php
   - Servidor: http://192.168.200.124:8080/index.html/version-check.php
3. Usa el botón "Comparar con Versión Local" para verificar qué archivos están desactualizados

### Sincronizar con el servidor

Para sincronizar tu versión local con el servidor, puedes usar el script `sync-to-server.bat`:

1. Edita primero el archivo configurando las variables según tu entorno de servidor
2. Ejecuta el script haciendo doble clic en él
3. Selecciona qué archivos quieres sincronizar

Alternativamente, puedes copiar manualmente los archivos al servidor usando FTP u otro método.

### Estructura de archivos

```
Rutina/
├── dias/                     # Páginas de días de la semana
│   ├── lunes.html
│   ├── martes.html 
│   └── ...
├── js/                       # Scripts JavaScript
│   ├── config.js             # Configuración centralizada
│   ├── users-db.js           # Gestión de usuarios
│   ├── nav-icons.js          # Navegación para páginas de días
│   ├── index-nav.js          # Navegación para página principal
│   └── routine-manager.js    # Gestión de rutinas personalizadas
├── api/                      # API para comunicación con base de datos
│   ├── save-routine.php      # Guardar rutinas en la BD
│   └── get-routine.php       # Obtener rutinas de la BD
├── estilos.css               # Estilos globales
├── index.html                # Página principal
├── login.html                # Página de inicio de sesión
├── registro.html             # Página de registro
├── recuperar-password.html   # Página de recuperación de contraseña
└── configuracion-seguridad.html  # Página de configuración de seguridad
```

## Archivos de mantenimiento

- `version-check.php`: Verifica diferencias entre entornos
- `sync-to-server.bat`: Facilita la sincronización con el servidor
- `README.md`: Esta documentación

## Base de datos

La aplicación utiliza MySQL para almacenar:
1. Usuarios y credenciales
2. Rutinas personalizadas

### Estructura de base de datos

Para las rutinas, se utiliza la siguiente tabla:

```sql
CREATE TABLE IF NOT EXISTS `routines` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `day` varchar(20) NOT NULL,
  `content` text NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_day_idx` (`user_id`,`day`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Contribución

Para mantener la coherencia del proyecto:

1. Desarrolla primero en tu entorno local
2. Prueba todos los cambios localmente
3. Sincroniza con el servidor
4. Verifica que todo funcione correctamente en el servidor
5. Si hay algún problema, utiliza `version-check.php` para identificar diferencias
