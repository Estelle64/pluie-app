/**
 * ui.js
 * Gestion de l'interface utilisateur
 */

/**
 * Afficher la date actuelle sur les deux onglets
 */
function updateCurrentDate() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('fr-FR', options);
    


    const dateElementTemp = document.getElementById('currentDateTemp');
    if (dateElementTemp) dateElementTemp.textContent = formattedDate;
}

/**
 * Mettre à jour les statistiques de pluie affichées
 */
function updateStats() {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    
    const todayValue = getRainfallForDate(today);
    const todayElement = document.getElementById('todayValue');
    if (todayElement) todayElement.textContent = todayValue.toFixed(1);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthTotal = getTotalRainfallForPeriod(monthStart, now);
    const monthElement = document.getElementById('monthTotal');
    if (monthElement) monthElement.textContent = monthTotal.toFixed(1);

    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearTotal = getTotalRainfallForPeriod(yearStart, now);
    const yearElement = document.getElementById('yearTotal');
    if (yearElement) yearElement.textContent = yearTotal.toFixed(1);
}

/**
 * Mettre à jour l'historique des entrées de pluie
 */
function updateHistory() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    const sortedDates = getAllRainfallDates(false);

    if (sortedDates.length === 0) {
        historyList.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                </svg>
                <p>Aucune donnée de pluie enregistrée</p>
            </div>
        `;
        return;
    }

    historyList.innerHTML = sortedDates.slice(0, 50).map(date => {
        const dateObj = new Date(date);
        const formatted = dateObj.toLocaleDateString('fr-FR', {
            weekday: 'short', day: 'numeric', month: 'short'
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
    const rainfallInput = document.getElementById('rainfallInput');
    const rainfallDateInput = document.getElementById('rainfallDateInput');
    if (!rainfallInput || !rainfallDateInput) return;
    
    const value = parseFloat(rainfallInput.value);
    const date = rainfallDateInput.value; // Get date from input

    if (isNaN(value) || value < 0) {
        showNotification('Veuillez entrer une valeur valide', 'warning');
        return;
    }
    if (!date) { // Check if date is selected
        showNotification('Veuillez sélectionner une date', 'warning');
        return;
    }

    setRainfallForDate(date, value); // Use selected date

    showNotification(`✓ Pluie (${date}) enregistrée !`, 'success');
    rainfallInput.value = value; // Keep value in input after saving for the day
    
    updateStats();
    updateHistory();
    updateChart();
}

/**
 * Afficher une notification temporaire
 */
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.5s ease reverse';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

/**
 * Pré-remplir les champs de saisie avec les données du jour ou de la date sélectionnée
 */
function fillTodaysInputs() {
    const today = new Date();
    const todayISO = today.toISOString().split('T')[0];

    // Pluie
    const rainfallInput = document.getElementById('rainfallInput');
    const rainfallDateInput = document.getElementById('rainfallDateInput');
    if (rainfallInput && rainfallDateInput) {
        // Set date input to today's date if not already set
        if (!rainfallDateInput.value) {
            rainfallDateInput.value = todayISO;
        }
        
        // Load data for the selected date
        const selectedDate = rainfallDateInput.value;
        const rainValue = getRainfallForDate(selectedDate);
        rainfallInput.value = rainValue > 0 ? rainValue : '';
    }

    // Température
    const tempMorningInput = document.getElementById('tempMorningInput');
    const tempAfternoonInput = document.getElementById('tempAfternoonInput');
    if (tempMorningInput && tempAfternoonInput) {
        const todayTemp = getTemperatureForDate(todayISO); // Always for today's temp
        tempMorningInput.value = todayTemp.morning !== null ? todayTemp.morning : '';
        tempAfternoonInput.value = todayTemp.afternoon !== null ? todayTemp.afternoon : '';
    }
}

/**
 * Initialiser les événements de l'interface
 */
function initUIEvents() {
    fillTodaysInputs();

    // Event listeners pour la touche "Entrée"
    document.getElementById('rainfallInput')?.addEventListener('keypress', e => {
        if (e.key === 'Enter') saveRainfall();
    });
    document.getElementById('tempMorningInput')?.addEventListener('keypress', e => {
        if (e.key === 'Enter') saveTemperature();
    });
    document.getElementById('tempAfternoonInput')?.addEventListener('keypress', e => {
        if (e.key === 'Enter') saveTemperature();
    });

    // Event listener pour le changement de date de pluie
    document.getElementById('rainfallDateInput')?.addEventListener('change', fillTodaysInputs);
}
