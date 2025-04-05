// Badges Management JavaScript

// DOM Elements
const badgesContainer = document.querySelector('.badges-container');
const badgeModal = document.getElementById('badge-modal');

// Badges State
let userBadges = JSON.parse(localStorage.getItem('userBadges')) || [];

// Badge Definitions
const badgeDefinitions = {
    // Task Badges
    'first-step': {
        id: 'first-step',
        name: 'First Step',
        description: 'Create your first task',
        icon: 'fa-shoe-prints',
        category: 'tasks',
        color: 'blue',
        decoration: 1
    },
    'task-starter': {
        id: 'task-starter',
        name: 'Task Starter',
        description: 'Complete 5 tasks',
        icon: 'fa-check',
        category: 'tasks',
        color: 'green',
        decoration: 2
    },
    'productivity-pro': {
        id: 'productivity-pro',
        name: 'Productivity Pro',
        description: 'Complete 25 tasks',
        icon: 'fa-check-double',
        category: 'tasks',
        color: 'purple',
        decoration: 3
    },
    'master-executor': {
        id: 'master-executor',
        name: 'Master Executor',
        description: 'Complete 100 tasks',
        icon: 'fa-trophy',
        category: 'tasks',
        color: 'yellow',
        decoration: 1
    },
    'early-bird': {
        id: 'early-bird',
        name: 'Early Bird',
        description: 'Complete a task before 9 AM',
        icon: 'fa-sun',
        category: 'tasks',
        color: 'orange',
        decoration: 2
    },
    'night-owl': {
        id: 'night-owl',
        name: 'Night Owl',
        description: 'Complete a task after 10 PM',
        icon: 'fa-moon',
        category: 'tasks',
        color: 'purple',
        decoration: 3
    },
    'no-more-excuses': {
        id: 'no-more-excuses',
        name: 'No More Excuses',
        description: 'Complete a high priority task',
        icon: 'fa-exclamation',
        category: 'tasks',
        color: 'red',
        decoration: 1
    },
    'deadline-dominator': {
        id: 'deadline-dominator',
        name: 'Deadline Dominator',
        description: 'Complete all tasks with deadlines for a week',
        icon: 'fa-calendar-check',
        category: 'tasks',
        color: 'teal',
        decoration: 2
    },
    
    // Diary Badges
    'first-reflection': {
        id: 'first-reflection',
        name: 'First Reflection',
        description: 'Create your first journal entry',
        icon: 'fa-book-open',
        category: 'diary',
        color: 'blue',
        decoration: 3
    },
    'reflection-enthusiast': {
        id: 'reflection-enthusiast',
        name: 'Reflection Enthusiast',
        description: 'Create 10 journal entries',
        icon: 'fa-book',
        category: 'diary',
        color: 'purple',
        decoration: 1
    },
    'reflection-master': {
        id: 'reflection-master',
        name: 'Reflection Master',
        description: 'Create 30 journal entries',
        icon: 'fa-book',
        category: 'diary',
        color: 'pink',
        decoration: 2
    },
    'reflection-streak-3': {
        id: 'reflection-streak-3',
        name: 'Consistent Reflection',
        description: 'Journal for 3 consecutive days',
        icon: 'fa-calendar-day',
        category: 'diary',
        color: 'green',
        decoration: 3
    },
    'reflection-streak-7': {
        id: 'reflection-streak-7',
        name: 'Weekly Reflection',
        description: 'Journal for 7 consecutive days',
        icon: 'fa-calendar-week',
        category: 'diary',
        color: 'teal',
        decoration: 1
    },
    'reflection-streak-30': {
        id: 'reflection-streak-30',
        name: 'Monthly Reflection',
        description: 'Journal for 30 consecutive days',
        icon: 'fa-calendar-alt',
        category: 'diary',
        color: 'yellow',
        decoration: 2
    },
    
    // Pomodoro Badges
    'first-pomodoro': {
        id: 'first-pomodoro',
        name: 'First Focus',
        description: 'Complete your first pomodoro session',
        icon: 'fa-hourglass-start',
        category: 'pomodoro',
        color: 'blue',
        decoration: 3
    },
    'pomodoro-enthusiast': {
        id: 'pomodoro-enthusiast',
        name: 'Focus Enthusiast',
        description: 'Complete 10 pomodoro sessions',
        icon: 'fa-hourglass-half',
        category: 'pomodoro',
        color: 'green',
        decoration: 1
    },
    'pomodoro-pro': {
        id: 'pomodoro-pro',
        name: 'Focus Pro',
        description: 'Complete 50 pomodoro sessions',
        icon: 'fa-hourglass',
        category: 'pomodoro',
        color: 'purple',
        decoration: 2
    },
    'pomodoro-master': {
        id: 'pomodoro-master',
        name: 'Focus Master',
        description: 'Complete 100 pomodoro sessions',
        icon: 'fa-hourglass-end',
        category: 'pomodoro',
        color: 'red',
        decoration: 3
    },
    'focus-novice': {
        id: 'focus-novice',
        name: 'Focus Novice',
        description: 'Accumulate 1 hour of focus time',
        icon: 'fa-stopwatch',
        category: 'pomodoro',
        color: 'blue',
        decoration: 1
    },
    'focus-adept': {
        id: 'focus-adept',
        name: 'Focus Adept',
        description: 'Accumulate 5 hours of focus time',
        icon: 'fa-stopwatch',
        category: 'pomodoro',
        color: 'teal',
        decoration: 2
    },
    'focus-master': {
        id: 'focus-master',
        name: 'Focus Master',
        description: 'Accumulate 25 hours of focus time',
        icon: 'fa-user-clock',
        category: 'pomodoro',
        color: 'orange',
        decoration: 3
    },
    'focus-legend': {
        id: 'focus-legend',
        name: 'Focus Legend',
        description: 'Accumulate 100 hours of focus time',
        icon: 'fa-clock',
        category: 'pomodoro',
        color: 'yellow',
        decoration: 1
    },
    
    // Chatbot Interaction Badges
    'chatbot-hello': {
        id: 'chatbot-hello',
        name: 'Digital Hello',
        description: 'Started your first conversation with the AI assistant',
        icon: 'fa-comment-dots',
        category: 'chatbot',
        color: 'blue',
        decoration: 2
    },
    'chatbot-enthusiast': {
        id: 'chatbot-enthusiast',
        name: 'Conversation Enthusiast',
        description: 'Had 10 conversations with the AI assistant',
        icon: 'fa-comments',
        category: 'chatbot',
        color: 'purple',
        decoration: 3
    },
    'deep-conversation': {
        id: 'deep-conversation',
        name: 'Deep Conversation',
        description: 'Had a conversation with 5+ exchanges in one session',
        icon: 'fa-comment-alt',
        category: 'chatbot',
        color: 'teal',
        decoration: 1
    },
    'productivity-seeker': {
        id: 'productivity-seeker',
        name: 'Productivity Seeker',
        description: 'Asked for productivity advice 5 times',
        icon: 'fa-lightbulb',
        category: 'chatbot',
        color: 'yellow',
        decoration: 2
    },
    'motivation-boost': {
        id: 'motivation-boost',
        name: 'Motivation Boost',
        description: 'Asked for motivation quotes 3 times',
        icon: 'fa-quote-right',
        category: 'chatbot',
        color: 'orange',
        decoration: 3
    }
};

// Initialize Badges
function initBadges() {
    renderBadges();
    initBadgeEventListeners();
}

// Event Listeners
function initBadgeEventListeners() {
    // Close badge modal if it exists
    const closeModal = document.querySelector('.close-badge-modal');
    if (closeModal && badgeModal) {
        closeModal.addEventListener('click', () => {
            badgeModal.classList.remove('active');
        });
    }
    
    // Filter badges if filters exist
    const badgeFilters = document.querySelectorAll('.badge-filter');
    if (badgeFilters.length > 0) {
        badgeFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                const category = filter.getAttribute('data-category');
                filterBadges(category);
                
                // Update active filter
                badgeFilters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');
            });
        });
    }
}

// Render Badges
function renderBadges() {
    if (!badgesContainer) return;
    
    // Clear container
    badgesContainer.innerHTML = '';
    
    // Get all badge definitions
    const allBadges = Object.values(badgeDefinitions);
    
    // Render each badge
    allBadges.forEach(badge => {
        const isUnlocked = userBadges.includes(badge.id);
        const badgeElement = createBadgeElement(badge, isUnlocked);
        badgesContainer.appendChild(badgeElement);
    });
}

// Create Badge Element
function createBadgeElement(badge, isUnlocked) {
    const badgeElement = document.createElement('div');
    badgeElement.className = `badge-card badge-${badge.color} ${isUnlocked ? 'unlocked' : 'locked'}`;
    badgeElement.setAttribute('data-id', badge.id);
    badgeElement.setAttribute('data-category', badge.category);
    
    badgeElement.innerHTML = `
        <div class="badge-icon-container">
            <img src="assets/images/badge-decoration-${badge.decoration}.svg" class="badge-decoration" alt="Badge decoration">
            <div class="badge-circle">
                <i class="fas ${badge.icon}"></i>
            </div>
            <div class="badge-status">
                ${isUnlocked ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-lock"></i>'}
            </div>
        </div>
        <div class="badge-info">
            <h3 class="badge-name">${badge.name}</h3>
            <p class="badge-description">${badge.description}</p>
        </div>
    `;
    
    // Add click event to show badge details
    badgeElement.addEventListener('click', () => {
        showBadgeDetails(badge, isUnlocked);
    });
    
    return badgeElement;
}

// Show Badge Details
function showBadgeDetails(badge, isUnlocked) {
    // Create modal if it doesn't exist
    if (!document.getElementById('badge-detail-modal')) {
        const modalElement = document.createElement('div');
        modalElement.id = 'badge-detail-modal';
        modalElement.className = 'badge-modal';
        
        modalElement.innerHTML = `
            <div class="badge-modal-content">
                <span class="close-badge-modal">&times;</span>
                <div class="badge-modal-icon">
                    <img src="" class="badge-decoration" alt="Badge decoration">
                    <div class="badge-circle">
                        <i class=""></i>
                    </div>
                </div>
                <div class="badge-modal-info">
                    <h2 class="badge-modal-name"></h2>
                    <p class="badge-modal-description"></p>
                    <p class="badge-modal-date"></p>
                </div>
                <div class="badge-modal-actions">
                    <button class="badge-modal-btn close-btn">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalElement);
        
        // Add event listeners
        const closeBtn = modalElement.querySelector('.close-badge-modal');
        const closeBtnAction = modalElement.querySelector('.close-btn');
        
        closeBtn.addEventListener('click', () => {
            modalElement.classList.remove('active');
        });
        
        closeBtnAction.addEventListener('click', () => {
            modalElement.classList.remove('active');
        });
    }
    
    // Update modal content
    const modal = document.getElementById('badge-detail-modal');
    const badgeCircle = modal.querySelector('.badge-circle');
    const badgeIcon = modal.querySelector('.badge-circle i');
    const badgeName = modal.querySelector('.badge-modal-name');
    const badgeDescription = modal.querySelector('.badge-modal-description');
    const badgeDate = modal.querySelector('.badge-modal-date');
    const badgeDecoration = modal.querySelector('.badge-decoration');
    
    // Set badge color
    badgeCircle.className = 'badge-circle';
    badgeCircle.classList.add(`badge-${badge.color}`);
    
    // Set badge icon
    badgeIcon.className = `fas ${badge.icon}`;
    
    // Set badge decoration
    badgeDecoration.src = `assets/images/badge-decoration-${badge.decoration}.svg`;
    
    // Set badge info
    badgeName.textContent = badge.name;
    badgeDescription.textContent = badge.description;
    
    // Set unlock date if unlocked
    if (isUnlocked) {
        const unlockDate = getUserBadgeDate(badge.id);
        badgeDate.textContent = `Unlocked on ${formatDate(unlockDate)}`;
        badgeDate.style.display = 'block';
        badgeCircle.classList.add('unlocked');
    } else {
        badgeDate.style.display = 'none';
        badgeCircle.classList.add('locked');
    }
    
    // Show modal
    modal.classList.add('active');
}

// Filter Badges
function filterBadges(category) {
    if (!badgesContainer) return;
    
    const badges = badgesContainer.querySelectorAll('.badge-card');
    
    badges.forEach(badge => {
        if (category === 'all' || badge.getAttribute('data-category') === category) {
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    });
}

// Unlock Badge
function unlockBadge(badgeId) {
    // Check if badge exists in definitions
    if (!badgeDefinitions[badgeId]) return;
    
    // Check if badge is already unlocked
    if (userBadges.includes(badgeId)) return;
    
    // Add badge to user badges
    userBadges.push(badgeId);
    
    // Save to localStorage
    localStorage.setItem('userBadges', JSON.stringify(userBadges));
    
    // Show notification
    showBadgeNotification(badgeId);
    
    // Update badges display
    renderBadges();
}

// Show Badge Notification
function showBadgeNotification(badgeId) {
    const badge = badgeDefinitions[badgeId];
    if (!badge) return;
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'badge-notification';
    
    notification.innerHTML = `
        <div class="badge-notification-icon">
            <img src="assets/images/badge-decoration-${badge.decoration}.svg" class="badge-decoration" alt="Badge decoration">
            <div class="badge-circle badge-${badge.color}">
                <i class="fas ${badge.icon}"></i>
            </div>
        </div>
        <div class="badge-notification-content">
            <h3 class="badge-notification-title">Badge Unlocked!</h3>
            <p class="badge-notification-message">You've earned the "${badge.name}" badge</p>
        </div>
        <div class="badge-notification-close">
            <i class="fas fa-times"></i>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add close button event listener
    const closeBtn = notification.querySelector('.badge-notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
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
    
    // Play sound
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3');
    audio.volume = 0.5;
    audio.play();
}

// Get User Badge Unlock Date
function getUserBadgeDate(badgeId) {
    const badge = userBadges.find(b => b.id === badgeId);
    if (!badge || !badge.unlockedAt) return 'Unknown date';
    
    return new Date(badge.unlockedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Get Badge Progress
function getBadgeProgress() {
    const totalBadges = Object.keys(badgeDefinitions).length;
    const unlockedBadges = userBadges.length;
    
    return {
        total: totalBadges,
        unlocked: unlockedBadges,
        percentage: Math.round((unlockedBadges / totalBadges) * 100)
    };
}

// Initialize badges when DOM is loaded
document.addEventListener('DOMContentLoaded', initBadges);