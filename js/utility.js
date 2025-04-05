// Utility Functions JavaScript

// Show Notification
function showNotification(title, message, type = 'info') {
    const notificationArea = document.querySelector('.notification-area');
    if (!notificationArea) return;
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set icon based on type
    let icon;
    switch (type) {
        case 'success':
            icon = 'fa-check-circle';
            break;
        case 'error':
            icon = 'fa-exclamation-circle';
            break;
        case 'warning':
            icon = 'fa-exclamation-triangle';
            break;
        default:
            icon = 'fa-info-circle';
    }
    
    // Set notification content
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${icon}"></i>
        </div>
        <div class="notification-content">
            <h3>${title}</h3>
            <p>${message}</p>
        </div>
        <button class="close-notification">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to notification area
    notificationArea.appendChild(notification);
    
    // Add close button event listener
    const closeBtn = notification.querySelector('.close-notification');
    closeBtn.addEventListener('click', () => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

/**
 * Show a notification to the user
 * @param {string} message - The notification message
 * @param {string} type - The notification type (success, error, warning, info)
 * @param {number} duration - How long to show the notification (in ms)
 */
function globalShowNotification(message, type = 'info', duration = 5000) {
    const notificationArea = document.querySelector('.notification-area');
    if (!notificationArea) return;
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type} notification-slide`;
    
    // Create icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    
    // Set notification content
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="notification-content">
            <p>${message}</p>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to notification area
    notificationArea.appendChild(notification);
    
    // Add close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 500);
    });
    
    // Auto remove after duration
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }
    }, duration);
    
    // Apply animation
    anime({
        targets: notification,
        translateX: [100, 0],
        opacity: [0, 1],
        duration: 500,
        easing: 'easeOutExpo'
    });
}

// Theme Switcher
function initThemeSwitcher() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Update toggle button state
    if (savedTheme === 'dark') {
        themeToggle.checked = true;
    }
    
    // Add event listener
    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
}

// Export Data
function exportUserData() {
    const userData = {
        tasks: JSON.parse(localStorage.getItem('tasks')) || [],
        diaryEntries: JSON.parse(localStorage.getItem('diaryEntries')) || [],
        userBadges: JSON.parse(localStorage.getItem('userBadges')) || [],
        // Removed pomodoroStats and pomodoroSettings
        userStreak: parseInt(localStorage.getItem('userStreak') || '0'),
        lastVisit: localStorage.getItem('lastVisit') || '',
        theme: localStorage.getItem('theme') || 'light',
        chatbotHistory: JSON.parse(localStorage.getItem('chatbotHistory')) || [],
        exportDate: new Date().toISOString()
    };
    
    // Convert to JSON string
    const dataStr = JSON.stringify(userData, null, 2);
    
    // Create download link
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `pro-to-pro-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Export Complete', 'Your data has been exported successfully', 'success');
}

// Import Data
function importUserData(fileInput) {
    const file = fileInput.files[0];
    if (!file) {
        showNotification('Error', 'No file selected', 'error');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Validate data structure
            if (!data.tasks || !data.diaryEntries || !data.userBadges) {
                throw new Error('Invalid data format');
            }
            
            // Confirm import
            if (confirm('This will replace all your current data. Are you sure you want to continue?')) {
                // Import all data
                localStorage.setItem('tasks', JSON.stringify(data.tasks));
                localStorage.setItem('diaryEntries', JSON.stringify(data.diaryEntries));
                localStorage.setItem('userBadges', JSON.stringify(data.userBadges));
                
                // Removed pomodoroStats and pomodoroSettings import
                
                if (data.userStreak) {
                    localStorage.setItem('userStreak', data.userStreak.toString());
                }
                
                if (data.lastVisit) {
                    localStorage.setItem('lastVisit', data.lastVisit);
                }
                
                if (data.theme) {
                    localStorage.setItem('theme', data.theme);
                    document.documentElement.setAttribute('data-theme', data.theme);
                }
                
                if (data.chatbotHistory) {
                    localStorage.setItem('chatbotHistory', JSON.stringify(data.chatbotHistory));
                }
                
                showNotification('Import Complete', 'Your data has been imported successfully. Refreshing page...', 'success');
                
                // Refresh page after 2 seconds
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        } catch (error) {
            showNotification('Error', 'Failed to import data: ' + error.message, 'error');
        }
    };
    
    reader.readAsText(file);
}

// Check User Streak
function checkStreak() {
    const lastActiveDate = localStorage.getItem('lastActiveDate');
    const currentStreak = parseInt(localStorage.getItem('userStreak') || '0');
    const today = new Date().toDateString();
    
    if (!lastActiveDate) {
        // First time user
        localStorage.setItem('lastActiveDate', today);
        localStorage.setItem('userStreak', '1');
        return 1;
    }
    
    if (lastActiveDate === today) {
        // Already active today
        return currentStreak;
    }
    
    // Check if last active was yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();
    
    if (lastActiveDate === yesterdayString) {
        // Streak continues
        const newStreak = currentStreak + 1;
        localStorage.setItem('userStreak', newStreak.toString());
        localStorage.setItem('lastActiveDate', today);
        
        // Check for streak badges
        checkStreakBadges(newStreak);
        
        return newStreak;
    } else {
        // Streak broken
        localStorage.setItem('userStreak', '1');
        localStorage.setItem('lastActiveDate', today);
        return 1;
    }
}

// Check Streak Badges
function checkStreakBadges(streak) {
    if (streak === 3) {
        awardBadge('3-day-streak');
    } else if (streak === 7) {
        awardBadge('7-day-streak');
    } else if (streak === 14) {
        awardBadge('14-day-streak');
    } else if (streak === 30) {
        awardBadge('30-day-streak');
    } else if (streak === 100) {
        awardBadge('100-day-streak');
    }
}

// Format Date
function formatDate(date) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(date).toLocaleDateString(undefined, options);
}

// Format Time
function formatTime(date) {
    const options = { 
        hour: '2-digit', 
        minute: '2-digit'
    };
    return new Date(date).toLocaleTimeString(undefined, options);
}

// Generate Random ID
function generateId() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
}

// Deep Clone Object
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Debounce Function
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Throttle Function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Get Time Ago
function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) {
        return Math.floor(interval) + " years ago";
    }
    
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months ago";
    }
    
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days ago";
    }
    
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours ago";
    }
    
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes ago";
    }
    
    return Math.floor(seconds) + " seconds ago";
}

// Export functions to window object for global access
window.showNotification = showNotification;
window.globalShowNotification = globalShowNotification;
window.checkStreak = checkStreak;
window.formatDate = formatDate;
window.formatTime = formatTime;
window.generateId = generateId;
window.deepClone = deepClone;
window.debounce = debounce;
window.throttle = throttle;
window.timeAgo = timeAgo;

// Initialize utilities when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initThemeSwitcher();
    
    // Setup import/export buttons if they exist
    const exportBtn = document.getElementById('export-data');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportUserData);
    }
    
    const importBtn = document.getElementById('import-data');
    const fileInput = document.getElementById('import-file');
    
    if (importBtn && fileInput) {
        importBtn.addEventListener('click', () => {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', () => {
            importUserData(fileInput);
        });
    }
    
    // Check user streak on page load
    const streak = checkStreak();
    
    // Show streak notification if streak > 1
    if (streak > 1) {
        showNotification('Daily Streak', `You've visited ${streak} days in a row!`, 'success');
        
        // Unlock streak badges if applicable
        if (typeof unlockBadge === 'function') {
            if (streak >= 3) unlockBadge('streak-3');
            if (streak >= 7) unlockBadge('streak-7');
            if (streak >= 30) unlockBadge('streak-30');
            if (streak >= 100) unlockBadge('streak-100');
        }
    }
});