/**
 * Archivo de configuración central para la aplicación Rutina Familiar
 * Contiene variables y ajustes que pueden modificarse desde un solo lugar
 */

const AppConfig = {
    // Información de la aplicación
    appTitle: "Rutina de Chayo",
    appSubtitle: "Plan personalizado para TDAH y TCA",
    
    /* Configuración original - comentado para referencia futura
    appTitle: "Rutina Familiar de Chayo e Isra",
    appSubtitle: "Plan personalizado para TDAH, TCA, TEA y Depresión Clínica",
    */
    
    // Nombres de los miembros de la familia
    familyMembers: {
        member1: {
            id: "chayo",
            displayName: "Chayo",
            color: "#e6f7ff"
        },
        /* Miembro comentado para referencia futura
        member2: {
            id: "isra",
            displayName: "Isra",
            color: "#e6ffe6"
        },
        */
        both: {
            id: "ambos",
            displayName: "Ambos",
            color: "#fff0e6"
        }
    },
    
    /* Configuración original completa - comentada para referencia futura
    familyMembers: {
        member1: {
            id: "chayo",
            displayName: "Chayo",
            color: "#e6f7ff"
        },
        member2: {
            id: "isra",
            displayName: "Isra",
            color: "#e6ffe6"
        },
        both: {
            id: "ambos",
            displayName: "Ambos",
            color: "#fff0e6"
        }
    },
    */
    
    // Configuración de navegación
    navigation: {
        daysOfWeek: [
            { id: "lunes", name: "Lunes", path: "lunes.html" },
            { id: "martes", name: "Martes", path: "martes.html" },
            { id: "miercoles", name: "Miércoles", path: "miercoles.html" },
            { id: "jueves", name: "Jueves", path: "jueves.html" },
            { id: "viernes", name: "Viernes", path: "viernes.html" },
            { id: "sabado", name: "Sábado", path: "sabado.html" },
            { id: "domingo", name: "Domingo", path: "domingo.html" }
        ],
        tools: [
            { id: "estrategias", name: "Estrategias", path: "estrategias.html", icon: "fas fa-brain" },
            { id: "limpieza", name: "Limpieza", path: "limpieza.html", icon: "fas fa-broom" },
            { id: "dieta", name: "Transición Dieta", path: "dieta.html", icon: "fas fa-utensils" },
            { id: "estadisticas", name: "Estadísticas", path: "estadisticas.html", icon: "fas fa-chart-bar" }
        ]
    },
    
    // Versión de la aplicación
    version: "1.0.0"
};

/**
 * Función para aplicar la configuración general a la página actual
 */
function applyAppConfig() {
    document.addEventListener('DOMContentLoaded', function() {
        // Actualizar título de la página
        document.title = document.title.replace("Nuestra Rutina Semanal", AppConfig.appTitle);
        
        // Actualizar encabezado principal
        const headerTitle = document.querySelector('header h1');
        if (headerTitle) {
            headerTitle.textContent = AppConfig.appTitle;
        }
        
        // Actualizar subtítulo
        const headerSubtitle = document.querySelector('header p');
        if (headerSubtitle) {
            headerSubtitle.textContent = AppConfig.appSubtitle;
        }
    });
}

// Aplicar configuración automáticamente
applyAppConfig();
