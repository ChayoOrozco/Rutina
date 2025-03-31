// Shopping List Tracker
document.addEventListener('DOMContentLoaded', function() {
    initializeShoppingListTracker();
});

function initShoppingList() {
    // Inicializar lista de compras
    loadShoppingItems();
    setupEventListeners();
}

function initializeShoppingListTracker() {
    // Load saved shopping items from localStorage
    loadSavedShoppingItems();
    
    // Add event listeners to all shopping checkboxes
    const checkboxes = document.querySelectorAll('.shopping-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const itemId = this.getAttribute('data-item-id');
            const isChecked = this.checked;
            const item = this.closest('.shopping-item');
            
            // Update UI
            if (isChecked) {
                item.classList.add('checked');
            } else {
                item.classList.remove('checked');
            }
            
            // Save to localStorage
            saveShoppingItemStatus(itemId, isChecked);
        });
    });
}

function loadSavedShoppingItems() {
    // Get the current week number for storage
    const currentWeek = getWeekNumber(new Date());
    const weekKey = `week-${currentWeek}`;
    
    const checkboxes = document.querySelectorAll('.shopping-checkbox');
    checkboxes.forEach(checkbox => {
        const itemId = checkbox.getAttribute('data-item-id');
        const storedData = getShoppingItemData(weekKey, itemId);
        
        if (storedData && storedData.checked) {
            checkbox.checked = true;
            checkbox.closest('.shopping-item').classList.add('checked');
        }
    });
}

function saveShoppingItemStatus(itemId, isChecked) {
    // Get the current week number for storage
    const currentWeek = getWeekNumber(new Date());
    const weekKey = `week-${currentWeek}`;
    const timestamp = new Date().toISOString();
    
    // Get existing data or create new storage
    let shoppingData = JSON.parse(localStorage.getItem('rutina_shopping_data')) || {};
    
    // Create week entry if it doesn't exist
    if (!shoppingData[weekKey]) {
        shoppingData[weekKey] = {};
    }
    
    // Create or update item
    shoppingData[weekKey][itemId] = {
        checked: isChecked,
        timestamp: timestamp
    };
    
    // Save to localStorage
    localStorage.setItem('rutina_shopping_data', JSON.stringify(shoppingData));
}

function getShoppingItemData(weekKey, itemId) {
    const shoppingData = JSON.parse(localStorage.getItem('rutina_shopping_data')) || {};
    
    if (shoppingData[weekKey] && shoppingData[weekKey][itemId]) {
        return shoppingData[weekKey][itemId];
    }
    
    return null;
}

// Function to get the ISO week number of a date
function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// Function to reset shopping list
function resetShoppingList() {
    if (confirm('¿Estás seguro de que quieres resetear la lista de compras?')) {
        const currentWeek = getWeekNumber(new Date());
        const weekKey = `week-${currentWeek}`;
        
        // Get existing data
        let shoppingData = JSON.parse(localStorage.getItem('rutina_shopping_data')) || {};
        
        // Remove current week data
        if (shoppingData[weekKey]) {
            delete shoppingData[weekKey];
            localStorage.setItem('rutina_shopping_data', JSON.stringify(shoppingData));
        }
        
        // Reset UI
        const checkboxes = document.querySelectorAll('.shopping-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.closest('.shopping-item').classList.remove('checked');
        });
        
        alert('Lista de compras reiniciada para esta semana.');
    }
}

// Función para cargar los items guardados anteriormente
function loadShoppingItems() {
    const currentWeek = getWeekNumber(new Date());
    const weekKey = `week-${currentWeek}`;
    
    // Obtener datos guardados
    const shoppingData = JSON.parse(localStorage.getItem('rutina_shopping_items')) || {};
    
    // Obtener el estado de los checkboxes
    const checkboxData = JSON.parse(localStorage.getItem('rutina_shopping_data')) || {};
    
    // Limpiar listas primero
    document.querySelectorAll('.shopping-items').forEach(list => {
        list.innerHTML = '';
    });
    
    // Categorías predefinidas con items básicos
    const defaultItems = {
        'frutas-verduras': [
            'Manzanas', 'Plátanos', 'Brócoli', 'Zanahorias', 'Espinacas', 'Tomates'
        ],
        'proteinas': [
            'Pollo', 'Huevos', 'Atún', 'Legumbres', 'Tofu'
        ],
        'carbohidratos': [
            'Arroz integral', 'Pasta integral', 'Avena', 'Pan integral', 'Quinoa'
        ],
        'lacteos': [
            'Yogur', 'Leche', 'Queso'
        ],
        'limpieza': [
            'Detergente', 'Jabón de manos', 'Limpiador multiusos'
        ],
        'miscelaneos': [
            'Papel higiénico', 'Servilletas', 'Aceite de oliva'
        ]
    };
    
    // Cargar items guardados o predeterminados para cada categoría
    for (const category in defaultItems) {
        const categoryList = document.querySelector(`.shopping-items[data-category="${category}"]`);
        
        // Obtener items guardados o usar los predeterminados
        const items = (shoppingData[weekKey] && shoppingData[weekKey][category]) || defaultItems[category];
        
        // Añadir cada item a la lista
        items.forEach(item => {
            const itemId = `${category}-${item.replace(/\s+/g, '-').toLowerCase()}`;
            const isChecked = checkboxData[weekKey] && checkboxData[weekKey][itemId] && checkboxData[weekKey][itemId].checked;
            
            const li = document.createElement('li');
            li.className = 'shopping-item' + (isChecked ? ' checked' : '');
            li.innerHTML = `
                <div class="item-container">
                    <input type="checkbox" class="shopping-checkbox" data-item-id="${itemId}" ${isChecked ? 'checked' : ''}>
                    <span class="shopping-item-text">${item}</span>
                </div>
                <button class="remove-item-btn">×</button>
            `;
            categoryList.appendChild(li);
        });
    }
}

// Configurar eventos para la aplicación de lista de compras
function setupEventListeners() {
    // Eventos para checkboxes (delegación de eventos)
    document.addEventListener('change', function(e) {
        if (e.target && e.target.classList.contains('shopping-checkbox')) {
            const checkbox = e.target;
            const itemId = checkbox.getAttribute('data-item-id');
            const isChecked = checkbox.checked;
            const item = checkbox.closest('.shopping-item');
            
            // Actualizar UI
            if (isChecked) {
                item.classList.add('checked');
            } else {
                item.classList.remove('checked');
            }
            
            // Guardar en localStorage
            saveShoppingItemStatus(itemId, isChecked);
        }
    });
    
    // Evento para botón de añadir item
    const addItemBtns = document.querySelectorAll('.add-category-item-btn');
    addItemBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            const inputEl = this.previousElementSibling;
            const itemName = inputEl.value.trim();
            
            if (itemName) {
                addShoppingItem(category, itemName);
                inputEl.value = '';
            }
        });
    });
    
    // Evento para inputs (tecla Enter)
    const inputs = document.querySelectorAll('.category-item-input');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const category = this.nextElementSibling.dataset.category;
                const itemName = this.value.trim();
                
                if (itemName) {
                    addShoppingItem(category, itemName);
                    this.value = '';
                }
            }
        });
    });
    
    // Evento para botón de eliminar item (delegación de eventos)
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('remove-item-btn')) {
            const item = e.target.closest('.shopping-item');
            const category = item.closest('.shopping-items').dataset.category;
            const itemText = item.querySelector('.shopping-item-text').textContent;
            
            removeShoppingItem(category, itemText);
            item.remove();
        }
    });
    
    // Evento para botón de eliminar marcados
    const clearCheckedBtn = document.getElementById('clear-checked-btn');
    if (clearCheckedBtn) {
        clearCheckedBtn.addEventListener('click', function() {
            if (confirm('¿Eliminar todos los items marcados?')) {
                const checkedItems = document.querySelectorAll('.shopping-item.checked');
                checkedItems.forEach(item => {
                    const category = item.closest('.shopping-items').dataset.category;
                    const itemText = item.querySelector('.shopping-item-text').textContent;
                    
                    removeShoppingItem(category, itemText);
                    item.remove();
                });
            }
        });
    }
    
    // Evento para botón de eliminar todo
    const clearAllBtn = document.getElementById('clear-all-btn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que quieres eliminar toda la lista de compras?')) {
                resetShoppingList();
                loadShoppingItems(); // Recargar con items predeterminados
            }
        });
    }
}

// Añadir nuevo item a la lista de compras
function addShoppingItem(category, itemName) {
    const currentWeek = getWeekNumber(new Date());
    const weekKey = `week-${currentWeek}`;
    
    // Obtener datos guardados o crear nuevo almacenamiento
    let shoppingData = JSON.parse(localStorage.getItem('rutina_shopping_items')) || {};
    
    // Crear entrada para la semana si no existe
    if (!shoppingData[weekKey]) {
        shoppingData[weekKey] = {};
    }
    
    // Crear entrada para la categoría si no existe
    if (!shoppingData[weekKey][category]) {
        shoppingData[weekKey][category] = [];
    }
    
    // Añadir item si no existe ya
    if (!shoppingData[weekKey][category].includes(itemName)) {
        shoppingData[weekKey][category].push(itemName);
        
        // Guardar en localStorage
        localStorage.setItem('rutina_shopping_items', JSON.stringify(shoppingData));
        
        // Actualizar UI
        const categoryList = document.querySelector(`.shopping-items[data-category="${category}"]`);
        const itemId = `${category}-${itemName.replace(/\s+/g, '-').toLowerCase()}`;
        
        const li = document.createElement('li');
        li.className = 'shopping-item';
        li.innerHTML = `
            <div class="item-container">
                <input type="checkbox" class="shopping-checkbox" data-item-id="${itemId}">
                <span class="shopping-item-text">${itemName}</span>
            </div>
            <button class="remove-item-btn">×</button>
        `;
        categoryList.appendChild(li);
    }
}

// Eliminar item de la lista de compras
function removeShoppingItem(category, itemName) {
    const currentWeek = getWeekNumber(new Date());
    const weekKey = `week-${currentWeek}`;
    
    // Obtener datos guardados
    let shoppingData = JSON.parse(localStorage.getItem('rutina_shopping_items')) || {};
    
    // Eliminar item si existe
    if (shoppingData[weekKey] && shoppingData[weekKey][category]) {
        const index = shoppingData[weekKey][category].indexOf(itemName);
        if (index !== -1) {
            shoppingData[weekKey][category].splice(index, 1);
            localStorage.setItem('rutina_shopping_items', JSON.stringify(shoppingData));
        }
    }
    
    // Eliminar también el estado del checkbox
    const itemId = `${category}-${itemName.replace(/\s+/g, '-').toLowerCase()}`;
    let checkboxData = JSON.parse(localStorage.getItem('rutina_shopping_data')) || {};
    
    if (checkboxData[weekKey] && checkboxData[weekKey][itemId]) {
        delete checkboxData[weekKey][itemId];
        localStorage.setItem('rutina_shopping_data', JSON.stringify(checkboxData));
    }
}