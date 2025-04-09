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
    const calendarTitle = document.querySelector('.calendar-title');
    const calendarDays = document.querySelector('.calendar-days');
    const prevMonthBtn = document.querySelector('.prev-month');
    const nextMonthBtn = document.querySelector('.next-month');

    // Journal State
    let entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    let editingEntryId = null;
    let viewMode = 'all';
    let autoSaveTimer = null;
    let currentBackground = localStorage.getItem('currentBackground') || 'plain-white';
    let currentDate = new Date();
    let selectedDate = null;

    // Initialize Journal
    function init() {
        console.log('Initializing journal...');
        
        // Set up event listeners
        setupEventListeners();
        
        // Initialize calendar
        updateCalendar();
        
        // Load entries
        loadEntries();
        
        // Update current date
        updateCurrentDate();
        
        // Set default background
        if (journalEditor) {
            journalEditor.setAttribute('data-bg', currentBackground);
        }
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

        // Entry Date input
        if (entryDate) {
            entryDate.addEventListener('change', function() {
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

        // Calendar navigation
        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() - 1);
                updateCalendar();
            });
        }

        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() + 1);
                updateCalendar();
            });
        }
    }

    // Calendar Functions
    function updateCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Update calendar title
        if (calendarTitle) {
            calendarTitle.textContent = new Date(year, month).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
            });
        }
        
        if (!calendarDays) return;
        
        // Clear calendar days
        calendarDays.innerHTML = '';
        
        // Get first day of month and total days
        const firstDay = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();
        const prevMonthDays = new Date(year, month, 0).getDate();
        
        // Add previous month's days
        for (let i = firstDay - 1; i >= 0; i--) {
            const dayElement = createCalendarDay(prevMonthDays - i, 'other-month');
            calendarDays.appendChild(dayElement);
        }
        
        // Add current month's days
        for (let day = 1; day <= totalDays; day++) {
            const date = new Date(year, month, day);
            const classes = [];
            
            // Check if day has entries
            if (hasEntriesOnDate(date)) {
                classes.push('has-entries');
            }
            
            // Check if day is today
            if (isToday(date)) {
                classes.push('today');
            }
            
            // Check if day is selected
            if (isSelectedDate(date)) {
                classes.push('selected');
            }
            
            const dayElement = createCalendarDay(day, classes.join(' '));
            calendarDays.appendChild(dayElement);
        }
        
        // Add next month's days
        const remainingDays = 42 - (firstDay + totalDays); // 42 is 6 rows * 7 days
        for (let day = 1; day <= remainingDays; day++) {
            const dayElement = createCalendarDay(day, 'other-month');
            calendarDays.appendChild(dayElement);
        }
    }

    function createCalendarDay(day, classes = '') {
        const dayElement = document.createElement('div');
        dayElement.className = `calendar-day ${classes}`;
        dayElement.textContent = day;
        
        dayElement.addEventListener('click', () => {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            selectedDate = new Date(year, month, day);
            
            // Update calendar to show selection
            updateCalendar();
            
            // Filter entries by selected date
            loadEntries();
        });
        
        return dayElement;
    }

    function hasEntriesOnDate(date) {
        return entries.some(entry => {
            const entryDate = new Date(entry.date);
            return entryDate.getFullYear() === date.getFullYear() &&
                   entryDate.getMonth() === date.getMonth() &&
                   entryDate.getDate() === date.getDate();
        });
    }

    function isToday(date) {
        const today = new Date();
        return date.getFullYear() === today.getFullYear() &&
               date.getMonth() === today.getMonth() &&
               date.getDate() === today.getDate();
    }

    function isSelectedDate(date) {
        if (!selectedDate) return false;
        return date.getFullYear() === selectedDate.getFullYear() &&
               date.getMonth() === selectedDate.getMonth() &&
               date.getDate() === selectedDate.getDate();
    }

    // Create New Entry
    function createNewJournalEntry() {
        editingEntryId = null;
        entryTitle.value = '';
        editorBody.innerHTML = '';
        updateCurrentDate();
        journalEditorContainer.style.display = 'block';
        entryView.style.display = 'none';
        entryTitle.focus();
    }

    // Save Entry
    function saveEntry(isAutoSave = false) {
        const title = entryTitle.value.trim();
        const content = editorBody.innerHTML.trim();
        const date = entryDate.value;
        
        if (!title && !content) {
            displayNotification('Please add a title or content to save.', 'error');
            return;
        }
        
        const entry = {
            id: editingEntryId || Date.now().toString(),
            title: title || 'Untitled Entry',
            content,
            date: date || new Date().toISOString().split('T')[0],
            starred: starBtn.querySelector('i').classList.contains('fas'),
            locked: lockBtn.querySelector('i').classList.contains('fa-lock'),
            background: currentBackground,
            lastModified: new Date().toISOString()
        };
        
        if (editingEntryId) {
            const index = entries.findIndex(e => e.id === editingEntryId);
            if (index !== -1) {
                entries[index] = entry;
            }
        } else {
            entries.unshift(entry);
        }
        
        localStorage.setItem('journalEntries', JSON.stringify(entries));
        
        // Update calendar to show new entry
        updateCalendar();
        
        if (!isAutoSave) {
            displayNotification('Entry saved successfully!');
            loadEntries();
            viewEntry(entry.id);
        }
    }

    // Delete Entry
    function deleteEntry(entryId) {
        if (confirm('Are you sure you want to delete this entry?')) {
            entries = entries.filter(entry => entry.id !== entryId);
            localStorage.setItem('journalEntries', JSON.stringify(entries));
            loadEntries();
            cancelEntry();
            displayNotification('Entry deleted successfully!');
        }
    }

    // Cancel Entry
    function cancelEntry() {
        editingEntryId = null;
        entryTitle.value = '';
        editorBody.innerHTML = '';
        updateCurrentDate();
        journalEditorContainer.style.display = 'none';
        entryView.style.display = 'none';
        loadEntries();
    }

    // View Entry
    function viewEntry(entryId) {
        const entry = entries.find(e => e.id === entryId);
        if (!entry) return;
        
        entryView.innerHTML = `
            <div class="entry-header">
                <h2>${entry.title}</h2>
                <div class="entry-meta">
                    <span class="entry-date">${new Date(entry.date).toLocaleDateString()}</span>
                    ${entry.starred ? '<i class="fas fa-star starred"></i>' : ''}
                    ${entry.locked ? '<i class="fas fa-lock"></i>' : ''}
                </div>
                <div class="entry-actions">
                    <button onclick="editEntry('${entry.id}')" class="edit-btn">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button onclick="deleteEntry('${entry.id}')" class="delete-btn">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                    <button onclick="cancelEntry()" class="back-btn">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                </div>
            </div>
            <div class="entry-content" data-bg="${entry.background}">
                ${entry.content}
            </div>
        `;
        
        journalEditorContainer.style.display = 'none';
        entryView.style.display = 'block';
    }

    // Edit Entry
    function editEntry(entryId) {
        const entry = entries.find(e => e.id === entryId);
        if (!entry) return;
        
        editingEntryId = entryId;
        entryTitle.value = entry.title;
        editorBody.innerHTML = entry.content;
        entryDate.value = entry.date;
        
        // Update star and lock buttons
        if (entry.starred) {
            starBtn.querySelector('i').classList.remove('far');
            starBtn.querySelector('i').classList.add('fas');
        } else {
            starBtn.querySelector('i').classList.remove('fas');
            starBtn.querySelector('i').classList.add('far');
        }
        
        if (entry.locked) {
            lockBtn.querySelector('i').classList.remove('fa-lock-open');
            lockBtn.querySelector('i').classList.add('fa-lock');
        } else {
            lockBtn.querySelector('i').classList.remove('fa-lock');
            lockBtn.querySelector('i').classList.add('fa-lock-open');
        }
        
        currentBackground = entry.background;
        journalEditor.setAttribute('data-bg', currentBackground);
        
        journalEditorContainer.style.display = 'block';
        entryView.style.display = 'none';
        entryTitle.focus();
    }

    // Load Entries
    function loadEntries() {
        if (!diaryEntries) return;
        
        let filteredEntries = entries;
        
        // Filter by selected date if any
        if (selectedDate) {
            filteredEntries = entries.filter(entry => {
                const entryDate = new Date(entry.date);
                return entryDate.getFullYear() === selectedDate.getFullYear() &&
                       entryDate.getMonth() === selectedDate.getMonth() &&
                       entryDate.getDate() === selectedDate.getDate();
            });
        }
        
        // Filter by view mode (starred)
        if (viewMode === 'starred') {
            filteredEntries = filteredEntries.filter(entry => entry.starred);
        }
        
        // Filter by search term
        if (diarySearch && diarySearch.value.trim()) {
            const searchTerm = diarySearch.value.toLowerCase().trim();
            filteredEntries = filteredEntries.filter(entry =>
                entry.title.toLowerCase().includes(searchTerm) ||
                entry.content.toLowerCase().includes(searchTerm)
            );
        }
        
        if (filteredEntries.length === 0) {
            diaryEntries.innerHTML = `
                <div class="empty-diary">
                    <p>No entries found${selectedDate ? ' for selected date' : ''}.</p>
                </div>
            `;
            return;
        }
        
        diaryEntries.innerHTML = filteredEntries.map(entry => createEntryElement(entry)).join('');
    }

    // Create Entry Element
    function createEntryElement(entry) {
        const date = new Date(entry.date);
        const formattedDate = date.toLocaleDateString();
        const preview = entry.content.replace(/<[^>]*>/g, '').substring(0, 100);
        
        return `
            <div class="diary-entry ${entry.starred ? 'starred' : ''}" onclick="viewEntry('${entry.id}')">
                <div class="entry-header">
                    <h3>${entry.title}</h3>
                    <div class="entry-meta">
                        <span class="entry-date">${formattedDate}</span>
                        ${entry.starred ? '<i class="fas fa-star"></i>' : ''}
                        ${entry.locked ? '<i class="fas fa-lock"></i>' : ''}
                    </div>
                </div>
                <p class="entry-preview">${preview}${preview.length >= 100 ? '...' : ''}</p>
            </div>
        `;
    }

    // Update Current Date
    function updateCurrentDate() {
        if (entryDate) {
            const today = new Date().toISOString().split('T')[0];
            entryDate.value = today;
        }
    }

    // Toggle Star Entry
    function toggleStarEntry() {
        const icon = starBtn.querySelector('i');
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
        }
        
        if (editingEntryId) {
            saveEntry(true);
        }
    }

    // Toggle Lock Entry
    function toggleLockEntry() {
        const icon = lockBtn.querySelector('i');
        if (icon.classList.contains('fa-lock-open')) {
            icon.classList.remove('fa-lock-open');
            icon.classList.add('fa-lock');
        } else {
            icon.classList.remove('fa-lock');
            icon.classList.add('fa-lock-open');
        }
        
        if (editingEntryId) {
            saveEntry(true);
        }
    }

    // Update Save Status
    function updateSaveStatus(saved = false) {
        if (saved) {
            saveStatus.textContent = 'Saved a few seconds ago';
            saveStatus.classList.remove('unsaved');
        } else {
            saveStatus.textContent = 'Unsaved changes';
            saveStatus.classList.add('unsaved');
        }
    }

    // Update Word Count
    function updateWordCount() {
        if (!wordCounter) return;
        
        const text = editorBody.innerText.trim();
        const wordCount = text ? text.split(/\s+/).length : 0;
        wordCounter.textContent = `${wordCount} word${wordCount === 1 ? '' : 's'}`;
    }

    // Search Entries
    function searchEntries() {
        loadEntries();
    }

    // Make functions available globally
    window.createNewJournalEntry = createNewJournalEntry;
    window.viewEntry = viewEntry;
    window.editEntry = editEntry;
    window.deleteEntry = deleteEntry;
    window.cancelEntry = cancelEntry;

    // Initialize the journal
    init();
});