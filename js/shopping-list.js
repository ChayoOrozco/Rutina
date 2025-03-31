// Shopping List Tracker
document.addEventListener('DOMContentLoaded', function() {
    initializeShoppingListTracker();
});

function initializeShoppingListTracker() {
    // Load saved shopping items from localStorage
    loadSavedShoppingItems();
    
    // Add event listeners to all shopping checkboxes
    const checkboxes = document.querySelectorAll('.shopping-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const itemId = this.dataset.itemId;
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
        const itemId = checkbox.dataset.itemId;
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