// Simple Penzu-like Journal Interface

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const diaryContainer = document.querySelector('.diary-container');
    const newEntryBtn = document.querySelector('.new-entry-btn');
    const newEntrySidebarBtn = document.querySelector('.new-entry-sidebar-btn');
    const viewAllBtn = document.querySelector('.view-all-btn');
    const starredBtn = document.querySelector('.starred-btn');
    const journalEditor = document.querySelector('.journal-editor');
    const journalEditorContainer = document.querySelector('.journal-editor-container');
    const editorBody = document.querySelector('.editor-body');
    const entryTitle = document.getElementById('entry-title');
    const entryDate = document.getElementById('entry-date');
    const saveBtn = document.querySelector('.save-btn');
    const cancelBtn = document.querySelector('.cancel-btn');
    const saveNowBtn = document.querySelector('.save-now-btn');
    const saveStatus = document.querySelector('.save-status');
    const diaryEntries = document.querySelector('.diary-entries');
    const diarySearch = document.querySelector('.diary-search input');
    const wordCounter = document.getElementById('word-counter');
    const starBtn = document.querySelector('.star-btn');
    const lockBtn = document.querySelector('.lock-btn');
    const entryView = document.querySelector('.entry-view');
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const backgroundOptions = document.querySelectorAll('.background-option');
    const toolbarButtons = document.querySelectorAll('.editor-toolbar button');
    const emptyDiary = document.querySelector('.empty-diary');

    // Journal State
    let entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    let editingEntryId = null;
    let viewMode = 'all';
    let autoSaveTimer = null;
    let currentBackground = localStorage.getItem('currentBackground') || 'plain-white';
    let typingAnimation = null;

    // Initialize Journal
    function init() {
        console.log('Initializing journal...');
        
        // Set up event listeners
        setupEventListeners();
        
        // Load entries
        loadEntries();
        
        // Update current date
        updateCurrentDate();
        
        // Set default background
        if (journalEditor) {
            journalEditor.setAttribute('data-bg', currentBackground);
            
            // Mark the default background as active
            const defaultBgOption = document.querySelector(`.background-option[data-bg="${currentBackground}"]`);
            if (defaultBgOption) {
                defaultBgOption.classList.add('active');
            }
        }
        
        console.log('Journal initialized');
    }

    // Set up event listeners
    function setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // New Entry Button
        if (newEntryBtn) {
            newEntryBtn.addEventListener('click', function() {
                createNewJournalEntry();
            });
            console.log('New Entry button listener added');
        } else {
            console.error('New Entry button not found');
        }
        
        // New Entry Sidebar Button
        if (newEntrySidebarBtn) {
            newEntrySidebarBtn.addEventListener('click', function() {
                createNewJournalEntry();
            });
            console.log('New Entry sidebar button listener added');
        }
        
        // View All Entries Button
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', function() {
                viewMode = 'all';
                loadEntries();
            });
        }
        
        // Starred Entries Button
        if (starredBtn) {
            starredBtn.addEventListener('click', function() {
                viewMode = 'starred';
                loadEntries();
            });
        }
        
        // Star Button
        if (starBtn) {
            starBtn.addEventListener('click', function() {
                toggleStarEntry();
            });
        }
        
        // Lock Button
        if (lockBtn) {
            lockBtn.addEventListener('click', function() {
                toggleLockEntry();
            });
        }
        
        // Save Button
        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                console.log('Save button clicked');
                saveEntry();
            });
            console.log('Save button listener added');
        } else {
            console.error('Save button not found');
        }
        
        // Save Now Button
        if (saveNowBtn) {
            saveNowBtn.addEventListener('click', function() {
                console.log('Save Now button clicked');
                saveEntry();
                updateSaveStatus(true);
            });
            console.log('Save Now button listener added');
        } else {
            console.error('Save Now button not found');
        }
        
        // Cancel Button
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                cancelEntry();
            });
        }
        
        // Journal Search
        if (diarySearch) {
            diarySearch.addEventListener('input', function() {
                searchEntries();
            });
        }
        
        // Word Counter
        if (editorBody) {
            editorBody.addEventListener('input', function() {
                updateWordCount();
                
                // Auto-save
                if (autoSaveTimer) {
                    clearTimeout(autoSaveTimer);
                }
                
                autoSaveTimer = setTimeout(function() {
                    if (entryTitle.value.trim() || editorBody.innerHTML.trim()) {
                        saveEntry(true);
                        updateSaveStatus(true);
                    }
                }, 5000);
            });
        }
        
        // Title input auto-save
        if (entryTitle) {
            entryTitle.addEventListener('input', function() {
                if (autoSaveTimer) {
                    clearTimeout(autoSaveTimer);
                }
                
                autoSaveTimer = setTimeout(function() {
                    if (entryTitle.value.trim() || editorBody.innerHTML.trim()) {
                        saveEntry(true);
                        updateSaveStatus(true);
                    }
                }, 5000);
            });
        }
        
        // Tabs
        if (tabs.length > 0) {
            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const tabName = this.getAttribute('data-tab');
                    
                    // Update active tab
                    tabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Show corresponding content
                    tabContents.forEach(content => {
                        content.classList.remove('active');
                        if (content.classList.contains(`${tabName}-content`)) {
                            content.classList.add('active');
                        }
                    });
                });
            });
        }
        
        // Background Options
        if (backgroundOptions.length > 0) {
            backgroundOptions.forEach(option => {
                option.addEventListener('click', function() {
                    const bg = this.getAttribute('data-bg');
                    
                    // Update active background
                    backgroundOptions.forEach(opt => opt.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Apply background to editor
                    journalEditor.setAttribute('data-bg', bg);
                    currentBackground = bg;
                    localStorage.setItem('currentBackground', bg);
                });
            });
        }
        
        // Editor Toolbar Buttons
        if (toolbarButtons) {
            toolbarButtons.forEach(button => {
                if (button.dataset.command) {
                    button.addEventListener('click', function() {
                        document.execCommand(this.dataset.command, false, null);
                        editorBody.focus();
                    });
                }
            });
        }
        
        console.log('Event listeners setup complete');
    }

    // Create New Entry
    function createNewJournalEntry() {
        console.log('Creating new journal entry...');
        
        // Hide entry view if visible
        if (entryView) {
            entryView.style.display = 'none';
        }
        
        // Show editor
        if (journalEditorContainer) {
            journalEditorContainer.style.display = 'block';
            
            // Animate editor appearance
            anime({
                targets: journalEditorContainer,
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 800,
                easing: 'easeOutExpo'
            });
        }
        
        // Reset form
        if (entryTitle) {
            entryTitle.value = '';
            
            // Focus on title with slight delay for animation
            setTimeout(() => {
                entryTitle.focus();
            }, 300);
        }
        
        if (editorBody) {
            editorBody.innerHTML = '';
        }
        
        // Reset state
        editingEntryId = null;
        
        // Update date
        updateCurrentDate();
        
        // Update word count
        updateWordCount();
        
        // Reset star and lock buttons
        if (starBtn) {
            starBtn.innerHTML = '<i class="far fa-star"></i>';
            starBtn.setAttribute('data-starred', 'false');
        }
        
        if (lockBtn) {
            lockBtn.innerHTML = '<i class="fas fa-lock-open"></i>';
            lockBtn.setAttribute('data-locked', 'false');
        }
        
        // Show save button
        if (saveBtn) {
            saveBtn.style.display = 'inline-block';
        }
        
        // Update save status
        updateSaveStatus();
        
        // Animate cursor to indicate typing is possible
        if (editorBody) {
            // Add a blinking cursor element
            const cursor = document.createElement('span');
            cursor.className = 'typing-cursor';
            cursor.innerHTML = '|';
            editorBody.appendChild(cursor);
            
            // Animate the cursor
            anime({
                targets: '.typing-cursor',
                opacity: [1, 0],
                duration: 800,
                easing: 'easeInOutSine',
                loop: true
            });
        }
    }

    // Save Entry
    function saveEntry(isAutoSave = false) {
        console.log('Saving entry...');
        
        if (!entryTitle || !editorBody) {
            console.error('Entry title or body element not found');
            return;
        }
        
        const title = entryTitle.value.trim();
        const content = editorBody.innerHTML.trim();
        
        if (!title && !content) {
            console.log('Empty entry, not saving');
            return;
        }
        
        const now = new Date();
        const isStarred = starBtn && starBtn.getAttribute('data-starred') === 'true';
        const isLocked = lockBtn && lockBtn.getAttribute('data-locked') === 'true';
        
        if (editingEntryId) {
            // Update existing entry
            const entryIndex = entries.findIndex(entry => entry.id === editingEntryId);
            
            if (entryIndex !== -1) {
                entries[entryIndex] = {
                    ...entries[entryIndex],
                    title,
                    content,
                    updatedAt: now.toISOString(),
                    isStarred,
                    isLocked
                };
                
                if (!isAutoSave) {
                    displayNotification('Journal entry updated successfully', 'success');
                }
            }
        } else {
            // Create new entry
            const newEntry = {
                id: generateId(),
                title,
                content,
                createdAt: now.toISOString(),
                updatedAt: now.toISOString(),
                isStarred,
                isLocked
            };
            
            entries.unshift(newEntry);
            
            if (!isAutoSave) {
                displayNotification('Journal entry saved successfully', 'success');
            }
        }
        
        // Save to localStorage
        localStorage.setItem('journalEntries', JSON.stringify(entries));
        
        // Reload entries if not auto-save
        if (!isAutoSave) {
            loadEntries();
            
            // Hide editor
            if (journalEditorContainer) {
                // Animate editor exit
                anime({
                    targets: journalEditorContainer,
                    opacity: [1, 0],
                    translateY: [0, 20],
                    duration: 600,
                    easing: 'easeInOutSine',
                    complete: function() {
                        journalEditorContainer.style.display = 'none';
                    }
                });
            }
        }
        
        console.log('Entry saved');
    }

    // Cancel Entry
    function cancelEntry() {
        console.log('Cancelling entry...');
        
        // Animate editor exit
        if (journalEditorContainer) {
            anime({
                targets: journalEditorContainer,
                opacity: [1, 0],
                translateY: [0, 20],
                duration: 600,
                easing: 'easeInOutSine',
                complete: function() {
                    journalEditorContainer.style.display = 'none';
                }
            });
        }
    }

    // View Entry
    function viewEntry(entryId) {
        console.log('Viewing entry:', entryId);
        
        const entry = entries.find(e => e.id === entryId);
        
        if (!entry) {
            console.error('Entry not found:', entryId);
            return;
        }
        
        // Hide editor
        if (journalEditorContainer) {
            journalEditorContainer.style.display = 'none';
        }
        
        // Show entry view
        if (entryView) {
            entryView.style.display = 'block';
            
            // Create entry view content
            const createdDate = new Date(entry.createdAt);
            const formattedDate = createdDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            entryView.innerHTML = `
                <div class="entry-view-header">
                    <h2 class="entry-view-title">${entry.title}</h2>
                    <div class="entry-view-date">${formattedDate}</div>
                    <div class="entry-view-actions">
                        <button class="entry-view-edit" onclick="editEntrySimple('${entry.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="entry-view-delete" onclick="deleteEntrySimple('${entry.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                        <button class="entry-view-back" onclick="hideEntryView()">
                            <i class="fas fa-arrow-left"></i> Back
                        </button>
                    </div>
                </div>
                <div class="entry-view-content">${entry.content}</div>
            `;
            
            // Animate entry view appearance
            anime({
                targets: entryView,
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 800,
                easing: 'easeOutExpo'
            });
            
            // Animate the title with a typing effect
            const title = entryView.querySelector('.entry-view-title');
            if (title) {
                const titleText = title.textContent;
                title.textContent = '';
                
                // Create spans for each character
                for (let i = 0; i < titleText.length; i++) {
                    const span = document.createElement('span');
                    span.textContent = titleText[i];
                    span.style.opacity = 0;
                    title.appendChild(span);
                }
                
                // Animate each character
                anime({
                    targets: '.entry-view-title span',
                    opacity: [0, 1],
                    duration: 30,
                    delay: anime.stagger(30),
                    easing: 'linear'
                });
            }
        }
        
        // Mark entry as active in the sidebar
        const entryElements = document.querySelectorAll('.diary-entry');
        entryElements.forEach(el => {
            el.classList.remove('active');
            if (el.getAttribute('data-id') === entryId) {
                el.classList.add('active');
            }
        });
    }

    // Load Entries
    function loadEntries() {
        console.log('Loading entries...');
        
        if (!diaryEntries) {
            console.error('Diary entries container not found');
            return;
        }
        
        // Clear entries container
        diaryEntries.innerHTML = '';
        
        // Filter entries based on view mode
        let filteredEntries = entries;
        if (viewMode === 'starred') {
            filteredEntries = entries.filter(entry => entry.isStarred);
        }
        
        // Check if there are entries to display
        if (filteredEntries.length === 0) {
            if (emptyDiary) {
                emptyDiary.style.display = 'flex';
            }
            return;
        }
        
        // Hide empty state
        if (emptyDiary) {
            emptyDiary.style.display = 'none';
        }
        
        // Create entry elements
        const entryElements = [];
        filteredEntries.forEach(entry => {
            const entryElement = createEntryElement(entry);
            diaryEntries.appendChild(entryElement);
            entryElements.push(entryElement);
        });
        
        // Animate entries appearance
        anime({
            targets: entryElements,
            opacity: [0, 1],
            translateY: [20, 0],
            delay: anime.stagger(50),
            duration: 800,
            easing: 'easeOutExpo'
        });
    }

    // Create Entry Element
    function createEntryElement(entry) {
        const entryElement = document.createElement('div');
        entryElement.className = 'diary-entry';
        entryElement.setAttribute('data-id', entry.id);
        
        const createdDate = new Date(entry.createdAt);
        const formattedDate = createdDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
        
        // Extract preview text (first 100 characters)
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = entry.content;
        const previewText = tempDiv.textContent.substring(0, 100) + (tempDiv.textContent.length > 100 ? '...' : '');
        
        entryElement.innerHTML = `
            <div class="entry-date">${formattedDate}</div>
            <div class="entry-title">${entry.title || 'Untitled'}</div>
            <div class="entry-preview">${previewText}</div>
            <div class="entry-indicators">
                ${entry.isStarred ? '<span class="entry-starred"><i class="fas fa-star"></i></span>' : ''}
                ${entry.isLocked ? '<span class="entry-locked"><i class="fas fa-lock"></i></span>' : ''}
            </div>
        `;
        
        // Add click event to view entry
        entryElement.addEventListener('click', function() {
            viewEntry(entry.id);
        });
        
        // Add hover animation
        entryElement.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                translateX: [0, 5],
                boxShadow: ['0 2px 5px rgba(0,0,0,0.1)', '0 5px 15px rgba(0,0,0,0.2)'],
                duration: 300,
                easing: 'easeOutSine'
            });
        });
        
        entryElement.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                translateX: [5, 0],
                boxShadow: ['0 5px 15px rgba(0,0,0,0.2)', '0 2px 5px rgba(0,0,0,0.1)'],
                duration: 300,
                easing: 'easeOutSine'
            });
        });
        
        // Animate mood emoji if present
        const moodEmoji = entryElement.querySelector('.mood-emoji');
        if (moodEmoji) {
            anime({
                targets: moodEmoji,
                translateY: [0, -5, 0],
                duration: 3000,
                loop: true,
                direction: 'alternate',
                easing: 'easeInOutSine'
            });
        }
        
        return entryElement;
    }

    // Display Notification
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

    // Initialize the journal
    init();
});