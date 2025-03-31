/**
 * Script para manejar la navegación en la página de inicio
 * Sin depender de la estructura de las páginas de días
 */

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario ha iniciado sesión
    if (typeof UsersDB !== 'undefined' && !UsersDB.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    // Generar barras de navegación
    generateNavigation();
    
    // Actualizar UI según el usuario
    updateUI();
});

/**
 * Genera las barras de navegación para la página de inicio
 */
function generateNavigation() {
    // Actualizar barra de días
    const navDays = document.getElementById('nav-days');
    if (navDays) {
        let navDaysContent = '';
        
        // Días de la semana
        AppConfig.navigation.daysOfWeek.forEach(day => {
            navDaysContent += `<a href="dias/${day.path}" class="day-link">${day.name}</a>`;
        });
        
        // Actualizar contenido
        navDays.innerHTML = navDaysContent;
    }
    
    // Actualizar barra de herramientas
    const navTools = document.getElementById('nav-tools');
    if (navTools) {
        let navToolsContent = '';
        
        // Herramientas principales
        AppConfig.navigation.tools.forEach(tool => {
            navToolsContent += `<a href="dias/${tool.path}" class="icon-link" title="${tool.name}">
                                <i class="${tool.icon}"></i>
                              </a>`;
        });
        
        // Configuración de seguridad
        navToolsContent += `<a href="configuracion-seguridad.html" class="icon-link" title="Configuración de Seguridad">
                            <i class="fas fa-user-shield"></i>
                          </a>`;
        
        // Botón de cerrar sesión
        navToolsContent += `<a href="#" id="authLink" class="icon-link auth-link" title="Cerrar Sesión">
                            <i class="fas fa-sign-out-alt"></i>
                          </a>`;
        
        // Actualizar contenido
        navTools.innerHTML = navToolsContent;
        
        // Agregar manejador para cerrar sesión
        const authLink = document.getElementById('authLink');
        if (authLink) {
            authLink.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (typeof UsersDB !== 'undefined' && UsersDB.isAuthenticated()) {
                    // Cerrar sesión
                    UsersDB.logout();
                    alert('Has cerrado sesión exitosamente.');
                    window.location.href = 'login.html';
                } else {
                    window.location.href = 'login.html';
                }
            });
        }
    }
}

/**
 * Actualiza la interfaz según el usuario actual
 */
function updateUI() {
    // Verificar si existe el objeto UsersDB
    if (typeof UsersDB === 'undefined') return;
    
    const currentUser = UsersDB.getCurrentUser();
    if (!currentUser) return;
    
    // Actualizar mensaje de bienvenida
    const welcomeMessage = document.querySelector('.bienvenida h2');
    if (welcomeMessage) {
        welcomeMessage.textContent = `¡Bienvenido/a ${currentUser.displayName} a la Rutina Familiar!`;
    }
    
    // Actualizar botón de autenticación
    const authLink = document.getElementById('authLink');
    if (authLink) {
        authLink.title = `Cerrar Sesión (${currentUser.displayName})`;
    }
}
