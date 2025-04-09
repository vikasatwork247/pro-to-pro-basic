// Analytics JavaScript

// DOM Elements
const analyticsContainer = document.querySelector('.analytics-container');
const timeframeSelector = document.getElementById('analytics-timeframe');
const productivityChart = document.getElementById('productivity-chart');
const completionChart = document.getElementById('completion-chart');

// Analytics State
let currentTimeframe = 'week';
let analyticsData = {
    tasks: [],
    diary: [],
    pomodoro: {},
    badges: []
};

// Initialize Analytics
function initAnalytics() {
    loadAnalyticsData();
    renderAnalytics();
    initAnalyticsEventListeners();
    // Update analytics every minute
    setInterval(loadAnalyticsData, 60000);
}

// Event Listeners
function initAnalyticsEventListeners() {
    if (timeframeSelector) {
        timeframeSelector.addEventListener('change', () => {
            currentTimeframe = timeframeSelector.value;
            renderAnalytics();
        });
    }
}

// Load Analytics Data
function loadAnalyticsData() {
    try {
        // Load tasks
        analyticsData.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        
        // Load diary entries
        analyticsData.diary = JSON.parse(localStorage.getItem('diaryEntries')) || [];
        
        // Load pomodoro data
        const pomodoroStats = JSON.parse(localStorage.getItem('pomodoroStats')) || {};
        analyticsData.pomodoro = {
            completedPomodoros: pomodoroStats.completedPomodoros || 0,
            totalFocusTime: pomodoroStats.totalFocusTime || 0,
            currentStreak: pomodoroStats.currentStreak || 0,
            lastPomodoroDate: pomodoroStats.lastPomodoroDate || null
        };
        
        // Load badges
        analyticsData.badges = JSON.parse(localStorage.getItem('earnedBadges')) || [];
        
        renderAnalytics();
    } catch (error) {
        console.error('Error loading analytics data:', error);
    }
}

// Render Analytics
function renderAnalytics() {
    updateAnalyticsCards();
    renderCharts();
    generateProductivityInsights();
}

// Update Analytics Cards
function updateAnalyticsCards() {
    const filteredData = filterDataByTimeframe();
    
    // Completed Tasks
    const completedTasks = filteredData.tasks.filter(task => task.completed).length;
    updateAnalyticsCard('completed-tasks', completedTasks);
    
    // Pending Tasks
    const pendingTasks = filteredData.tasks.filter(task => !task.completed).length;
    updateAnalyticsCard('pending-tasks', pendingTasks);
    
    // Focus Time
    const focusHours = Math.floor(analyticsData.pomodoro.totalFocusTime / 3600);
    const focusMinutes = Math.floor((analyticsData.pomodoro.totalFocusTime % 3600) / 60);
    const focusTimeFormatted = `${focusHours}h ${focusMinutes}m`;
    updateAnalyticsCard('focus-time', focusTimeFormatted);
    
    // Badges Earned
    const badgesEarned = analyticsData.badges.length;
    updateAnalyticsCard('badges-earned', badgesEarned);
    
    // Task Completion Rate
    const totalTasks = completedTasks + pendingTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    updateAnalyticsCard('completion-rate', `${completionRate}%`);
}

// Update Analytics Card
function updateAnalyticsCard(type, value) {
    const cardValue = document.querySelector(`.analytics-card[data-type="${type}"] .card-value`);
    if (cardValue) {
        cardValue.textContent = value;
    }
}

// Render Charts
function renderCharts() {
    renderProductivityChart();
    renderCompletionChart();
}

// Render Productivity Chart
function renderProductivityChart() {
    if (!productivityChart) return;
    
    const ctx = productivityChart.getContext('2d');
    const data = getProductivityData();
    
    if (window.productivityChartInstance) {
        window.productivityChartInstance.destroy();
    }
    
    window.productivityChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Productivity',
                data: data.values,
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Productivity (%)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Render Completion Chart
function renderCompletionChart() {
    if (!completionChart) return;
    
    const ctx = completionChart.getContext('2d');
    const data = getCompletionData();
    
    if (window.completionChartInstance) {
        window.completionChartInstance.destroy();
    }
    
    window.completionChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Pending'],
            datasets: [{
                data: [data.completed, data.pending],
                backgroundColor: ['#4CAF50', '#FFA726']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Get Productivity Data
function getProductivityData() {
    const dateRange = getDateRange();
    const labels = [];
    const values = [];
    
    for (let d = new Date(dateRange.start); d <= dateRange.end; d.setDate(d.getDate() + 1)) {
        const date = d.toISOString().split('T')[0];
        labels.push(formatDate(d));
        
        // Calculate productivity for this day
        const dayTasks = analyticsData.tasks.filter(task => {
            const taskDate = new Date(task.createdAt).toISOString().split('T')[0];
            return taskDate === date;
        });
        
        const completed = dayTasks.filter(task => task.completed).length;
        const total = dayTasks.length;
        const productivity = total > 0 ? (completed / total) * 100 : 0;
        
        values.push(Math.round(productivity));
    }
    
    return { labels, values };
}

// Get Completion Data
function getCompletionData() {
    const tasks = filterDataByTimeframe().tasks;
    const completed = tasks.filter(task => task.completed).length;
    const pending = tasks.filter(task => !task.completed).length;
    
    return { completed, pending };
}

// Filter Data By Timeframe
function filterDataByTimeframe() {
    const dateRange = getDateRange();
    
    return {
        tasks: analyticsData.tasks.filter(task => {
            const taskDate = new Date(task.createdAt);
            return taskDate >= dateRange.start && taskDate <= dateRange.end;
        }),
        diary: analyticsData.diary.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= dateRange.start && entryDate <= dateRange.end;
        })
    };
}

// Get Date Range
function getDateRange() {
    const end = new Date();
    let start = new Date();
    
    switch (currentTimeframe) {
        case 'day':
            start.setHours(0, 0, 0, 0);
            break;
        case 'week':
            start.setDate(end.getDate() - 7);
            break;
        case 'month':
            start.setMonth(end.getMonth() - 1);
            break;
        case 'year':
            start.setFullYear(end.getFullYear() - 1);
            break;
    }
    
    return { start, end };
}

// Format Date
function formatDate(date) {
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

// Generate Productivity Insights
function generateProductivityInsights() {
    const insights = [];
    const data = filterDataByTimeframe();
    
    // Task completion rate insight
    const completedTasks = data.tasks.filter(task => task.completed).length;
    const totalTasks = data.tasks.length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    if (completionRate >= 80) {
        insights.push({
            icon: 'trophy',
            title: 'Excellent Progress!',
            message: `You've completed ${Math.round(completionRate)}% of your tasks. Keep up the great work!`
        });
    } else if (completionRate < 40) {
        insights.push({
            icon: 'lightbulb',
            title: 'Room for Improvement',
            message: 'Try breaking down your tasks into smaller, manageable pieces.'
        });
    }
    
    // Focus time insight
    const focusHours = analyticsData.pomodoro.totalFocusTime / 3600;
    if (focusHours >= 4) {
        insights.push({
            icon: 'clock',
            title: 'Deep Focus Achievement',
            message: `You've maintained ${Math.round(focusHours)} hours of focused work. Excellent discipline!`
        });
    }
    
    // Display insights
    displayInsights(insights);
}

// Display Insights
function displayInsights(insights) {
    const container = document.querySelector('.insights-container');
    if (!container) return;
    
    container.innerHTML = insights.map(insight => `
        <div class="insight-card">
            <div class="insight-icon">
                <i class="fas fa-${insight.icon}"></i>
            </div>
            <div class="insight-content">
                <h4>${insight.title}</h4>
                <p>${insight.message}</p>
            </div>
        </div>
    `).join('');
}

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', initAnalytics);