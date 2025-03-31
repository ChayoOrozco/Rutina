/**
 * Gestor de rutinas diarias
 * Permite cargar y actualizar contenidos de rutina dinámicamente
 */

const RoutineManager = {
    // Almacén de rutinas por día
    routines: {},
    
    // Configuración del API
    apiEndpoints: {
        save: '../api/save-routine.php',
        get: '../api/get-routine.php'
    },
    
    /**
     * Inicializar el gestor de rutinas
     */
    init: function() {
        // Cargar rutinas desde localStorage si existen
        const savedRoutines = localStorage.getItem('rutina_content');
        if (savedRoutines) {
            this.routines = JSON.parse(savedRoutines);
        }
        
        // Determinar si estamos en una página de día
        const currentPage = window.location.pathname.split('/').pop();
        const dayMatch = currentPage.match(/^(lunes|martes|miercoles|jueves|viernes|sabado|domingo)\.html$/);
        
        if (dayMatch) {
            const currentDay = dayMatch[1];
            
            // Cargar rutina desde el servidor
            this.loadRoutineFromServer(currentDay, (data) => {
                if (data && data.success && data.content) {
                    // Si hay rutina en el servidor, actualizar localStorage
                    if (!this.routines[currentDay]) {
                        this.routines[currentDay] = {};
                    }
                    this.routines[currentDay].content = data.content;
                    this.saveRoutines();
                    
                    // Actualizar la UI
                    const scheduleCard = document.querySelector('.schedule-card');
                    if (scheduleCard) {
                        scheduleCard.innerHTML = data.content;
                        // Reinicializar rastreador de actividades
                        if (typeof initializeActivityTracker === 'function') {
                            initializeActivityTracker();
                        }
                    }
                }
            });
            
            // Agregar botón de edición
            this.addEditButton();
        }
    },
    
    /**
     * Guardar todas las rutinas en localStorage
     */
    saveRoutines: function() {
        localStorage.setItem('rutina_content', JSON.stringify(this.routines));
    },
    
    /**
     * Guardar rutina en el servidor
     * @param {string} day - Día de la semana
     * @param {object} data - Datos de la rutina
     * @param {Function} callback - Función a ejecutar después de guardar
     */
    saveRoutineToServer: function(day, data, callback) {
        // Obtener ID de usuario actual
        const userId = this.getCurrentUserId();
        if (!userId) {
            console.error('No se puede guardar la rutina: Usuario no identificado');
            return;
        }
        
        // Preparar datos para enviar
        const postData = {
            userId: userId,
            day: day,
            content: data.content
        };
        
        // Enviar al servidor
        fetch(this.apiEndpoints.save, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(result => {
            console.log('Rutina guardada en servidor:', result);
            if (callback) callback(result);
        })
        .catch(error => {
            console.error('Error guardando rutina en servidor:', error);
            if (callback) callback(null, error);
        });
    },
    
    /**
     * Cargar rutina desde el servidor
     * @param {string} day - Día de la semana
     * @param {Function} callback - Función a ejecutar después de cargar
     */
    loadRoutineFromServer: function(day, callback) {
        // Obtener ID de usuario actual
        const userId = this.getCurrentUserId();
        if (!userId) {
            console.error('No se puede cargar la rutina: Usuario no identificado');
            if (callback) callback(null);
            return;
        }
        
        // Construir URL
        const url = `${this.apiEndpoints.get}?userId=${userId}&day=${day}`;
        
        // Solicitar datos al servidor
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (callback) callback(data);
            })
            .catch(error => {
                console.error('Error cargando rutina desde servidor:', error);
                if (callback) callback(null, error);
            });
    },
    
    /**
     * Obtener ID del usuario actual
     * @returns {string|null} ID del usuario o null si no hay usuario
     */
    getCurrentUserId: function() {
        // Usar el nombre de usuario como ID
        if (typeof UsersDB !== 'undefined' && UsersDB.getCurrentUser) {
            const user = UsersDB.getCurrentUser();
            return user ? user.username : null;
        }
        return null;
    },
    
    /**
     * Cargar rutina para un día específico
     * @param {string} day - Día de la semana (lunes, martes, etc.)
     * @param {Function} callback - Función a ejecutar después de cargar
     */
    loadRoutine: function(day, callback) {
        // Si no hay rutina personalizada, se usa el contenido HTML original
        if (!this.routines[day]) {
            if (callback) callback(null);
            return;
        }
        
        const routine = this.routines[day];
        
        // Reemplazar el contenido de la página con la rutina guardada
        const scheduleCard = document.querySelector('.schedule-card');
        if (scheduleCard && routine.content) {
            scheduleCard.innerHTML = routine.content;
            
            // Reinicializar rastreador de actividades
            if (typeof initializeActivityTracker === 'function') {
                initializeActivityTracker();
            }
            
            if (callback) callback(routine);
        }
    },
    
    /**
     * Guardar rutina actual
     * @param {string} day - Día de la semana
     * @param {object} data - Datos de la rutina
     */
    saveRoutine: function(day, data) {
        if (!this.routines[day]) {
            this.routines[day] = {};
        }
        
        // Fusionar datos nuevos con existentes
        Object.assign(this.routines[day], data);
        
        // Guardar en localStorage
        this.saveRoutines();
        
        // Guardar en el servidor
        this.saveRoutineToServer(day, data, (result, error) => {
            if (error) {
                console.error('Error al guardar en servidor. Guardado solo localmente:', error);
                alert('Los cambios se guardaron localmente, pero hubo un problema al sincronizar con el servidor.');
            }
        });
    },
    
    /**
     * Agregar botón de edición a la página del día
     */
    addEditButton: function() {
        // Verificar si estamos en una página de día
        const currentPage = window.location.pathname.split('/').pop();
        const dayMatch = currentPage.match(/^(lunes|martes|miercoles|jueves|viernes|sabado|domingo)\.html$/);
        
        if (!dayMatch) return;
        
        const currentDay = dayMatch[1];
        
        // Crear y agregar el botón de edición
        const editButton = document.createElement('button');
        editButton.className = 'btn edit-routine-btn';
        editButton.innerHTML = '<i class="fas fa-edit"></i> Editar Rutina';
        editButton.style.position = 'absolute';
        editButton.style.top = '10px';
        editButton.style.right = '20px';
        editButton.style.zIndex = '1001';
        
        // Manejador de clic
        editButton.addEventListener('click', () => {
            this.openRoutineEditor(currentDay);
        });
        
        // Agregar botón al body cuando el DOM esté listo
        document.addEventListener('DOMContentLoaded', function() {
            document.body.appendChild(editButton);
            
            // Cargar rutina personalizada si existe
            RoutineManager.loadRoutine(currentDay);
        });
    },
    
    /**
     * Abrir editor de rutinas
     * @param {string} day - Día a editar
     */
    openRoutineEditor: function(day) {
        // Capturar contenido actual
        const scheduleCard = document.querySelector('.schedule-card');
        if (!scheduleCard) return;
        
        const currentContent = scheduleCard.innerHTML;
        
        // Crear modal de edición
        const modal = document.createElement('div');
        modal.className = 'routine-editor-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
        modal.style.zIndex = '2000';
        modal.style.display = 'flex';
        modal.style.flexDirection = 'column';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.padding = '20px';
        
        // Crear contenido del modal
        modal.innerHTML = `
            <div style="background: white; width: 90%; max-width: 1000px; height: 80%; display: flex; flex-direction: column; border-radius: 8px; overflow: hidden;">
                <div style="padding: 15px; background: #4a6fa5; color: white; display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0;">Editar Rutina de ${day.charAt(0).toUpperCase() + day.slice(1)}</h3>
                    <button id="closeEditorBtn" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;">×</button>
                </div>
                <div style="flex-grow: 1; padding: 15px; overflow: auto;">
                    <textarea id="routineContentEditor" style="width: 100%; height: 100%; font-family: monospace; padding: 10px; border: 1px solid #ccc; resize: none;">${currentContent}</textarea>
                </div>
                <div style="padding: 15px; border-top: 1px solid #eee; display: flex; justify-content: flex-end; gap: 10px;">
                    <button id="resetRoutineBtn" style="padding: 8px 15px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">Restaurar Original</button>
                    <button id="saveRoutineBtn" style="padding: 8px 15px; background: #4a6fa5; color: white; border: none; border-radius: 4px; cursor: pointer;">Guardar Cambios</button>
                </div>
            </div>
        `;
        
        // Agregar modal al body
        document.body.appendChild(modal);
        
        // Configurar manejadores de eventos
        document.getElementById('closeEditorBtn').addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        document.getElementById('saveRoutineBtn').addEventListener('click', () => {
            const content = document.getElementById('routineContentEditor').value;
            
            // Guardar contenido editado
            this.saveRoutine(day, { content });
            
            // Actualizar la página
            scheduleCard.innerHTML = content;
            
            // Reinicializar rastreador de actividades
            if (typeof initializeActivityTracker === 'function') {
                initializeActivityTracker();
            }
            
            // Cerrar modal
            document.body.removeChild(modal);
        });
        
        document.getElementById('resetRoutineBtn').addEventListener('click', () => {
            if (confirm('¿Estás seguro? Esto restaurará la versión original de la rutina y perderás tus cambios.')) {
                // Eliminar rutina personalizada
                if (this.routines[day]) {
                    delete this.routines[day].content;
                    this.saveRoutines();
                }
                
                // Enviar versión vacía al servidor para resetear
                this.saveRoutineToServer(day, { content: '' }, () => {
                    // Recargar página para mostrar contenido original
                    location.reload();
                });
            }
        });
    }
};

// Inicializar el gestor de rutinas
RoutineManager.init();
