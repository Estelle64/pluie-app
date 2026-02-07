/**
 * temperature.js
 * Gestion des graphiques de température avec Chart.js
 */

let tempMorningChart = null;
let tempAfternoonChart = null;

/**
 * Initialiser les graphiques de température
 */
function initTemperatureCharts() {
    const morningCtx = document.getElementById('tempMorningChart');
    const afternoonCtx = document.getElementById('tempAfternoonChart');
    if (!morningCtx || !afternoonCtx) return;

    const chartOptions = {
        type: 'line',
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(184, 220, 232, 0.3)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            elements: {
                line: {
                    tension: 0.4 // Makes the line smoother
                }
            }
        }
    };

    tempMorningChart = new Chart(morningCtx.getContext('2d'), {
        ...chartOptions,
        data: {
            labels: [],
            datasets: [{
                label: 'Température Matin (°C)',
                data: [],
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 2,
                fill: true
            }]
        }
    });

    tempAfternoonChart = new Chart(afternoonCtx.getContext('2d'), {
        ...chartOptions,
        data: {
            labels: [],
            datasets: [{
                label: 'Température Après-midi (°C)',
                data: [],
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: true
            }]
        }
    });

    updateTemperatureCharts();
}

/**
 * Mettre à jour les graphiques de température (mois en cours)
 */
function updateTemperatureCharts() {
    if (!tempMorningChart || !tempAfternoonChart) return;

    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    let labels = [];
    let morningData = [];
    let afternoonData = [];

    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(now.getFullYear(), now.getMonth(), i);
        const dateStr = date.toISOString().split('T')[0];
        labels.push(i.toString());
        
        // These functions will be created in storage.js
        const tempData = getTemperatureForDate(dateStr); 
        morningData.push(tempData.morning);
        afternoonData.push(tempData.afternoon);
    }

    // Mettre à jour le graphique du matin
    tempMorningChart.data.labels = labels;
    tempMorningChart.data.datasets[0].data = morningData;
    tempMorningChart.update();

    // Mettre à jour le graphique de l'après-midi
    tempAfternoonChart.data.labels = labels;
    tempAfternoonChart.data.datasets[0].data = afternoonData;
    tempAfternoonChart.update();
}
