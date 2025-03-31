/**
 * Script para manejar la barra de navegación con iconos
 * Rutina Familiar de Chayo e Isra - Aplicación para usuarios con TDAH, TCA, TEA y Depresión Clínica
 */

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario ha iniciado sesión
    if (!UsersDB.isAuthenticated()) {
        // Determinar la ruta correcta de redireccionamiento basada en la URL actual
        const currentPath = window.location.pathname;
        const isInDiasFolder = currentPath.includes('/dias/');
        const loginPath = isInDiasFolder ? '../login.html' : 'login.html';
        
        window.location.href = loginPath;
        return;
    }
    
    updateAuthUI();
    
    // Reemplazar la navegación existente con la versión actualizada
    updateNavigation();
});

/**
 * Actualiza la barra de navegación, dividiendo en barras de días e iconos funcionales
 */
function updateNavigation() {
    // Obtener la página actual y la ruta base
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop();
    const isInDiasFolder = currentPath.includes('/dias/');
    
    // Determinar rutas relativas para enlaces
    const basePath = isInDiasFolder ? '' : 'dias/';
    const parentPath = isInDiasFolder ? '../' : '';
    
    // PARTE 1: BARRA DE NAVEGACIÓN PARA DÍAS
    const navDays = document.getElementById('nav-days');
    if (navDays) {
        // Crear nueva estructura de navegación para los días
        let navDaysContent = '';
        
        // Días de la semana - se mantienen como texto
        AppConfig.navigation.daysOfWeek.forEach(day => {
            navDaysContent += `<a href="${basePath}${day.path}" class="day-link ${currentPage === day.path ? 'active' : ''}">${day.name}</a>`;
        });
        
        // Establecer el contenido de la barra de días
        navDays.innerHTML = navDaysContent;
    }
    
    // PARTE 2: BARRA DE NAVEGACIÓN PARA ICONOS FUNCIONALES
    // Buscar o crear la barra de herramientas
    let navTools = document.getElementById('nav-tools');
    
    // Si no existe, crearla después de navDays
    if (!navTools && navDays) {
        navTools = document.createElement('nav');
        navTools.id = 'nav-tools';
        navDays.after(navTools);
    }
    
    if (navTools) {
        // Obtener información del usuario actual
        const currentUser = UsersDB.getCurrentUser();
        const userName = currentUser ? currentUser.displayName : '';
        
        // Crear contenido para la barra de iconos funcionales
        let navToolsContent = '';
        
        // Estrategias - con icono
        AppConfig.navigation.tools.forEach(tool => {
            navToolsContent += `<a href="${basePath}${tool.path}" class="icon-link ${currentPage === tool.path ? 'active' : ''}" title="${tool.name}">
                                <i class="${tool.icon}"></i>
                              </a>`;
        });
        
        // Configuración de seguridad - con icono y siempre visible
        navToolsContent += `<a href="${parentPath}configuracion-seguridad.html" class="icon-link" title="Configuración de Seguridad">
                            <i class="fas fa-user-shield"></i>
                          </a>`;
        
        // Cerrar sesión - con icono y siempre visible
        navToolsContent += `<a href="#" id="authLink" class="icon-link auth-link" title="${userName ? 'Cerrar sesión: ' + userName : 'Iniciar Sesión'}">
                            <i class="fas fa-sign-out-alt"></i>
                          </a>`;
        
        // Establecer el contenido de la barra de herramientas
        navTools.innerHTML = navToolsContent;
        
        // Agregar manejador de evento para el enlace de autenticación
        document.getElementById('authLink').addEventListener('click', function(e) {
            e.preventDefault();
            
            if (UsersDB.isAuthenticated()) {
                // Cerrar sesión
                UsersDB.logout();
                alert('Has cerrado sesión exitosamente.');
                // Redirigir a la página de login después de cerrar sesión
                window.location.href = parentPath + 'login.html';
            } else {
                // Redirigir a la página de inicio de sesión
                window.location.href = parentPath + 'login.html';
            }
        });
    }
}

/**
 * Actualiza la UI basada en el estado de autenticación
 */
function updateAuthUI() {
    const authLink = document.getElementById('authLink');
    if (!authLink) return;
    
    const currentUser = UsersDB.getCurrentUser();
    
    if (currentUser) {
        // Icono para cerrar sesión y título con nombre de usuario
        authLink.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
        authLink.title = `Cerrar Sesión (${currentUser.displayName})`;
    } else {
        // Icono para iniciar sesión
        authLink.innerHTML = '<i class="fas fa-sign-in-alt"></i>';
        authLink.title = 'Iniciar Sesión';
    }
}