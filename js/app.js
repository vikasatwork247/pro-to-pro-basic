// Main Application JavaScript

// DOM Elements
const sidebar = document.querySelector('.sidebar');
const navItems = document.querySelectorAll('.nav-item');
const contentSections = document.querySelectorAll('.content-section');
const themeToggle = document.querySelector('.theme-toggle');

// Initialize Application
function initApp() {
    // Set up navigation
    initNavigation();
    
    // Initialize theme
    initTheme();
    
    // Initialize settings panel
    initSettingsPanel();
    
    // Check user streak
    updateUserStreak();
}

// Initialize Navigation
function initNavigation() {
    if (!sidebar || !navItems.length) return;
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Show corresponding section
            const sectionId = item.getAttribute('data-section');
            showSection(sectionId);
        });
    });
}

// Show Section
function showSection(sectionId) {
    if (!contentSections.length) return;
    
    contentSections.forEach(section => {
        section.classList.remove('active');
        
        if (section.id === sectionId) {
            section.classList.add('active');
        }
    });
}

// Initialize Theme
function initTheme() {
    if (!themeToggle) return;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply theme
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        // Update icon if needed
        if (themeToggle.querySelector('i')) {
            themeToggle.querySelector('i').className = 'fas fa-sun';
        }
    } else {
        // Ensure light theme is applied
        if (themeToggle.querySelector('i')) {
            themeToggle.querySelector('i').className = 'fas fa-moon';
        }
    }
    
    // Add event listener
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
            // Change to sun icon for dark mode
            if (themeToggle.querySelector('i')) {
                themeToggle.querySelector('i').className = 'fas fa-sun';
            }
        } else {
            localStorage.setItem('theme', 'light');
            // Change to moon icon for light mode
            if (themeToggle.querySelector('i')) {
                themeToggle.querySelector('i').className = 'fas fa-moon';
            }
        }
    });
}

// Initialize Settings Panel
function initSettingsPanel() {
    // This function is now a placeholder for future settings panel functionality
    // The references to non-existent elements have been removed
}

// Update User Streak
function updateUserStreak() {
    const userStreakElement = document.querySelector('.user-streak');
    if (!userStreakElement) return;
    
    // Get streak from localStorage or utility function if available
    let streak = 0;
    
    if (typeof checkStreak === 'function') {
        streak = checkStreak();
    } else {
        streak = parseInt(localStorage.getItem('userStreak') || '0');
    }
    
    userStreakElement.textContent = ` ${streak} Day Streak`;
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Add a notification about the chatbot
document.addEventListener('DOMContentLoaded', function() {
    // Wait for everything to load
    setTimeout(function() {
        // Check if chatbot elements exist
        const chatbotToggle = document.querySelector('.chatbot-toggle');
        const chatbotContainer = document.querySelector('.chatbot-container');
        
        if (chatbotToggle && chatbotContainer) {
            console.log('Chatbot elements found in DOM');
            
            // Create a notification to inform the user about the chatbot
            const notification = document.createElement('div');
            notification.className = 'notification success show';
            notification.innerHTML = `
                <div class="notification-icon">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="notification-content">
                    <p>Need help? Click the chat icon in the bottom right corner!</p>
                </div>
                <div class="notification-close">
                    <i class="fas fa-times"></i>
                </div>
            `;
            
            // Create container if it doesn't exist
            let notificationContainer = document.querySelector('.notification-container');
            if (!notificationContainer) {
                notificationContainer = document.createElement('div');
                notificationContainer.className = 'notification-container';
                document.body.appendChild(notificationContainer);
            }
            
            // Add notification
            notificationContainer.appendChild(notification);
            
            // Add close button functionality
            const closeBtn = notification.querySelector('.notification-close');
            closeBtn.addEventListener('click', function() {
                notification.classList.add('fade-out');
                setTimeout(function() {
                    notification.remove();
                    
                    // Remove container if empty
                    if (notificationContainer.children.length === 0) {
                        notificationContainer.remove();
                    }
                }, 300);
            });
            
            // Auto-remove after 5 seconds
            setTimeout(function() {
                if (notification.parentNode) {
                    notification.classList.add('fade-out');
                    setTimeout(function() {
                        notification.remove();
                        
                        // Remove container if empty
                        if (notificationContainer.children.length === 0) {
                            notificationContainer.remove();
                        }
                    }, 300);
                }
            }, 5000);
            
            // Make sure the chatbot toggle is visible by adding a specific style
            chatbotToggle.style.display = 'flex';
            chatbotToggle.style.visibility = 'visible';
            chatbotToggle.style.opacity = '1';
        } else {
            console.error('Chatbot elements not found in DOM');
        }
    }, 1000);
});