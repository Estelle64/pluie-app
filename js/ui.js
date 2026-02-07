/**
 * ui.js
 * Gestion de l'interface utilisateur
 */

/**
 * Afficher la date actuelle
 */
function updateCurrentDate() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateElement = document.getElementById('currentDate');
    
    if (dateElement) {
        dateElement.textContent = today.toLocaleDateString('fr-FR', options);
    }
}

/**
 * Mettre à jour les statistiques affichées
 */
function updateStats() {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    
    // Aujourd'hui
    const todayValue = getRainfallForDate(today);
    const todayElement = document.getElementById('todayValue');
    if (todayElement) {
        todayElement.textContent = todayValue.toFixed(1);
    }

    // Total du mois
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthTotal = getTotalForPeriod(monthStart, now);
    const monthElement = document.getElementById('monthTotal');
    if (monthElement) {
        monthElement.textContent = monthTotal.toFixed(1);
    }

    // Total de l'année
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearTotal = getTotalForPeriod(yearStart, now);
    const yearElement = document.getElementById('yearTotal');
    if (yearElement) {
        yearElement.textContent = yearTotal.toFixed(1);
    }
}

/**
 * Mettre à jour l'historique des entrées
 */
function updateHistory() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    const sortedDates = getAllDates(false); // false = ordre décroissant

    if (sortedDates.length === 0) {
        historyList.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                </svg>
                <p>Aucune donnée enregistrée pour le moment</p>
            </div>
        `;
        return;
    }

    // Afficher les 50 dernières entrées
    historyList.innerHTML = sortedDates.slice(0, 50).map(date => {
        const dateObj = new Date(date);
        const formatted = dateObj.toLocaleDateString('fr-FR', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
        
        const value = getRainfallForDate(date);
        
        return `
            <div class="history-item">
                <span class="history-date">${formatted}</span>
                <span class="history-value">${value.toFixed(1)} mm</span>
            </div>
        `;
    }).join('');
}

/**
 * Enregistrer une nouvelle mesure de pluie
 */
function saveRainfall() {
    const input = document.getElementById('rainfallInput');
    if (!input) return;
    
    const value = parseFloat(input.value);

    // Validation
    if (isNaN(value) || value < 0) {
        showNotification('Veuillez entrer une valeur valide', 'warning');
        return;
    }

    // Sauvegarder
    const today = new Date().toISOString().split('T')[0];
    setRainfallForDate(today, value);

    // Notification et reset
    showNotification('✓ Enregistré avec succès !', 'success');
    input.value = '';
    
    // Mettre à jour l'interface
    updateStats();
    updateHistory();
    updateChart();
}

/**
 * Afficher une notification temporaire
 * @param {string} message - Message à afficher
 * @param {string} type - Type de notification ('success', 'warning', etc.)
 */
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Supprimer après 3 secondes
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.5s ease reverse';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

/**
 * Initialiser les événements de l'interface
 */
function initUIEvents() {
    // Permettre l'entrée avec la touche Entrée
    const input = document.getElementById('rainfallInput');
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                saveRainfall();
            }
        });
    }
}
