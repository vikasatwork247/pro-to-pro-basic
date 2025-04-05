// Analytics JavaScript

// DOM Elements
const analyticsContainer = document.querySelector('.analytics-container');
const timeframeSelector = document.getElementById('analytics-timeframe');
const productivityChart = document.getElementById('productivity-chart');
const tasksChart = document.getElementById('tasks-chart');
const focusChart = document.getElementById('focus-chart');
const moodChart = document.getElementById('mood-chart');

// Analytics State
let currentTimeframe = 'week';
let analyticsData = {
    tasks: [],
    diary: [],
    pomodoro: []
};

// Initialize Analytics
function initAnalytics() {
    loadAnalyticsData();
    renderAnalytics();
    initAnalyticsEventListeners();
}

// Event Listeners
function initAnalyticsEventListeners() {
    // Timeframe selector
    if (timeframeSelector) {
        timeframeSelector.addEventListener('change', () => {
            currentTimeframe = timeframeSelector.value;
            renderAnalytics();
        });
    }
    
    // Window resize event for responsive charts
    window.addEventListener('resize', debounce(() => {
        renderCharts();
    }, 250));
}

// Load Analytics Data
function loadAnalyticsData() {
    // Get tasks data
    if (typeof getTasksData === 'function') {
        analyticsData.tasks = getTasksData();
    } else {
        analyticsData.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    }
    
    // Get diary data
    if (typeof getDiaryData === 'function') {
        analyticsData.diary = getDiaryData();
    } else {
        analyticsData.diary = JSON.parse(localStorage.getItem('diaryEntries')) || [];
    }
    
    // Get pomodoro data
    analyticsData.pomodoro = {
        completedPomodoros: parseInt(localStorage.getItem('completedPomodoros')) || 0,
        totalFocusTime: parseInt(localStorage.getItem('totalFocusTime')) || 0
    };
}

// Render Analytics
function renderAnalytics() {
    updateAnalyticsCards();
    renderCharts();
}

// Update Analytics Cards
function updateAnalyticsCards() {
    // Filter data based on timeframe
    const filteredData = filterDataByTimeframe();
    
    // Tasks statistics
    const completedTasks = filteredData.tasks.filter(task => task.completed).length;
    const totalTasks = filteredData.tasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Diary statistics
    const totalEntries = filteredData.diary.length;
    const avgProductivity = filteredData.diary.length > 0 
        ? Math.round(filteredData.diary.reduce((sum, entry) => sum + entry.productivity, 0) / filteredData.diary.length * 10) / 10
        : 0;
    
    // Focus time statistics
    const focusTimeHours = Math.floor(analyticsData.pomodoro.totalFocusTime / 3600);
    const focusTimeMinutes = Math.floor((analyticsData.pomodoro.totalFocusTime % 3600) / 60);
    const focusTimeFormatted = `${focusTimeHours}h ${focusTimeMinutes}m`;
    
    // Update cards
    updateAnalyticsCard('completed', completedTasks);
    updateAnalyticsCard('pending', totalTasks - completedTasks);
    updateAnalyticsCard('rate', `${completionRate}%`);
    updateAnalyticsCard('entries', totalEntries);
    updateAnalyticsCard('productivity', avgProductivity);
    updateAnalyticsCard('focus', focusTimeFormatted);
    updateAnalyticsCard('pomodoros', analyticsData.pomodoro.completedPomodoros);
}

// Update Analytics Card
function updateAnalyticsCard(type, value) {
    const card = document.querySelector(`.analytics-card[data-type="${type}"] .card-value`);
    if (card) {
        card.textContent = value;
    }
}

// Render Charts
function renderCharts() {
    // Filter data based on timeframe
    const filteredData = filterDataByTimeframe();
    
    // Render each chart
    renderProductivityChart(filteredData);
    renderTasksChart(filteredData);
    renderFocusChart(filteredData);
    renderMoodChart(filteredData);
}

// Render Productivity Chart
function renderProductivityChart(data) {
    if (!productivityChart || typeof Chart === 'undefined') return;
    
    // Destroy existing chart
    if (window.productivityChartInstance) {
        window.productivityChartInstance.destroy();
    }
    
    // Prepare data
    const dateLabels = [];
    const productivityData = [];
    
    // Group diary entries by date and calculate average productivity
    const entriesByDate = groupByDate(data.diary);
    
    // Get date range based on timeframe
    const dateRange = getDateRange();
    
    // Fill in data for each date in range
    for (let date = new Date(dateRange.start); date <= dateRange.end; date.setDate(date.getDate() + 1)) {
        const dateString = date.toISOString().split('T')[0];
        dateLabels.push(formatDate(date));
        
        if (entriesByDate[dateString]) {
            const entries = entriesByDate[dateString];
            const avgProductivity = entries.reduce((sum, entry) => sum + entry.productivity, 0) / entries.length;
            productivityData.push(avgProductivity);
        } else {
            productivityData.push(null); // No data for this date
        }
    }
    
    // Create chart
    const ctx = productivityChart.getContext('2d');
    window.productivityChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dateLabels,
            datasets: [{
                label: 'Productivity Level',
                data: productivityData,
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    title: {
                        display: true,
                        text: 'Productivity Level (0-10)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            return tooltipItems[0].label;
                        }
                    }
                }
            }
        }
    });
}

// Render Tasks Chart
function renderTasksChart(data) {
    if (!tasksChart || typeof Chart === 'undefined') return;
    
    // Destroy existing chart
    if (window.tasksChartInstance) {
        window.tasksChartInstance.destroy();
    }
    
    // Prepare data
    const dateLabels = [];
    const completedData = [];
    const addedData = [];
    
    // Group tasks by date
    const tasksByCompletionDate = {};
    const tasksByCreationDate = {};
    
    // Process tasks
    data.tasks.forEach(task => {
        // For completed tasks
        if (task.completed && task.updatedAt) {
            const dateString = new Date(task.updatedAt).toISOString().split('T')[0];
            if (!tasksByCompletionDate[dateString]) {
                tasksByCompletionDate[dateString] = 0;
            }
            tasksByCompletionDate[dateString]++;
        }
        
        // For created tasks
        const creationDateString = new Date(task.createdAt).toISOString().split('T')[0];
        if (!tasksByCreationDate[creationDateString]) {
            tasksByCreationDate[creationDateString] = 0;
        }
        tasksByCreationDate[creationDateString]++;
    });
    
    // Get date range based on timeframe
    const dateRange = getDateRange();
    
    // Fill in data for each date in range
    for (let date = new Date(dateRange.start); date <= dateRange.end; date.setDate(date.getDate() + 1)) {
        const dateString = date.toISOString().split('T')[0];
        dateLabels.push(formatDate(date));
        
        completedData.push(tasksByCompletionDate[dateString] || 0);
        addedData.push(tasksByCreationDate[dateString] || 0);
    }
    
    // Create chart
    const ctx = tasksChart.getContext('2d');
    window.tasksChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dateLabels,
            datasets: [
                {
                    label: 'Tasks Completed',
                    data: completedData,
                    backgroundColor: '#4CAF50',
                    borderColor: '#388E3C',
                    borderWidth: 1
                },
                {
                    label: 'Tasks Added',
                    data: addedData,
                    backgroundColor: '#2196F3',
                    borderColor: '#1976D2',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Tasks'
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
}

// Render Focus Chart
function renderFocusChart(data) {
    if (!focusChart || typeof Chart === 'undefined') return;
    
    // Destroy existing chart
    if (window.focusChartInstance) {
        window.focusChartInstance.destroy();
    }
    
    // For now, we'll just show a simple gauge chart of total focus time
    const totalHours = Math.floor(analyticsData.pomodoro.totalFocusTime / 3600);
    const targetHours = 100; // Target for "focus-legend"
    
    // Create chart
    const ctx = focusChart.getContext('2d');
    window.focusChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Focus Time', 'Remaining'],
            datasets: [{
                data: [totalHours, Math.max(0, targetHours - totalHours)],
                backgroundColor: [
                    '#4CAF50',
                    '#E0E0E0'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw} hours`;
                        }
                    }
                }
            }
        }
    });
    
    // Add center text
    const centerText = {
        id: 'centerText',
        afterDraw: function(chart) {
            const width = chart.width;
            const height = chart.height;
            const ctx = chart.ctx;
            
            ctx.restore();
            const fontSize = (height / 114).toFixed(2);
            ctx.font = fontSize + 'em sans-serif';
            ctx.textBaseline = 'middle';
            
            const text = `${totalHours}h / ${targetHours}h`;
            const textX = Math.round((width - ctx.measureText(text).width) / 2);
            const textY = height / 2;
            
            ctx.fillText(text, textX, textY);
            ctx.save();
        }
    };
    
    Chart.register(centerText);
}

// Render Mood Chart
function renderMoodChart(data) {
    if (!moodChart || typeof Chart === 'undefined') return;
    
    // Destroy existing chart
    if (window.moodChartInstance) {
        window.moodChartInstance.destroy();
    }
    
    // Count mood distribution
    const moodCounts = {
        great: 0,
        good: 0,
        neutral: 0,
        bad: 0,
        terrible: 0
    };
    
    data.diary.forEach(entry => {
        if (moodCounts.hasOwnProperty(entry.mood)) {
            moodCounts[entry.mood]++;
        }
    });
    
    // Create chart
    const ctx = moodChart.getContext('2d');
    window.moodChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Great', 'Good', 'Neutral', 'Bad', 'Terrible'],
            datasets: [{
                data: [
                    moodCounts.great,
                    moodCounts.good,
                    moodCounts.neutral,
                    moodCounts.bad,
                    moodCounts.terrible
                ],
                backgroundColor: [
                    '#4CAF50', // Great - Green
                    '#8BC34A', // Good - Light Green
                    '#FFC107', // Neutral - Yellow
                    '#FF9800', // Bad - Orange
                    '#F44336'  // Terrible - Red
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

// Filter Data By Timeframe
function filterDataByTimeframe() {
    const dateRange = getDateRange();
    
    // Filter tasks
    const filteredTasks = analyticsData.tasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        return taskDate >= dateRange.start && taskDate <= dateRange.end;
    });
    
    // Filter diary entries
    const filteredDiary = analyticsData.diary.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= dateRange.start && entryDate <= dateRange.end;
    });
    
    return {
        tasks: filteredTasks,
        diary: filteredDiary,
        pomodoro: analyticsData.pomodoro
    };
}

// Get Date Range based on timeframe
function getDateRange() {
    const end = new Date(); // Today
    let start = new Date();
    
    switch (currentTimeframe) {
        case 'week':
            start.setDate(end.getDate() - 7);
            break;
        case 'month':
            start.setMonth(end.getMonth() - 1);
            break;
        case 'year':
            start.setFullYear(end.getFullYear() - 1);
            break;
        default:
            start.setDate(end.getDate() - 7); // Default to week
    }
    
    // Reset hours to get full days
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    
    return { start, end };
}

// Group entries by date
function groupByDate(entries) {
    const grouped = {};
    
    entries.forEach(entry => {
        const dateString = new Date(entry.date).toISOString().split('T')[0];
        if (!grouped[dateString]) {
            grouped[dateString] = [];
        }
        grouped[dateString].push(entry);
    });
    
    return grouped;
}

// Format date for display
function formatDate(date) {
    // For week timeframe, show day name
    if (currentTimeframe === 'week') {
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
    
    // For month timeframe, show day and month
    if (currentTimeframe === 'month') {
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    }
    
    // For year timeframe, show month only
    return date.toLocaleDateString('en-US', { month: 'short' });
}

// Debounce function for resize event
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

// Generate productivity insights
function generateProductivityInsights() {
    const insights = [];
    
    // Get filtered data
    const filteredData = filterDataByTimeframe();
    
    // Most productive day of week
    if (filteredData.diary.length > 0) {
        const productivityByDay = {};
        const dayCount = {};
        
        filteredData.diary.forEach(entry => {
            const date = new Date(entry.date);
            const day = date.toLocaleDateString('en-US', { weekday: 'long' });
            
            if (!productivityByDay[day]) {
                productivityByDay[day] = 0;
                dayCount[day] = 0;
            }
            
            productivityByDay[day] += entry.productivity;
            dayCount[day]++;
        });
        
        let mostProductiveDay = null;
        let highestAvg = 0;
        
        Object.keys(productivityByDay).forEach(day => {
            const avg = productivityByDay[day] / dayCount[day];
            if (avg > highestAvg) {
                highestAvg = avg;
                mostProductiveDay = day;
            }
        });
        
        if (mostProductiveDay) {
            insights.push(`Your most productive day is ${mostProductiveDay} with an average productivity of ${highestAvg.toFixed(1)}/10.`);
        }
    }
    
    // Task completion rate trend
    if (filteredData.tasks.length > 0) {
        const completedTasks = filteredData.tasks.filter(task => task.completed).length;
        const completionRate = Math.round((completedTasks / filteredData.tasks.length) * 100);
        
        // Compare with previous period
        const previousDateRange = getPreviousDateRange();
        const previousTasks = analyticsData.tasks.filter(task => {
            const taskDate = new Date(task.createdAt);
            return taskDate >= previousDateRange.start && taskDate <= previousDateRange.end;
        });
        
        if (previousTasks.length > 0) {
            const previousCompleted = previousTasks.filter(task => task.completed).length;
            const previousRate = Math.round((previousCompleted / previousTasks.length) * 100);
            
            const difference = completionRate - previousRate;
            
            if (difference > 5) {
                insights.push(`Your task completion rate has improved by ${difference}% compared to the previous period. Great job!`);
            } else if (difference < -5) {
                insights.push(`Your task completion rate has decreased by ${Math.abs(difference)}% compared to the previous period.`);
            } else {
                insights.push(`Your task completion rate has remained stable at around ${completionRate}%.`);
            }
        } else {
            insights.push(`Your current task completion rate is ${completionRate}%.`);
        }
    }
    
    // Mood correlation with productivity
    if (filteredData.diary.length > 3) {
        const moodProductivity = {
            great: [],
            good: [],
            neutral: [],
            bad: [],
            terrible: []
        };
        
        filteredData.diary.forEach(entry => {
            if (moodProductivity.hasOwnProperty(entry.mood)) {
                moodProductivity[entry.mood].push(entry.productivity);
            }
        });
        
        const moodAvgs = {};
        let highestMood = null;
        let highestAvg = 0;
        
        Object.keys(moodProductivity).forEach(mood => {
            if (moodProductivity[mood].length > 0) {
                const sum = moodProductivity[mood].reduce((a, b) => a + b, 0);
                const avg = sum / moodProductivity[mood].length;
                moodAvgs[mood] = avg;
                
                if (avg > highestAvg) {
                    highestAvg = avg;
                    highestMood = mood;
                }
            }
        });
        
        if (highestMood) {
            insights.push(`You tend to be most productive when you're feeling ${highestMood} (${highestAvg.toFixed(1)}/10).`);
        }
    }
    
    return insights;
}

// Get previous date range for comparison
function getPreviousDateRange() {
    const currentRange = getDateRange();
    const duration = currentRange.end - currentRange.start;
    
    const end = new Date(currentRange.start);
    end.setMilliseconds(end.getMilliseconds() - 1);
    
    const start = new Date(end);
    start.setTime(start.getTime() - duration);
    
    return { start, end };
}

// Display insights in the UI
function displayInsights() {
    const insightsContainer = document.querySelector('.analytics-insights');
    if (!insightsContainer) return;
    
    const insights = generateProductivityInsights();
    
    if (insights.length === 0) {
        insightsContainer.innerHTML = '<p>Not enough data to generate insights yet. Keep using the app!</p>';
        return;
    }
    
    insightsContainer.innerHTML = '<h3>Productivity Insights</h3><ul>' + 
        insights.map(insight => `<li>${insight}</li>`).join('') + 
        '</ul>';
}

// Export analytics data
function getAnalyticsData() {
    return analyticsData;
}

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', initAnalytics);