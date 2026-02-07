/**
 * app.js
 * Point d'entrée principal de l'application
 */

/**
 * Initialiser l'application au chargement de la page
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌦️ Journal Météo - Application démarrée');
    
    // 1. Charger les données du localStorage
    loadData();
    
    // 2. Initialiser l'interface
    updateCurrentDate();
    updateStats();
    updateHistory();
    
    // 3. Initialiser les graphiques
    initChart();
    initTemperatureCharts();
    
    // 4. Initialiser les événements UI
    initUIEvents();
    
    // 5. Vérifier les rappels de sauvegarde
    checkBackupReminder();
    
    console.log('✓ Application prête');
});

/**
 * Changer d'onglet principal
 * @param {string} tabName - 'rain' ou 'temp'
 */
function switchMainTab(tabName) {
    // Gérer les onglets
    document.querySelectorAll('.main-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');

    // Gérer le contenu
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabName + 'Content').classList.add('active');
}

/**
 * Enregistrer les données de température pour aujourd'hui
 */
function saveTemperature() {
    const morningInput = document.getElementById('tempMorningInput');
    const afternoonInput = document.getElementById('tempAfternoonInput');
    const today = new Date().toISOString().split('T')[0];

    const morningTemp = morningInput.value !== '' ? parseFloat(morningInput.value) : null;
    const afternoonTemp = afternoonInput.value !== '' ? parseFloat(afternoonInput.value) : null;

    setTemperatureForDate(today, morningTemp, afternoonTemp);
    
    updateTemperatureCharts();
    
    showNotification('🌡️ Températures enregistrées !', 'success');
}

/**
 * Gestion du rechargement/fermeture de page
 * Avertir l'utilisateur si des données non sauvegardées
 */
window.addEventListener('beforeunload', function(e) {
    const today = new Date().toISOString().split('T')[0];
    const todayRain = getRainfallForDate(today);
    const todayTemp = getTemperatureForDate(today);
    const hasTodayData = todayRain > 0 || todayTemp.morning !== null || todayTemp.afternoon !== null;
    
    const lastExport = localStorage.getItem('last_export_date');
    if (hasTodayData && !lastExport) {
        e.preventDefault();
        e.returnValue = '';
    }
});
