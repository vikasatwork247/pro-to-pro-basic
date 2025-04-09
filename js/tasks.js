// Tasks Management JavaScript

// DOM Elements
const tasksContainer = document.querySelector('.tasks-container');
const addTaskBtn = document.querySelector('.add-task-btn');
const taskModal = document.getElementById('task-modal');
const taskForm = document.getElementById('task-form');
const modalTitle = document.getElementById('modal-title');
const closeModal = document.querySelector('.close-modal');
const cancelBtn = document.querySelector('.cancel-btn');
const filterBtns = document.querySelectorAll('.filter-btn');

// Tasks State
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let editingTaskId = null;

// Initialize Tasks
function initTasks() {
    renderTasks();
    initTaskEventListeners();
    
    // Apply productivity techniques
    applyProductivityTechniques();
}

// Event Listeners
function initTaskEventListeners() {
    // Add task button
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => {
            openTaskModal();
        });
    }
    
    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', closeTaskModal);
    }
    
    // Cancel button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeTaskModal);
    }
    
    // Save task
    if (taskForm) {
        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveTask();
        });
    }
    
    // Filter buttons
    if (filterBtns) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                setActiveFilter(filter);
                filterTasks();
            });
        });
    }
    
    // Enable drag and drop
    enableDragAndDrop();
    
    // Add batch button event listener
    const batchBtn = document.querySelector('.batch-btn');
    if (batchBtn) {
        batchBtn.addEventListener('click', openBatchModal);
    }
    
    // Add GTD inbox button event listener
    const inboxBtn = document.querySelector('.inbox-btn');
    if (inboxBtn) {
        inboxBtn.addEventListener('click', openInboxModal);
    }
}

// Open Task Modal
function openTaskModal(taskId = null) {
    if (!taskModal) return;
    
    // Reset form
    taskForm.reset();
    document.getElementById('task-id').value = '';
    modalTitle.textContent = 'Add New Task';
    
    // If editing existing task
    if (taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            modalTitle.textContent = 'Edit Task';
            document.getElementById('task-id').value = taskId;
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-description').value = task.description || '';
            document.getElementById('estimated-time').value = task.estimatedTime || 25;
            document.getElementById('task-priority').value = task.priority || 'medium';
            document.getElementById('task-category').value = task.category || 'other';
            document.getElementById('task-impact').value = task.impact || 'medium';
            document.getElementById('task-difficulty').value = task.difficulty || 'medium';
            document.getElementById('task-batch').value = task.batch || '';
        }
    }
    
    // Show modal
    taskModal.classList.add('active');
    document.getElementById('task-title').focus();
}

// Close Task Modal
function closeTaskModal() {
    if (!taskModal) return;
    taskModal.classList.remove('active');
    taskForm.reset();
    document.getElementById('task-id').value = '';
}

// Save Task
function saveTask() {
    const taskTitle = document.getElementById('task-title').value.trim();
    if (!taskTitle) {
        showNotification('Error', 'Task title is required', 'error');
        return;
    }
    
    const taskId = document.getElementById('task-id').value || generateId();
    const isNewTask = !document.getElementById('task-id').value;
    
    const task = {
        id: taskId,
        title: taskTitle,
        description: document.getElementById('task-description').value.trim(),
        estimatedTime: parseInt(document.getElementById('estimated-time').value) || 25,
        priority: document.getElementById('task-priority').value,
        category: document.getElementById('task-category').value,
        impact: document.getElementById('task-impact').value,
        difficulty: document.getElementById('task-difficulty').value,
        batch: document.getElementById('task-batch').value,
        completed: false,
        createdAt: isNewTask ? new Date().toISOString() : tasks.find(t => t.id === taskId).createdAt,
        updatedAt: new Date().toISOString()
    };
    
    // Add or update task
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
        tasks.unshift(task); // Add new task at the beginning
        // Check for first task badge
        if (tasks.length === 1) {
            unlockBadge('first-step');
        }
    } else {
        tasks[taskIndex] = task;
    }
    
    // Save to localStorage
    saveTasks();
    
    // Close modal and render tasks
    closeTaskModal();
    renderTasks();
    
    // Show notification
    showNotification(
        isNewTask ? 'Task Created' : 'Task Updated',
        `"${task.title}" has been ${isNewTask ? 'created' : 'updated'}`,
        'success'
    );
    
    // Check for achievements
    checkCompletionAchievements();
}

// Toggle Task Completion
function toggleTaskCompletion(taskId) {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    
    const task = tasks[taskIndex];
    task.completed = !task.completed;
    task.updatedAt = new Date().toISOString();
    
    // Update task in array
    tasks[taskIndex] = task;
    
    // Save to localStorage
    saveTasks();
    
    // Update UI
    const taskElement = document.querySelector(`.task-item[data-id="${taskId}"]`);
    if (taskElement) {
        if (task.completed) {
            taskElement.classList.add('completed');
            // Animate completion
            const checkmark = taskElement.querySelector('.checkmark');
            animateTaskComplete(taskElement, checkmark);
        } else {
            taskElement.classList.remove('completed');
            // Remove strike-through with animation
            anime({
                targets: taskElement.querySelector('.task-title'),
                textDecoration: 'none',
                opacity: 1,
                duration: 400,
                easing: 'easeOutSine'
            });
        }
    }
    
    // Show notification
    showNotification(
        task.completed ? 'Task Completed' : 'Task Reopened',
        `"${task.title}" has been marked as ${task.completed ? 'completed' : 'pending'}`,
        task.completed ? 'success' : 'info'
    );
    
    // Check for achievements
    checkCompletionAchievements();
    
    // Update analytics
    updateTaskAnalytics();
}

// Check completion achievements
function checkCompletionAchievements() {
    // Get completed tasks
    const completedTasks = tasks.filter(t => t.completed);
    
    // Task count achievements
    if (completedTasks.length >= 1) unlockBadge('first-step');
    if (completedTasks.length >= 5) unlockBadge('task-starter');
    if (completedTasks.length >= 25) unlockBadge('productivity-pro');
    if (completedTasks.length >= 100) unlockBadge('master-executor');
    
    // Time-based achievements
    const now = new Date();
    const hour = now.getHours();
    
    if (hour < 9) unlockBadge('early-bird');
    if (hour >= 22) unlockBadge('night-owl');
    
    // Priority achievements
    const hasHighPriorityCompleted = completedTasks.some(t => t.priority === 'high');
    if (hasHighPriorityCompleted) unlockBadge('no-more-excuses');
    
    // Weekly deadline achievement
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    
    const allWeeklyDeadlinesMet = tasks.every(t => {
        if (!t.deadline) return true;
        const deadlineDate = new Date(t.deadline);
        return !(deadlineDate >= weekStart && deadlineDate <= weekEnd) || t.completed;
    });
    
    if (allWeeklyDeadlinesMet) unlockBadge('deadline-dominator');
}

// Render Tasks
function renderTasks() {
    if (!tasksContainer) return;
    
    // Filter tasks based on current filter
    const filteredTasks = filterTasks();
    
    // Clear container
    tasksContainer.innerHTML = '';
    
    // Check if there are tasks to display
    if (filteredTasks.length === 0) {
        tasksContainer.innerHTML = getEmptyStateMessage();
        return;
    }
    
    // Create task elements
    filteredTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        tasksContainer.appendChild(taskElement);
        
        // Animate task entry
        animateTaskAdd(taskElement);
        
        // Apply urgent animation if task is high priority and not completed
        if (task.priority === 'high' && !task.completed) {
            animateUrgentTask(taskElement);
        }
    });
}

// Create Task Element
function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task-item');
    taskElement.setAttribute('data-id', task.id);
    taskElement.setAttribute('draggable', 'true');
    
    // Add classes based on task properties
    if (task.completed) {
        taskElement.classList.add('completed');
    }
    
    if (task.priority === 'high') {
        taskElement.classList.add('high-priority');
    }
    
    if (task.impact === 'high') {
        taskElement.classList.add('high-impact');
    }
    
    if (task.isInbox) {
        taskElement.classList.add('inbox');
    }
    
    if (task.batch) {
        taskElement.classList.add('batched');
    }
    
    // Determine if this is an "eat the frog" task
    const isEatTheFrog = task.priority === 'high' && task.difficulty === 'high' && !task.completed;
    if (isEatTheFrog) {
        taskElement.classList.add('eat-the-frog');
    }
    
    // Create task content
    taskElement.innerHTML = `
        <div class="task-header">
            <div class="task-checkbox">
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span class="checkmark"><i class="fas fa-check"></i></span>
            </div>
            <div class="task-content">
                <h3 class="task-title">${task.title}</h3>
                ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
            </div>
        </div>
        <div class="task-footer">
            <div class="task-meta">
                <span class="task-time"><i class="fas fa-clock"></i> ${task.estimatedTime} min</span>
                <span class="task-category"><i class="fas fa-tag"></i> ${task.category}</span>
                <span class="task-priority ${task.priority}"><i class="fas fa-flag"></i> ${task.priority}</span>
                ${task.impact === 'high' ? '<span class="task-impact"><i class="fas fa-bolt"></i> High Impact</span>' : ''}
                ${task.batch ? `<span class="task-batch"><i class="fas fa-layer-group"></i> ${task.batch}</span>` : ''}
                ${isEatTheFrog ? '<span class="task-frog"><i class="fas fa-frog"></i> Eat The Frog</span>' : ''}
            </div>
            <div class="task-actions">
                <button class="task-edit-btn"><i class="fas fa-edit"></i></button>
                <button class="task-delete-btn"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `;
    
    // Add event listeners
    const checkbox = taskElement.querySelector('.task-checkbox');
    checkbox.addEventListener('click', () => {
        toggleTaskCompletion(task.id);
    });
    
    const editBtn = taskElement.querySelector('.task-edit-btn');
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openTaskModal(task.id);
    });
    
    const deleteBtn = taskElement.querySelector('.task-delete-btn');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTask(task.id);
    });
    
    // Add drag event listeners
    taskElement.addEventListener('dragstart', handleDragStart);
    taskElement.addEventListener('dragend', handleDragEnd);
    
    return taskElement;
}

// Delete Task
function deleteTask(taskId) {
    const taskElement = document.querySelector(`.task-item[data-id="${taskId}"]`);
    
    if (taskElement) {
        // Animate task deletion
        animateTaskDelete(taskElement).then(() => {
            // Remove task from array
            tasks = tasks.filter(t => t.id !== taskId);
            
            // Save to localStorage
            saveTasks();
            
            // Update UI
            renderTasks();
            
            // Show notification
            showNotification('Task Deleted', 'Task has been deleted', 'info');
        });
    }
}

// Handle Drop
function handleDrop(e) {
    e.preventDefault();
    
    const draggedId = e.dataTransfer.getData('text/plain');
    const draggedElement = document.querySelector(`.task-item[data-id="${draggedId}"]`);
    
    if (!draggedElement) return;
    
    const afterElement = getDragAfterElement(tasksContainer, e.clientY);
    
    if (afterElement) {
        tasksContainer.insertBefore(draggedElement, afterElement);
    } else {
        tasksContainer.appendChild(draggedElement);
    }
    
    // Update tasks array order
    const newOrder = Array.from(tasksContainer.querySelectorAll('.task-item')).map(item => {
        return item.getAttribute('data-id');
    });
    
    // Reorder tasks array
    const newTasks = [];
    newOrder.forEach(id => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            newTasks.push(task);
        }
    });
    
    tasks = newTasks;
    saveTasks();
    
    // Animate the reordering
    const taskElements = document.querySelectorAll('.task-item');
    anime({
        targets: taskElements,
        translateX: [10, 0],
        opacity: [0.8, 1],
        delay: anime.stagger(50),
        duration: 400,
        easing: 'easeOutSine'
    });
}

// Save to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Filter tasks based on current filter
function filterTasks() {
    switch (currentFilter) {
        case 'pending':
            return tasks.filter(task => !task.completed);
        case 'completed':
            return tasks.filter(task => task.completed);
        case 'priority':
            return tasks.filter(task => task.priority === 'high');
        case 'high-impact':
            return tasks.filter(task => task.impact === 'high');
        case 'eat-the-frog':
            return tasks.filter(task => task.priority === 'high' && task.difficulty === 'high' && !task.completed);
        case 'batch':
            return tasks.filter(task => task.batch && task.batch.trim() !== '');
        case 'inbox':
            return tasks.filter(task => task.isInbox);
        default:
            return [...tasks];
    }
}

// Set active filter
function setActiveFilter(filter) {
    currentFilter = filter;
    
    // Update UI
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelector(`.filter-btn[data-filter="${filter}"]`).classList.add('active');
}

// Get empty state message
function getEmptyStateMessage() {
    let message = '';
    
    switch (currentFilter) {
        case 'pending':
            message = 'No pending tasks. Great job!';
            break;
        case 'completed':
            message = 'No completed tasks yet. Start small!';
            break;
        case 'priority':
            message = 'No high priority tasks. Add some important tasks!';
            break;
        case 'high-impact':
            message = 'No high impact tasks. Add tasks that will make a difference!';
            break;
        case 'eat-the-frog':
            message = 'No "eat the frog" tasks. Add challenging high-priority tasks!';
            break;
        case 'batch':
            message = 'No batched tasks. Group similar tasks for efficiency!';
            break;
        case 'inbox':
            message = 'Your inbox is empty. Capture quick thoughts here!';
            break;
        default:
            message = 'No tasks yet. Add your first task to get started!';
    }
    
    return `
        <div class="empty-state">
            <img src="assets/images/empty-tasks.svg" alt="No tasks">
            <h3>${message}</h3>
            <p>Click the "New Task" button to add a task.</p>
        </div>
    `;
}

// Handle drag start
function handleDragStart(e) {
    this.classList.add('dragging');
}

// Handle drag end
function handleDragEnd() {
    this.classList.remove('dragging');
}

// Handle drop
function handleDrop(e) {
    e.preventDefault();
    // Implementation can be added later if needed
}

// Unlock badge
function unlockBadge(badgeId) {
    // Get existing badges
    const earnedBadges = JSON.parse(localStorage.getItem('earnedBadges')) || [];
    
    // Check if badge is already earned
    if (!earnedBadges.includes(badgeId)) {
        // Add new badge
        earnedBadges.push(badgeId);
        
        // Save to localStorage
        localStorage.setItem('earnedBadges', JSON.stringify(earnedBadges));
        
        // Show badge notification
        const badge = badgeDefinitions[badgeId];
        if (badge) {
            showBadgeNotification(badgeId);
        }
        
        // Update analytics if needed
        updateTaskAnalytics();
    }
}

// Show badge notification
function showBadgeNotification(badgeId) {
    const badge = badgeDefinitions[badgeId];
    if (!badge) return;
    
    const notification = document.createElement('div');
    notification.className = 'badge-notification animate__animated animate__fadeInUp';
    notification.innerHTML = `
        <div class="badge-notification-content">
            <div class="badge-icon">
                <i class="fas ${badge.icon} fa-2x"></i>
            </div>
            <div class="badge-info">
                <h3>New Badge Unlocked!</h3>
                <h4>${badge.name}</h4>
                <p>${badge.description}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('animate__fadeInUp');
        notification.classList.add('animate__fadeOutDown');
        setTimeout(() => {
            notification.remove();
        }, 1000);
    }, 5000);
}

// Update task analytics
function updateTaskAnalytics() {
    // This function can be implemented later if needed
}

// Show notification
function showNotification(title, message, type = 'success') {
    // Check if notification function exists in utility.js
    if (typeof displayNotification === 'function') {
        displayNotification(message, type);
    } else {
        // Fallback notification
        alert(`${title}: ${message}`);
    }
}

// Display notification
function displayNotification(message, type = 'success') {
    const notificationArea = document.querySelector('.notification-area');
    if (!notificationArea) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="notification-content">
            <p>${message}</p>
        </div>
        <div class="notification-close">
            <i class="fas fa-times"></i>
        </div>
    `;
    
    notificationArea.appendChild(notification);
    
    // Animate notification entry
    anime({
        targets: notification,
        translateX: [100, 0],
        opacity: [0, 1],
        duration: 500,
        easing: 'easeOutExpo'
    });
    
    // Add close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        // Animate notification exit
        anime({
            targets: notification,
            translateX: [0, 100],
            opacity: [1, 0],
            duration: 500,
            easing: 'easeInOutSine',
            complete: function() {
                notification.remove();
            }
        });
    });
    
    // Auto-remove after 5 seconds
    setTimeout(function() {
        if (notification.parentNode) {
            // Animate notification exit
            anime({
                targets: notification,
                translateX: [0, 100],
                opacity: [1, 0],
                duration: 500,
                easing: 'easeInOutSine',
                complete: function() {
                    notification.remove();
                }
            });
        }
    }, 5000);
}

// Animate task addition
function animateTaskAdd(taskElement) {
    anime({
        targets: taskElement,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 400,
        easing: 'easeOutSine'
    });
}

// Animate urgent task
function animateUrgentTask(taskElement) {
    anime({
        targets: taskElement,
        scale: [1.1, 1],
        duration: 200,
        easing: 'easeInOutSine',
        loop: true
    });
}

// Animate task completion
function animateTaskComplete(taskElement, checkmark) {
    anime({
        targets: taskElement.querySelector('.task-title'),
        textDecoration: ['none', 'line-through'],
        opacity: [1, 0.5],
        duration: 400,
        easing: 'easeOutSine'
    });
    
    anime({
        targets: checkmark,
        scale: [0, 1],
        opacity: [0, 1],
        duration: 200,
        easing: 'easeOutSine'
    });
}

// Animate task deletion
function animateTaskDelete(taskElement) {
    return new Promise(resolve => {
        anime({
            targets: taskElement,
            opacity: [1, 0],
            translateY: [0, -20],
            duration: 400,
            easing: 'easeInOutSine',
            complete: function() {
                resolve();
            }
        });
    });
}

// Initialize tasks when DOM is loaded
document.addEventListener('DOMContentLoaded', initTasks);

// Export functions to window object for global access
window.openTaskModal = openTaskModal;
window.toggleTaskCompletion = toggleTaskCompletion;
window.deleteTask = deleteTask;