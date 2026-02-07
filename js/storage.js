/**
 * storage.js
 * Gestion du stockage local des données de pluie
 */

const STORAGE_KEY = 'rainfall_data';
let rainfallData = {};

/**
 * Charger les données depuis localStorage
 */
function loadData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            rainfallData = JSON.parse(stored);
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            rainfallData = {};
        }
    }
}

/**
 * Sauvegarder les données dans localStorage
 */
function saveData() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rainfallData));
        localStorage.setItem('last_backup_date', new Date().toISOString());
    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        showNotification('❌ Erreur lors de la sauvegarde', 'warning');
    }
}

/**
 * Obtenir la valeur de pluie pour une date donnée
 * @param {string} date - Date au format ISO (YYYY-MM-DD)
 * @returns {number} Valeur en mm
 */
function getRainfallForDate(date) {
    return rainfallData[date] || 0;
}

/**
 * Enregistrer une valeur de pluie pour une date
 * @param {string} date - Date au format ISO (YYYY-MM-DD)
 * @param {number} value - Valeur en mm
 */
function setRainfallForDate(date, value) {
    rainfallData[date] = value;
    saveData();
}

/**
 * Obtenir toutes les dates enregistrées triées
 * @param {boolean} ascending - Tri ascendant si true, descendant si false
 * @returns {Array<string>} Tableau de dates
 */
function getAllDates(ascending = false) {
    const dates = Object.keys(rainfallData).sort();
    return ascending ? dates : dates.reverse();
}

/**
 * Obtenir le total de pluie pour une période
 * @param {Date} startDate - Date de début
 * @param {Date} endDate - Date de fin
 * @returns {number} Total en mm
 */
function getTotalForPeriod(startDate, endDate) {
    let total = 0;
    
    Object.keys(rainfallData).forEach(dateStr => {
        const date = new Date(dateStr);
        if (date >= startDate && date <= endDate) {
            total += rainfallData[dateStr];
        }
    });
    
    return total;
}

/**
 * Exporter les données en JSON
 */
function exportData() {
    try {
        const dataStr = JSON.stringify(rainfallData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `pluie-donnees-${new Date().toISOString().split('T')[0]}.json`;
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
 * @param {Event} event - Événement du file input
 */
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            
            // Valider que c'est bien un objet avec des dates
            if (typeof imported !== 'object' || imported === null) {
                throw new Error('Format invalide');
            }
            
            // Fusionner avec les données existantes
            rainfallData = { ...rainfallData, ...imported };
            saveData();
            
            // Rafraîchir l'interface
            updateStats();
            updateHistory();
            updateChart();
            
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
    
    // Si jamais exporté et qu'il y a des données
    if (!lastExport) {
        const hasData = Object.keys(rainfallData).length > 0;
        if (hasData) {
            setTimeout(() => {
                showNotification('💡 N\'oubliez pas de sauvegarder vos données !', 'warning');
            }, 2000);
        }
        return;
    }

    // Si dernière sauvegarde > 30 jours
    const daysSinceBackup = (Date.now() - new Date(lastExport)) / (1000 * 60 * 60 * 24);
    if (daysSinceBackup > 30) {
        setTimeout(() => {
            showNotification('⚠️ Dernière sauvegarde il y a plus d\'un mois !', 'warning');
        }, 2000);
    }
}
