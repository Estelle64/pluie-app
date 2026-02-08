/**
 * watts.js
 * Gestion des graphiques de watts avec Chart.js
 */

let wattsChart = null;
let currentWattChartPeriod = 'month';

/**
 * Initialiser le graphique de watts
 */
function initWattChart() {
    const ctx = document.getElementById('wattsChart');
    if (!ctx) return;
    
    wattsChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Production (kWh)',
                data: [],
                backgroundColor: 'rgba(255, 206, 86, 0.6)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
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
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(184, 220, 232, 0.3)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
    
    updateWattChart('month');
}

/**
 * Changer de période de graphique watts
 * @param {string} period - 'month' ou 'year'
 */
function switchWattChart(period) {
    currentWattChartPeriod = period;
    
    // Mettre à jour les onglets actifs (dans le contexte du graphique watts)
    const tabsContainer = event.target.closest('.tabs');
    if (tabsContainer) {
        tabsContainer.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
    }
    event.target.classList.add('active');
    
    updateWattChart(period);
}

/**
 * Mettre à jour le graphique de watts
 * @param {string} period - 'month' ou 'year'
 */
function updateWattChart(period = 'month') {
    if (!wattsChart) return;
    
    const now = new Date();
    let labels = [];
    let data = [];

    if (period === 'month') {
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(now.getFullYear(), now.getMonth(), i);
            const dateStr = date.toISOString().split('T')[0];
            labels.push(i.toString());
            data.push(getWattForDate(dateStr));
        }
    } else {
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        
        for (let i = 0; i < 12; i++) {
            labels.push(months[i]);
            
            const monthStart = new Date(now.getFullYear(), i, 1);
            const monthEnd = new Date(now.getFullYear(), i + 1, 0);
            const monthTotal = getTotalWattForPeriod(monthStart, monthEnd);
            
            data.push(monthTotal);
        }
    }

    wattsChart.data.labels = labels;
    wattsChart.data.datasets[0].data = data;
    wattsChart.update();
}