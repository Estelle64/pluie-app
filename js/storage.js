/**
 * storage.js
 * Gestion du stockage local des données météo
 */

const WEATHER_DATA_KEY = 'weather_data';
let weatherData = {
    rainfall: {},
    temperature: {},
    comments: {} // Nouvelle clé pour les commentaires
};

/**
 * Charger les données depuis localStorage
 */
function loadData() {
    const stored = localStorage.getItem(WEATHER_DATA_KEY);
    if (stored) {
        try {
            const data = JSON.parse(stored);
            // Fusionner pour assurer la compatibilité ascendante
            weatherData = {
                rainfall: data.rainfall || {},
                temperature: data.temperature || {},
                comments: data.comments || {} // Charger les commentaires
            };
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            weatherData = { rainfall: {}, temperature: {}, comments: {} };
        }
    }
}

/**
 * Sauvegarder les données dans localStorage
 */
function saveData() {
    try {
        localStorage.setItem(WEATHER_DATA_KEY, JSON.stringify(weatherData));
        localStorage.setItem('last_backup_date', new Date().toISOString());
    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        showNotification('❌ Erreur lors de la sauvegarde', 'warning');
    }
}

// --- Fonctions Pluie ---

function getRainfallForDate(date) {
    return weatherData.rainfall[date] || 0;
}

function setRainfallForDate(date, value) {
    weatherData.rainfall[date] = value;
    saveData();
}

function getAllRainfallDates(ascending = false) {
    const dates = Object.keys(weatherData.rainfall).sort();
    return ascending ? dates : dates.reverse();
}

function getTotalRainfallForPeriod(startDate, endDate) {
    let total = 0;
    Object.keys(weatherData.rainfall).forEach(dateStr => {
        const date = new Date(dateStr);
        if (date >= startDate && date <= endDate) {
            total += weatherData.rainfall[dateStr];
        }
    });
    return total;
}

// --- Fonctions Température ---

function getTemperatureForDate(date) {
    return weatherData.temperature[date] || { morning: null, afternoon: null };
}

function setTemperatureForDate(date, morning, afternoon) {
    weatherData.temperature[date] = { morning, afternoon };
    saveData();
}

// --- Fonctions Commentaires ---

function getCommentForDate(date) {
    return weatherData.comments[date] || '';
}

function setCommentForDate(date, comment) {
    if (comment.trim() === '') {
        delete weatherData.comments[date]; // Supprimer si le commentaire est vide
    } else {
        weatherData.comments[date] = comment;
    }
    saveData();
}

// --- Fonctions communes ---

/**
 * Exporter toutes les données en JSON
 */
function exportData() {
    try {
        const dataStr = JSON.stringify(weatherData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `meteo-donnees-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);

        localStorage.setItem('last_export_date', new Date().toISOString());
        updateLastBackupDisplay();
        showNotification('✓ Données exportées avec succès !', 'success');
    } catch (error) {
        console.error('Erreur lors de l\'export:', error);
        showNotification('❌ Erreur lors de l\'export', 'warning');
    }
}

/**
 * Importer des données depuis un fichier JSON
 */
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (typeof imported !== 'object' || imported === null) {
                throw new Error('Format invalide');
            }
            
            // Fusionner les données importées
            if (imported.rainfall) {
                weatherData.rainfall = { ...weatherData.rainfall, ...imported.rainfall };
            }
            if (imported.temperature) {
                weatherData.temperature = { ...weatherData.temperature, ...imported.temperature };
            }
            if (imported.comments) { // Fusionner les commentaires
                weatherData.comments = { ...weatherData.comments, ...imported.comments };
            }

            saveData();
            
            // Rafraîchir toute l'interface
            updateStats();
            updateHistory();
            updateChart();
            updateTemperatureCharts();
            fillTodaysInputs(); // Mettre à jour les inputs après import

            showNotification('✓ Données importées avec succès !', 'success');
        } catch (error) {
            console.error('Erreur lors de l\'importation:', error);
            showNotification('❌ Erreur lors de l\'importation. Vérifiez le fichier.', 'warning');
        }
    };
    
    reader.onerror = function() {
        showNotification('❌ Impossible de lire le fichier', 'warning');
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset input
}

/**
 * Vérifier et afficher la dernière date de sauvegarde
 */
function updateLastBackupDisplay() {
    const lastExport = localStorage.getItem('last_export_date');
    const backupElement = document.getElementById('lastBackup');
    
    if (lastExport && backupElement) {
        const date = new Date(lastExport);
        const formatted = date.toLocaleDateString('fr-FR');
        backupElement.textContent = formatted;
    }
}

/**
 * Vérifier si un rappel de sauvegarde est nécessaire
 */
function checkBackupReminder() {
    updateLastBackupDisplay();
    
    const lastExport = localStorage.getItem('last_export_date');
    const hasData = Object.keys(weatherData.rainfall).length > 0 || Object.keys(weatherData.temperature).length > 0 || Object.keys(weatherData.comments).length > 0;

    if (!lastExport && hasData) {
        setTimeout(() => {
            showNotification('💡 N\'oubliez pas de sauvegarder vos données !', 'warning');
        }, 2000);
        return;
    }

    if (lastExport) {
        const daysSinceBackup = (Date.now() - new Date(lastExport)) / (1000 * 60 * 60 * 24);
        if (daysSinceBackup > 30) {
            setTimeout(() => {
                showNotification('⚠️ Dernière sauvegarde il y a plus d\'un mois !', 'warning');
            }, 2000);
        }
    }
}
