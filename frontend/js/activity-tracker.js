// Activity Tracker
document.addEventListener('DOMContentLoaded', function() {
    initializeActivityTracker();
});

function initializeActivityTracker() {
    // Load saved activities from localStorage
    loadSavedActivities();
    
    // Add event listeners to all checkboxes
    const checkboxes = document.querySelectorAll('.activity-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const activityId = this.dataset.activityId;
            const isCompleted = this.checked;
            const activity = this.closest('.activity');
            
            // Update UI
            if (isCompleted) {
                activity.classList.add('completed');
            } else {
                activity.classList.remove('completed');
            }
            
            // Save to localStorage
            saveActivityStatus(activityId, isCompleted);
        });
    });
}

function loadSavedActivities() {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const currentPage = getCurrentPage();
    
    const checkboxes = document.querySelectorAll('.activity-checkbox');
    
    // Primero, verificar si hay datos guardados en localStorage (para compatibilidad)
    checkboxes.forEach(checkbox => {
        const activityId = checkbox.dataset.activityId;
        const storedData = getActivityData(today, activityId);
        
        if (storedData && storedData.completed) {
            checkbox.checked = true;
            checkbox.closest('.activity').classList.add('completed');
        }
    });
    
    // Luego, intentar cargar datos desde el backend
    ApiClient.getActivitiesByDate(today)
        .then(result => {
            if (result.success && result.activities && result.activities.length > 0) {
                // Crear un mapa para acceder rápidamente a las actividades por su ID
                const activitiesMap = {};
                result.activities.forEach(activity => {
                    activitiesMap[activity.activity_id] = activity;
                });
                
                // Actualizar checkboxes según los datos del backend
                checkboxes.forEach(checkbox => {
                    const activityId = checkbox.dataset.activityId;
                    if (activitiesMap[activityId] && activitiesMap[activityId].completed) {
                        checkbox.checked = true;
                        checkbox.closest('.activity').classList.add('completed');
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error al cargar actividades desde el backend:', error);
        });
}

function saveActivityStatus(activityId, isCompleted) {
    const timestamp = new Date().toISOString();
    const currentPage = getCurrentPage();
    
    // Guardar en el backend usando ApiClient
    ApiClient.saveActivity(activityId, isCompleted, currentPage)
        .catch(error => {
            console.error('Error al guardar actividad en el backend:', error);
        });
}

function getActivityData(date, activityId) {
    // Primero intentamos obtener los datos del localStorage para compatibilidad
    const trackingData = JSON.parse(localStorage.getItem('rutina_tracking_data')) || {};
    
    if (trackingData[date] && trackingData[date][activityId]) {
        return trackingData[date][activityId];
    }
    
    return null; // Se intentará obtener del backend al cargar las actividades
}

function getCurrentPage() {
    // Extract the current day from URL or page identifier
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1).replace('.html', '');
    return page || 'index';
}

// Function to get activity statistics for a given day
async function getDayStats(day) {
    try {
        // Intentar obtener estadísticas desde el backend
        const result = await ApiClient.getDayStats(day);
        if (result.success && result.stats) {
            return result.stats;
        }
    } catch (error) {
        console.error('Error al obtener estadísticas del día desde el backend:', error);
        // Si falla, caemos al método de fallback a continuación
    }
    
    // Fallback: obtener estadísticas de localStorage
    console.warn('Usando localStorage como fallback para estadísticas del día');
    
    const trackingData = JSON.parse(localStorage.getItem('rutina_tracking_data')) || {};
    const stats = {
        total: 0,
        completed: 0,
        completionRate: 0,
        isra: {
            total: 0,
            completed: 0,
            completionRate: 0
        },
        chayo: {
            total: 0,
            completed: 0,
            completionRate: 0
        },
        ambos: {
            total: 0,
            completed: 0,
            completionRate: 0
        }
    };
    
    // Find all checkboxes for the specified day if we're on that page
    const checkboxSelector = `.activity-checkbox[data-activity-id^="${day}-"]`;
    let checkboxes = [];
    
    // Check if we're on the page for the day we're calculating stats for
    if (getCurrentPage() === day) {
        // We're on the right page, get checkboxes directly
        checkboxes = document.querySelectorAll(checkboxSelector);
        
        // Count activities for each person from checkboxes on the page
        checkboxes.forEach(checkbox => {
            const activityId = checkbox.dataset.activityId;
            // Parse person from activityId (format: day-person-activity)
            const idParts = activityId.split('-');
            if (idParts.length >= 2) {
                const person = idParts[1]; // isra, chayo, or ambos
                
                if (person === 'isra' || person === 'chayo' || person === 'ambos') {
                    stats[person].total++;
                    stats.total++;
                    
                    if (checkbox.checked) {
                        stats[person].completed++;
                        stats.completed++;
                    }
                }
            }
        });
    }
    
    // Look at all dates in localStorage, not just today
    const dates = Object.keys(trackingData);
    for (const date of dates) {
        // Find all activities for this day
        Object.keys(trackingData[date]).forEach(activityId => {
            if (activityId.startsWith(`${day}-`)) {
                const idParts = activityId.split('-');
                if (idParts.length >= 2) {
                    const person = idParts[1]; // isra, chayo, or ambos
                    
                    // Only count if we didn't already count from the DOM
                    if (getCurrentPage() !== day) {
                        stats.total++;
                        
                        if (person === 'isra' || person === 'chayo' || person === 'ambos') {
                            stats[person].total++;
                        }
                    }
                    
                    if (trackingData[date][activityId].completed) {
                        // Always count completions from localStorage
                        if (getCurrentPage() !== day || !document.querySelector(`.activity-checkbox[data-activity-id="${activityId}"]`)) {
                            stats.completed++;
                            
                            if (person === 'isra' || person === 'chayo' || person === 'ambos') {
                                stats[person].completed++;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Calculate completion rates
    if (stats.total > 0) {
        stats.completionRate = (stats.completed / stats.total) * 100;
    }
    
    if (stats.isra.total > 0) {
        stats.isra.completionRate = (stats.isra.completed / stats.isra.total) * 100;
    }
    
    if (stats.chayo.total > 0) {
        stats.chayo.completionRate = (stats.chayo.completed / stats.chayo.total) * 100;
    }
    
    if (stats.ambos.total > 0) {
        stats.ambos.completionRate = (stats.ambos.completed / stats.ambos.total) * 100;
    }
    
    return stats;
}

// Function to get weekly stats
async function getWeeklyStats() {
    try {
        // Intentar obtener estadísticas desde el backend
        const result = await ApiClient.getWeeklyStats();
        if (result.success && result.stats) {
            return result.stats;
        }
    } catch (error) {
        console.error('Error al obtener estadísticas semanales desde el backend:', error);
        // Si falla, caemos al método de fallback a continuación
    }
    
    // Fallback: obtener estadísticas de localStorage
    console.warn('Usando localStorage como fallback para estadísticas semanales');
    
    const trackingData = JSON.parse(localStorage.getItem('rutina_tracking_data')) || {};
    const weeklyData = {};
    const today = new Date();
    const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    
    // Go back 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().slice(0, 10);
        
        let dailyCompleted = 0;
        let dailyTotal = 0;
        
        // Get today's tracking data
        if (trackingData[dateStr]) {
            // Count activities for each day
            for (const day of days) {
                // Look for activities for this specific day (e.g., "lunes-*")
                Object.keys(trackingData[dateStr]).forEach(activityId => {
                    if (activityId.startsWith(`${day}-`)) {
                        dailyTotal++;
                        if (trackingData[dateStr][activityId].completed) {
                            dailyCompleted++;
                        }
                    }
                });
            }
        }
        
        weeklyData[dateStr] = {
            date: dateStr,
            completed: dailyCompleted,
            total: dailyTotal,
            completionRate: dailyTotal > 0 ? (dailyCompleted / dailyTotal) * 100 : 0
        };
    }
    
    return weeklyData;
}

// Function to reset all data
function resetAllData() {
    if (confirm('¿Estás seguro de que quieres borrar todos los datos de seguimiento? Esta acción no se puede deshacer.')) {
        localStorage.removeItem('rutina_tracking_data');
        alert('Todos los datos han sido borrados. La página se recargará.');
        window.location.reload();
    }
}

// Function to export data as JSON file
function exportData() {
    const trackingData = JSON.parse(localStorage.getItem('rutina_tracking_data')) || {};
    const dataStr = JSON.stringify(trackingData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'rutina_data_' + new Date().toISOString().slice(0, 10) + '.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Function to import data from JSON file
function importData(fileInput) {
    const file = fileInput.files[0];
    if (!file) {
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            localStorage.setItem('rutina_tracking_data', JSON.stringify(data));
            alert('Datos importados correctamente. La página se recargará.');
            window.location.reload();
        } catch (error) {
            alert('Error al importar datos: ' + error.message);
        }
    };
    reader.readAsText(file);
}
