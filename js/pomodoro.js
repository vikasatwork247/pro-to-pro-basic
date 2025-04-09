// Pomodoro Timer JavaScript

// DOM Elements
const pomodoroBtn = document.getElementById('pomodoro-btn');
const shortBreakBtn = document.getElementById('short-break-btn');
const longBreakBtn = document.getElementById('long-break-btn');
const timerDisplay = document.getElementById('timer-display');
const timerStatus = document.getElementById('timer-status');
const startTimerBtn = document.getElementById('start-timer');
const pauseTimerBtn = document.getElementById('pause-timer');
const resetTimerBtn = document.getElementById('reset-timer');
const pomodoroCounter = document.getElementById('pomodoro-counter');
const pomodoroStreak = document.getElementById('pomodoro-streak');
const progressRing = document.querySelector('.progress-ring-circle');
const timerContainer = document.querySelector('.timer-container');

// Lofi Music Player Elements
const toggleLofiBtn = document.getElementById('toggle-lofi');
const volumeSlider = document.getElementById('volume-slider');
const lofiTrackSelect = document.getElementById('lofi-track-select');
const lofiPlayer = document.getElementById('lofi-player');
let isPlaying = false;

// Settings Elements
const pomodoroDuration = document.getElementById('pomodoro-duration');
const shortBreakDuration = document.getElementById('short-break-duration');
const longBreakDuration = document.getElementById('long-break-duration');
const longBreakInterval = document.getElementById('long-break-interval');
const autoStartBreaks = document.getElementById('auto-start-breaks');
const autoStartPomodoros = document.getElementById('auto-start-pomodoros');
const soundNotification = document.getElementById('sound-notification');
const desktopNotification = document.getElementById('desktop-notification');
const saveSettingsBtn = document.getElementById('save-pomodoro-settings');

// Timer State
let timerMode = 'pomodoro'; // 'pomodoro', 'shortBreak', 'longBreak'
let timerRunning = false;
let timerInterval = null;
let timeLeft = 25 * 60; // in seconds
let totalTime = 25 * 60; // in seconds
let completedPomodoros = 0;
let currentStreak = 0;
let lastPomodoroDate = null;
let breathingAnimation = null;

// Settings State
let settings = {
    pomodoroDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    soundNotification: true,
    desktopNotification: true,
    autoStartLofi: false,
    autoPauseLofi: false
};

// Lofi Tracks
const lofiTracks = {
    'lofi-beats': 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    'study-vibes': 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6c9e0a1.mp3?filename=lofi-chill-14093.mp3',
    'chill-hop': 'https://cdn.pixabay.com/download/audio/2022/03/25/audio_c9a4a1d538.mp3?filename=chill-hip-hop-beat-11254.mp3',
    'jazz-lofi': 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_7937c12c78.mp3?filename=jazz-loop-11430.mp3',
    'piano-ambient': 'https://cdn.pixabay.com/download/audio/2022/04/27/audio_f1e8010671.mp3?filename=piano-ambient-11470.mp3',
    'meditation': 'https://cdn.pixabay.com/download/audio/2022/03/25/audio_c9a4a1d538.mp3?filename=meditation-11254.mp3',
    'coffee-shop': 'https://cdn.pixabay.com/download/audio/2022/05/13/audio_944392aa1f.mp3?filename=coffee-shop-ambience-11415.mp3',
    'nature-sounds': 'https://cdn.pixabay.com/download/audio/2022/04/07/audio_b2e3336c1a.mp3?filename=forest-with-birds-11237.mp3',
    'rain-sounds': 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_c8f3e5dc21.mp3?filename=rain-ambient-11251.mp3',
    'ocean-waves': 'https://cdn.pixabay.com/download/audio/2022/04/07/audio_944392aa1f.mp3?filename=ocean-waves-11415.mp3',
    'fireplace': 'https://cdn.pixabay.com/download/audio/2022/03/25/audio_c9a4a1d538.mp3?filename=fireplace-11254.mp3',
    'night-sounds': 'https://cdn.pixabay.com/download/audio/2022/04/07/audio_b2e3336c1a.mp3?filename=night-sounds-11237.mp3'
};

// Initialize Pomodoro Timer
function initPomodoro() {
    loadSettings();
    loadStats();
    updateTimerDisplay();
    updateProgressRing(1); // Start with full ring
    
    // Event Listeners for Timer Mode Buttons
    pomodoroBtn.addEventListener('click', () => setTimerMode('pomodoro'));
    shortBreakBtn.addEventListener('click', () => setTimerMode('shortBreak'));
    longBreakBtn.addEventListener('click', () => setTimerMode('longBreak'));
    
    // Event Listeners for Timer Control Buttons
    startTimerBtn.addEventListener('click', startTimer);
    pauseTimerBtn.addEventListener('click', pauseTimer);
    resetTimerBtn.addEventListener('click', resetTimer);
    
    // Event Listener for Settings
    saveSettingsBtn.addEventListener('click', saveSettings);
    
    // Event Listeners for instant duration updates
    pomodoroDuration.addEventListener('input', () => updateDuration('pomodoro'));
    shortBreakDuration.addEventListener('input', () => updateDuration('shortBreak'));
    longBreakDuration.addEventListener('input', () => updateDuration('longBreak'));
    
    // Request notification permission
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
    }
    
    // Initialize breathing animation for idle state
    startBreathingAnimation();
}

// Update duration instantly when input changes
function updateDuration(mode) {
    let newDuration;
    switch (mode) {
        case 'pomodoro':
            newDuration = Math.max(1, Math.min(60, parseInt(pomodoroDuration.value) || 25));
            settings.pomodoroDuration = newDuration;
            if (timerMode === 'pomodoro' && !timerRunning) {
                totalTime = newDuration * 60;
                timeLeft = totalTime;
                updateTimerDisplay();
                updateProgressRing(1);
            }
            break;
        case 'shortBreak':
            newDuration = Math.max(1, Math.min(30, parseInt(shortBreakDuration.value) || 5));
            settings.shortBreakDuration = newDuration;
            if (timerMode === 'shortBreak' && !timerRunning) {
                totalTime = newDuration * 60;
                timeLeft = totalTime;
                updateTimerDisplay();
                updateProgressRing(1);
            }
            break;
        case 'longBreak':
            newDuration = Math.max(1, Math.min(60, parseInt(longBreakDuration.value) || 15));
            settings.longBreakDuration = newDuration;
            if (timerMode === 'longBreak' && !timerRunning) {
                totalTime = newDuration * 60;
                timeLeft = totalTime;
                updateTimerDisplay();
                updateProgressRing(1);
            }
            break;
    }
    
    // Save settings to localStorage
    try {
        localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
    } catch (error) {
        console.error('Error saving settings to localStorage:', error);
    }
}

// Set Timer Mode
function setTimerMode(mode) {
    // Store previous mode for transition animation
    const prevMode = timerMode;
    timerMode = mode;
    resetTimer();
    
    // Update active button
    pomodoroBtn.classList.remove('active');
    shortBreakBtn.classList.remove('active');
    longBreakBtn.classList.remove('active');
    
    // Animate mode transition
    animateTimerTransition(prevMode, mode);
    
    switch (mode) {
        case 'pomodoro':
            pomodoroBtn.classList.add('active');
            timerStatus.textContent = 'Focus Time';
            totalTime = settings.pomodoroDuration * 60;
            break;
        case 'shortBreak':
            shortBreakBtn.classList.add('active');
            timerStatus.textContent = 'Short Break';
            totalTime = settings.shortBreakDuration * 60;
            break;
        case 'longBreak':
            longBreakBtn.classList.add('active');
            timerStatus.textContent = 'Long Break';
            totalTime = settings.longBreakDuration * 60;
            break;
    }
    
    timeLeft = totalTime;
    updateTimerDisplay();
    updateProgressRing(1);
}

// Animate Timer Mode Transition
function animateTimerTransition(prevMode, newMode) {
    // Define colors for different modes
    const modeColors = {
        pomodoro: '#ff6347',
        shortBreak: '#4682b4',
        longBreak: '#2e8b57'
    };
    
    // Animate the transition
    anime.timeline({
        easing: 'easeInOutSine',
        duration: 600
    })
    .add({
        targets: '.timer-container',
        opacity: [1, 0.7],
        scale: [1, 0.98],
        duration: 300,
        easing: 'easeInOutSine'
    })
    .add({
        targets: '.timer-container',
        opacity: [0.7, 1],
        scale: [0.98, 1],
        duration: 300,
        easing: 'easeInOutSine'
    });
    
    // Animate the timer status text
    anime({
        targets: '#timer-status',
        translateY: [0, -20, 0],
        opacity: [1, 0, 1],
        easing: 'easeInOutSine',
        duration: 600
    });
    
    // Animate the timer display
    anime({
        targets: '#timer-display',
        translateY: [0, 10, 0],
        opacity: [1, 0.5, 1],
        easing: 'easeInOutSine',
        duration: 600
    });
}

// Start Timer
function startTimer() {
    if (timerRunning) return;
    
    timerRunning = true;
    startTimerBtn.style.display = 'none';
    pauseTimerBtn.style.display = 'inline-block';
    
    // Stop breathing animation when timer starts
    stopBreathingAnimation();
    
    // Add ripple effect on start
    createTimerRipple();
    
    // Clear any existing interval to prevent multiple intervals
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timerInterval = setInterval(() => {
        timeLeft--;
        
        if (timeLeft <= 0) {
            completeTimer();
        } else {
            updateTimerDisplay();
            updateProgressRing(timeLeft / totalTime);
        }
    }, 1000);
    
    // Animate the start button
    anime({
        targets: pauseTimerBtn,
        scale: [0, 1],
        opacity: [0, 1],
        duration: 400,
        easing: 'easeOutBack'
    });
}

// Create Timer Ripple Effect
function createTimerRipple() {
    if (!timerContainer) return;
    
    // Create ripple element
    const ripple = document.createElement('div');
    ripple.classList.add('timer-ripple');
    timerContainer.appendChild(ripple);
    
    // Animate ripple
    anime({
        targets: ripple,
        scale: [0, 2],
        opacity: [0.5, 0],
        duration: 1000,
        easing: 'easeOutExpo',
        complete: function() {
            ripple.remove();
        }
    });
}

// Start Breathing Animation for idle state
function startBreathingAnimation() {
    if (!timerContainer || timerRunning) return;
    
    // Stop any existing animation
    stopBreathingAnimation();
    
    // Create breathing animation
    breathingAnimation = anime({
        targets: '.timer-container',
        scale: [1, 1.03],
        opacity: [1, 0.9],
        duration: 3000,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine'
    });
}

// Stop Breathing Animation
function stopBreathingAnimation() {
    if (breathingAnimation) {
        breathingAnimation.pause();
        breathingAnimation = null;
        
        // Reset timer container
        anime({
            targets: '.timer-container',
            scale: 1,
            opacity: 1,
            duration: 300,
            easing: 'easeOutSine'
        });
    }
}

// Pause Timer
function pauseTimer() {
    if (!timerRunning) return;
    
    timerRunning = false;
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    startTimerBtn.style.display = 'inline-block';
    pauseTimerBtn.style.display = 'none';
    
    // Animate the pause transition
    anime({
        targets: startTimerBtn,
        scale: [0, 1],
        opacity: [0, 1],
        duration: 400,
        easing: 'easeOutBack'
    });
    
    // Start breathing animation when paused
    startBreathingAnimation();
}

// Reset Timer
function resetTimer() {
    pauseTimer();
    timeLeft = totalTime;
    updateTimerDisplay();
    updateProgressRing(1);
    
    // Animate the reset
    anime({
        targets: '#timer-display',
        scale: [0.9, 1],
        opacity: [0.8, 1],
        duration: 500,
        easing: 'easeOutElastic(1, .5)'
    });
    
    // Animate the progress ring
    anime({
        targets: '.progress-ring-circle',
        strokeDashoffset: 0,
        duration: 800,
        easing: 'easeOutExpo'
    });
}

// Complete Timer
function completeTimer() {
    pauseTimer();
    playNotificationSound();
    showNotification();
    
    // Create completion animation
    anime({
        targets: '.timer-container',
        scale: [1, 1.1, 1],
        boxShadow: [
            '0 0 0 rgba(255, 255, 255, 0)',
            '0 0 30px rgba(255, 255, 255, 0.8)',
            '0 0 0 rgba(255, 255, 255, 0)'
        ],
        duration: 1200,
        easing: 'easeOutExpo'
    });
    
    if (timerMode === 'pomodoro') {
        completedPomodoros++;
        updateStreak();
        
        // Animate counter increment
        anime({
            targets: pomodoroCounter,
            innerHTML: [completedPomodoros - 1, completedPomodoros],
            round: 1,
            easing: 'easeInOutExpo',
            duration: 800,
            update: function(anim) {
                pomodoroCounter.textContent = Math.round(anim.animations[0].currentValue);
            }
        });
        
        // Animate streak counter
        anime({
            targets: pomodoroStreak,
            innerHTML: [currentStreak - (currentStreak > 0 ? 1 : 0), currentStreak],
            round: 1,
            easing: 'easeInOutExpo',
            duration: 800,
            update: function(anim) {
                pomodoroStreak.textContent = Math.round(anim.animations[0].currentValue);
            }
        });
        
        saveStats();
        
        // Check if it's time for a long break
        if (completedPomodoros % settings.longBreakInterval === 0) {
            if (settings.autoStartBreaks) {
                setTimerMode('longBreak');
                startTimer();
            } else {
                setTimerMode('longBreak');
            }
        } else {
            if (settings.autoStartBreaks) {
                setTimerMode('shortBreak');
                startTimer();
            } else {
                setTimerMode('shortBreak');
            }
        }
        
        // Check for achievements
        checkPomodoroAchievements();
    } else {
        // Coming back from a break
        if (settings.autoStartPomodoros) {
            setTimerMode('pomodoro');
            startTimer();
        } else {
            setTimerMode('pomodoro');
        }
    }
    
    // Handle lofi music
    handleLofiWithTimer();
}

// Update Timer Display
function updateTimerDisplay() {
    if (!timerDisplay) return;
    
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Update Progress Ring
function updateProgressRing(progress) {
    if (!progressRing) return;
    
    const radius = progressRing.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    
    // Calculate stroke-dashoffset
    const offset = circumference * (1 - progress);
    
    // Animate the progress ring
    anime({
        targets: progressRing,
        strokeDashoffset: offset,
        duration: 300,
        easing: 'linear'
    });
    
    // Update color based on time left
    if (progress < 0.25) {
        // Urgent - animate pulsing for last 25%
        if (!progressRing.classList.contains('pulse-animation')) {
            progressRing.classList.add('pulse-animation');
            
            // Add pulsing animation
            anime({
                targets: progressRing,
                stroke: [
                    { value: '#ff6347', duration: 500 },
                    { value: '#ff8c7a', duration: 500 }
                ],
                opacity: [0.7, 1],
                easing: 'easeInOutSine',
                direction: 'alternate',
                loop: true
            });
        }
    } else {
        // Remove pulsing animation
        progressRing.classList.remove('pulse-animation');
        anime.remove(progressRing);
        
        // Set color based on mode
        let color;
        switch (timerMode) {
            case 'pomodoro':
                color = '#ff6347';
                break;
            case 'shortBreak':
                color = '#4682b4';
                break;
            case 'longBreak':
                color = '#2e8b57';
                break;
        }
        
        anime({
            targets: progressRing,
            stroke: color,
            opacity: 1,
            duration: 300,
            easing: 'easeOutSine'
        });
    }
}

// Play Notification Sound
function playNotificationSound() {
    if (!settings.soundNotification) return;
    
    const audio = new Audio('audio/notification.mp3');
    audio.volume = 0.5;
    audio.play();
}

// Show Desktop Notification
function showNotification() {
    if (!settings.desktopNotification) return;
    
    let title, message;
    
    if (timerMode === 'pomodoro') {
        title = 'Pomodoro Completed!';
        message = 'Time for a break. Good job!';
    } else if (timerMode === 'shortBreak') {
        title = 'Break Completed!';
        message = 'Time to focus again.';
    } else {
        title = 'Long Break Completed!';
        message = 'Ready for another productive session?';
    }
    
    // Show in-app notification
    displayNotification(title, message, 'success');
    
    // Show browser notification if supported and permitted
    if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(title, {
            body: message,
            icon: 'assets/images/timer-icon.png'
        });
        
        // Close notification after 5 seconds
        setTimeout(() => notification.close(), 5000);
    }
}

// Display in-app notification with animation
function displayNotification(title, message, type = 'info') {
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
            <h4>${title}</h4>
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

// Initialize lofi player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the Pomodoro timer first
    initPomodoro();
    
    // Initialize lofi player
    initLofiPlayer();
    
    // Add event listeners for lofi controls
    if (toggleLofiBtn) {
        toggleLofiBtn.addEventListener('click', toggleLofi);
    }
    
    if (volumeSlider) {
        volumeSlider.addEventListener('input', changeVolume);
    }
    
    if (lofiTrackSelect) {
        lofiTrackSelect.addEventListener('change', changeTrack);
    }
    
    // Add lofi settings to pomodoro settings
    addLofiSettings();
});

// Initialize Lofi Player
function initLofiPlayer() {
    if (!lofiPlayer) {
        console.error('Lofi player element not found');
        return;
    }
    
    // Set initial track
    const initialTrack = lofiTrackSelect ? lofiTrackSelect.value : 'lofi-beats';
    console.log('Initializing lofi player with track:', initialTrack);
    
    try {
        // Set source and load the audio
        const sourceElement = lofiPlayer.querySelector('source');
        if (sourceElement) {
            sourceElement.src = lofiTracks[initialTrack];
        }
        lofiPlayer.volume = volumeSlider ? volumeSlider.value / 100 : 0.5;
        lofiPlayer.load();
        
        // Add event listeners for better error handling
        lofiPlayer.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            const errorMessage = getAudioErrorMessage(e.target.error);
            displayNotification('Audio Error', errorMessage, 'error');
            
            // Try to recover by switching to another track
            if (lofiTrackSelect) {
                const currentIndex = lofiTrackSelect.selectedIndex;
                const nextIndex = (currentIndex + 1) % lofiTrackSelect.options.length;
                lofiTrackSelect.selectedIndex = nextIndex;
                changeTrack();
            }
        });
        
        lofiPlayer.addEventListener('canplay', () => {
            console.log('Audio can play');
            if (isPlaying) {
                lofiPlayer.play()
                    .catch(error => console.error('Error auto-resuming playback:', error));
            }
        });
        
        lofiPlayer.addEventListener('ended', () => {
            console.log('Track ended, playing next');
            playNextTrack();
        });
        
        console.log('Lofi player initialized successfully');
    } catch (error) {
        console.error('Error initializing lofi player:', error);
    }
}

// Helper function to get readable error messages
function getAudioErrorMessage(error) {
    if (!error) return 'Unknown error occurred';
    
    switch (error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
            return 'Playback was aborted by the user';
        case MediaError.MEDIA_ERR_NETWORK:
            return 'A network error occurred while loading the audio';
        case MediaError.MEDIA_ERR_DECODE:
            return 'The audio could not be decoded';
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            return 'The audio format is not supported';
        default:
            return 'An unknown error occurred';
    }
}

// Play next track in the list
function playNextTrack() {
    if (!lofiTrackSelect) return;
    
    const currentIndex = lofiTrackSelect.selectedIndex;
    const nextIndex = (currentIndex + 1) % lofiTrackSelect.options.length;
    lofiTrackSelect.selectedIndex = nextIndex;
    changeTrack();
}

// Toggle Lofi Music
function toggleLofi() {
    if (!lofiPlayer || !toggleLofiBtn) return;
    
    console.log('Toggle Lofi clicked. Current state:', isPlaying ? 'playing' : 'paused');
    
    if (isPlaying) {
        // Pause music
        lofiPlayer.pause();
        toggleLofiBtn.innerHTML = '<i class="fas fa-play"></i> Play Music';
        isPlaying = false;
        console.log('Music paused');
    } else {
        // Play music
        const playPromise = lofiPlayer.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Playback started successfully
                toggleLofiBtn.innerHTML = '<i class="fas fa-pause"></i> Pause Music';
                isPlaying = true;
                console.log('Music playing');
                
                // Show notification with track name
                if (lofiTrackSelect) {
                    const trackName = lofiTrackSelect.options[lofiTrackSelect.selectedIndex].text;
                    displayNotification('Now Playing', trackName, 'info');
                }
            }).catch(error => {
                console.error('Error playing audio:', error);
                handlePlaybackError();
            });
        }
    }
    
    // Animate button
    anime({
        targets: toggleLofiBtn,
        scale: [1.2, 1],
        duration: 300,
        easing: 'easeOutSine'
    });
}

// Change Volume
function changeVolume() {
    if (!lofiPlayer || !volumeSlider) return;
    lofiPlayer.volume = volumeSlider.value / 100;
}

// Change Track
function changeTrack() {
    if (!lofiPlayer || !lofiTrackSelect) return;
    
    const wasPlaying = isPlaying;
    const selectedTrack = lofiTrackSelect.value;
    
    console.log(`Changing track to: ${selectedTrack}`);
    
    // Pause current track
    if (isPlaying) {
        lofiPlayer.pause();
    }
    
    // Update source element
    const sourceElement = lofiPlayer.querySelector('source');
    if (sourceElement) {
        sourceElement.src = lofiTracks[selectedTrack];
        lofiPlayer.load();
    }
    
    // Resume playing if it was playing before
    if (wasPlaying) {
        const playPromise = lofiPlayer.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('Track playing successfully');
                    isPlaying = true;
                    if (toggleLofiBtn) {
                        toggleLofiBtn.innerHTML = '<i class="fas fa-pause"></i> Pause Music';
                    }
                })
                .catch(error => {
                    console.error('Error playing track:', error);
                    handlePlaybackError();
                });
        }
    }
    
    // Show notification about track change
    const trackName = lofiTrackSelect.options[lofiTrackSelect.selectedIndex].text;
    displayNotification('Track Changed', `Now playing: ${trackName}`, 'info');
}

// Handle playback errors
function handlePlaybackError() {
    isPlaying = false;
    if (toggleLofiBtn) {
        toggleLofiBtn.innerHTML = '<i class="fas fa-play"></i> Play Music';
    }
    
    displayNotification(
        'Playback Error',
        'Unable to play the track. Trying another one...',
        'warning'
    );
    
    // Try the next track
    setTimeout(playNextTrack, 1000);
}

// Handle Lofi with Timer
function handleLofiWithTimer() {
    if (!settings.autoStartLofi && !settings.autoPauseLofi) return;
    
    if (timerMode === 'pomodoro' && settings.autoStartLofi && !isPlaying) {
        // Auto start lofi when pomodoro starts
        toggleLofi();
    } else if ((timerMode === 'shortBreak' || timerMode === 'longBreak') && 
               settings.autoPauseLofi && isPlaying) {
        // Auto pause lofi during breaks
        toggleLofi();
    }
}

// Add Lofi Settings
function addLofiSettings() {
    const settingsContainer = document.querySelector('.pomodoro-settings');
    if (!settingsContainer) return;
    
    // Check if settings already exist
    if (document.getElementById('auto-start-lofi')) return;
    
    // Create lofi settings
    const lofiSettings = document.createElement('div');
    lofiSettings.className = 'settings-group lofi-settings';
    lofiSettings.innerHTML = `
        <h3>Lofi Music Settings</h3>
        <div class="settings-option">
            <label for="auto-start-lofi">Auto-start Music with Pomodoro</label>
            <input type="checkbox" id="auto-start-lofi" ${settings.autoStartLofi ? 'checked' : ''}>
        </div>
        <div class="settings-option">
            <label for="auto-pause-lofi">Auto-pause Music during Breaks</label>
            <input type="checkbox" id="auto-pause-lofi" ${settings.autoPauseLofi ? 'checked' : ''}>
        </div>
    `;
    
    settingsContainer.appendChild(lofiSettings);
    
    // Add event listeners
    const autoStartLofi = document.getElementById('auto-start-lofi');
    const autoPauseLofi = document.getElementById('auto-pause-lofi');
    
    if (autoStartLofi) {
        autoStartLofi.addEventListener('change', function() {
            settings.autoStartLofi = this.checked;
            saveSettings();
        });
    }
    
    if (autoPauseLofi) {
        autoPauseLofi.addEventListener('change', function() {
            settings.autoPauseLofi = this.checked;
            saveSettings();
        });
    }
}

// Load Settings
function loadSettings() {
    console.log('Loading Pomodoro settings...');
    
    try {
        const savedSettings = localStorage.getItem('pomodoroSettings');
        if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            
            // Validate and merge settings
            settings = {
                ...settings, // Keep default values as fallback
                ...parsedSettings, // Override with saved values
                
                // Ensure values are within valid ranges
                pomodoroDuration: Math.max(1, Math.min(60, parsedSettings.pomodoroDuration || 25)),
                shortBreakDuration: Math.max(1, Math.min(30, parsedSettings.shortBreakDuration || 5)),
                longBreakDuration: Math.max(1, Math.min(60, parsedSettings.longBreakDuration || 15)),
                longBreakInterval: Math.max(1, Math.min(10, parsedSettings.longBreakInterval || 4))
            };
            
            console.log('Settings loaded:', settings);
        } else {
            console.log('No saved settings found, using defaults');
        }
    } catch (error) {
        console.error('Error loading settings:', error);
        // If there's an error, we'll use the default settings
    }
    
    // Update UI with loaded settings
    if (pomodoroDuration) pomodoroDuration.value = settings.pomodoroDuration;
    if (shortBreakDuration) shortBreakDuration.value = settings.shortBreakDuration;
    if (longBreakDuration) longBreakDuration.value = settings.longBreakDuration;
    if (longBreakInterval) longBreakInterval.value = settings.longBreakInterval;
    if (autoStartBreaks) autoStartBreaks.checked = settings.autoStartBreaks;
    if (autoStartPomodoros) autoStartPomodoros.checked = settings.autoStartPomodoros;
    if (soundNotification) soundNotification.checked = settings.soundNotification;
    if (desktopNotification) desktopNotification.checked = settings.desktopNotification;
    
    // Set initial timer values based on current mode
    if (timerMode === 'pomodoro') {
        totalTime = settings.pomodoroDuration * 60;
    } else if (timerMode === 'shortBreak') {
        totalTime = settings.shortBreakDuration * 60;
    } else if (timerMode === 'longBreak') {
        totalTime = settings.longBreakDuration * 60;
    }
    
    timeLeft = totalTime;
    
    // Apply theme color based on current mode
    applyThemeColor();
}

// Save Settings
function saveSettings() {
    console.log('Saving Pomodoro settings...');
    
    // Validate input values
    const pomDuration = pomodoroDuration ? Math.max(1, Math.min(60, parseInt(pomodoroDuration.value) || 25)) : 25;
    const shortDuration = shortBreakDuration ? Math.max(1, Math.min(30, parseInt(shortBreakDuration.value) || 5)) : 5;
    const longDuration = longBreakDuration ? Math.max(1, Math.min(60, parseInt(longBreakDuration.value) || 15)) : 15;
    const breakInterval = longBreakInterval ? Math.max(1, Math.min(10, parseInt(longBreakInterval.value) || 4)) : 4;
    
    // Update UI with validated values
    if (pomodoroDuration) pomodoroDuration.value = pomDuration;
    if (shortBreakDuration) shortBreakDuration.value = shortDuration;
    if (longBreakDuration) longBreakDuration.value = longDuration;
    if (longBreakInterval) longBreakInterval.value = breakInterval;
    
    // Update settings object
    settings.pomodoroDuration = pomDuration;
    settings.shortBreakDuration = shortDuration;
    settings.longBreakDuration = longDuration;
    settings.longBreakInterval = breakInterval;
    settings.autoStartBreaks = autoStartBreaks ? autoStartBreaks.checked : false;
    settings.autoStartPomodoros = autoStartPomodoros ? autoStartPomodoros.checked : false;
    settings.soundNotification = soundNotification ? soundNotification.checked : true;
    settings.desktopNotification = desktopNotification ? desktopNotification.checked : true;
    
    console.log('Updated settings:', settings);
    
    // Save to localStorage
    try {
        localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
        console.log('Settings saved to localStorage');
    } catch (error) {
        console.error('Error saving settings to localStorage:', error);
    }
    
    // Update timer if needed
    if (timerMode === 'pomodoro') {
        totalTime = settings.pomodoroDuration * 60;
    } else if (timerMode === 'shortBreak') {
        totalTime = settings.shortBreakDuration * 60;
    } else if (timerMode === 'longBreak') {
        totalTime = settings.longBreakDuration * 60;
    }
    
    // Reset timer if it's not running
    if (!timerRunning) {
        timeLeft = totalTime;
        updateTimerDisplay();
        updateProgressRing(1);
    } else {
        // If timer is running, show a notification that changes will take effect next time
        displayNotification(
            'Settings Updated', 
            'Your changes will take effect after the current timer completes or is reset.', 
            'info'
        );
        return; // Return early to avoid showing the success notification
    }
    
    // Show confirmation
    displayNotification('Settings Saved', 'Your Pomodoro settings have been updated.', 'success');
    
    // Apply theme color based on current mode
    applyThemeColor();
}

// Apply theme color based on current timer mode
function applyThemeColor() {
    // Define colors for different modes
    const modeColors = {
        pomodoro: '#ff6347',    // Tomato red
        shortBreak: '#4682b4',  // Steel blue
        longBreak: '#2e8b57'    // Sea green
    };
    
    // Get the current mode color
    const currentColor = modeColors[timerMode];
    
    // Apply color to progress ring
    if (progressRing) {
        progressRing.style.stroke = currentColor;
    }
    
    // Apply color to timer buttons
    const timerButtons = document.querySelectorAll('.timer-btn');
    timerButtons.forEach(button => {
        button.style.backgroundColor = currentColor;
    });
    
    // Apply subtle background tint to timer container
    const timerDisplayContainer = document.querySelector('.timer-display-container');
    if (timerDisplayContainer) {
        timerDisplayContainer.style.boxShadow = `0 0 30px ${currentColor}22`;
    }
}

// Load Stats
function loadStats() {
    const savedStats = localStorage.getItem('pomodoroStats');
    if (savedStats) {
        const stats = JSON.parse(savedStats);
        completedPomodoros = stats.completedPomodoros || 0;
        currentStreak = stats.currentStreak || 0;
        lastPomodoroDate = stats.lastPomodoroDate ? new Date(stats.lastPomodoroDate) : null;
    }
    
    // Update UI
    if (pomodoroCounter) pomodoroCounter.textContent = completedPomodoros;
    if (pomodoroStreak) pomodoroStreak.textContent = currentStreak;
}

// Save Stats
function saveStats() {
    const stats = {
        completedPomodoros,
        currentStreak,
        lastPomodoroDate: lastPomodoroDate ? lastPomodoroDate.toISOString() : null
    };
    
    localStorage.setItem('pomodoroStats', JSON.stringify(stats));
}

// Update Stats
function updateStats() {
    if (timerMode !== 'pomodoro') return;
    
    // Increment completed pomodoros
    completedPomodoros++;
    
    // Check if streak should be updated
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (lastPomodoroDate) {
        const lastDate = new Date(lastPomodoroDate);
        lastDate.setHours(0, 0, 0, 0);
        
        const dayDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 0) {
            // Same day, streak continues
        } else if (dayDiff === 1) {
            // Next day, streak increases
            currentStreak++;
        } else {
            // Gap in days, reset streak
            currentStreak = 1;
        }
    } else {
        // First pomodoro
        currentStreak = 1;
    }
    
    lastPomodoroDate = new Date();
    
    // Update UI
    if (pomodoroCounter) pomodoroCounter.textContent = completedPomodoros;
    if (pomodoroStreak) pomodoroStreak.textContent = currentStreak;
    
    // Save stats
    saveStats();
    
    // Check for achievements
    checkPomodoroAchievements();
}

// Check Pomodoro Achievements
function checkPomodoroAchievements() {
    // Check for first pomodoro
    if (completedPomodoros === 1) {
        awardBadge('first-pomodoro');
    }
    
    // Check for pomodoro milestones
    if (completedPomodoros === 10) {
        awardBadge('pomodoro-novice');
    } else if (completedPomodoros === 50) {
        awardBadge('pomodoro-pro');
    } else if (completedPomodoros === 100) {
        awardBadge('pomodoro-master');
    }
    
    // Check for streak achievements
    if (currentStreak === 3) {
        awardBadge('focus-streak');
    } else if (currentStreak === 7) {
        awardBadge('focus-warrior');
    }
}

// Award Badge
function awardBadge(badgeId) {
    // Check if badges.js has the function
    if (typeof addBadge === 'function') {
        addBadge(badgeId);
    } else {
        console.log(`Badge awarded: ${badgeId}`);
    }
}
