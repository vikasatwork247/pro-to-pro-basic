/**
 * Robot Head Cursor Follower
 * 
 * This file contains the implementation of a joyful robot head that follows the cursor
 * with smooth animations using Anime.js.
 */

// Initialize robot cursor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initRobotCursor();
});

/**
 * Initialize the robot cursor follower
 */
function initRobotCursor() {
    // Create robot elements
    createRobotElements();
    
    // Set up event listeners and animation
    setupRobotAnimation();
}

/**
 * Create robot cursor elements and append to body
 */
function createRobotElements() {
    // Create container for all robot elements
    const robotElements = document.createElement('div');
    robotElements.className = 'robot-cursor-container';
    
    // Create custom cursor
    const cursor = document.createElement('div');
    cursor.className = 'robot-cursor';
    
    // Create glow effect
    const glow = document.createElement('div');
    glow.className = 'robot-glow';
    
    // Create robot container
    const robotContainer = document.createElement('div');
    robotContainer.className = 'robot-container joyful-bounce';
    
    // Create robot head
    const robotHead = document.createElement('div');
    robotHead.className = 'robot-head';
    
    // Create robot antenna
    const robotAntenna = document.createElement('div');
    robotAntenna.className = 'robot-antenna';
    
    // Create antenna ball
    const robotAntennaBall = document.createElement('div');
    robotAntennaBall.className = 'robot-antenna-ball';
    
    // Create robot eyes
    const leftEye = document.createElement('div');
    leftEye.className = 'robot-eye left';
    
    // Create pupils
    const leftPupil = document.createElement('div');
    leftPupil.className = 'robot-pupil';
    
    const rightEye = document.createElement('div');
    rightEye.className = 'robot-eye right';
    
    const rightPupil = document.createElement('div');
    rightPupil.className = 'robot-pupil';
    
    // Create robot mouth
    const robotMouth = document.createElement('div');
    robotMouth.className = 'robot-mouth';
    
    // Create robot cheeks
    const leftCheek = document.createElement('div');
    leftCheek.className = 'robot-cheek left';
    
    const rightCheek = document.createElement('div');
    rightCheek.className = 'robot-cheek right';
    
    // Create robot neck
    const robotNeck = document.createElement('div');
    robotNeck.className = 'robot-neck';
    
    // Create robot base
    const robotBase = document.createElement('div');
    robotBase.className = 'robot-base';
    
    // Assemble robot
    leftEye.appendChild(leftPupil);
    rightEye.appendChild(rightPupil);
    
    robotHead.appendChild(robotAntenna);
    robotAntenna.appendChild(robotAntennaBall);
    robotHead.appendChild(leftEye);
    robotHead.appendChild(rightEye);
    robotHead.appendChild(robotMouth);
    robotHead.appendChild(leftCheek);
    robotHead.appendChild(rightCheek);
    
    robotContainer.appendChild(robotHead);
    robotContainer.appendChild(robotNeck);
    robotContainer.appendChild(robotBase);
    
    // Add all elements to container
    robotElements.appendChild(cursor);
    robotElements.appendChild(glow);
    robotElements.appendChild(robotContainer);
    
    // Add container to body
    document.body.appendChild(robotElements);
    
    // Add toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'robot-toggle-btn';
    toggleButton.innerHTML = '<i class="fas fa-robot"></i>';
    toggleButton.title = "Toggle Robot Cursor";
    document.body.appendChild(toggleButton);
    
    // Add event listener to toggle button
    toggleButton.addEventListener('click', toggleRobotCursor);
}

/**
 * Set up robot animation and event listeners
 */
function setupRobotAnimation() {
    const cursor = document.querySelector('.robot-cursor');
    const glow = document.querySelector('.robot-glow');
    const robotContainer = document.querySelector('.robot-container');
    const robotEyes = document.querySelectorAll('.robot-eye');
    const robotPupils = document.querySelectorAll('.robot-pupil');
    const robotMouth = document.querySelector('.robot-mouth');
    const robotAntennaBall = document.querySelector('.robot-antenna-ball');
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let robotX = window.innerWidth / 2;
    let robotY = window.innerHeight / 2;
    let isHappy = false;
    let happyTimeout;
    
    // Update mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Move custom cursor
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
        
        // Move glow effect
        glow.style.left = `${mouseX}px`;
        glow.style.top = `${mouseY}px`;
        
        // Make robot happy when mouse moves quickly
        const speed = Math.sqrt(e.movementX * e.movementX + e.movementY * e.movementY);
        if (speed > 20 && !isHappy) {
            makeRobotHappy();
        }
    });
    
    // Animation loop for smooth robot movement
    function animateRobot() {
        // Check if robot is active
        if (!document.body.classList.contains('robot-cursor-active')) {
            requestAnimationFrame(animateRobot);
            return;
        }
        
        // Calculate distance between robot and cursor
        const dx = mouseX - robotX;
        const dy = mouseY - robotY;
        
        // Smooth follow with easing
        robotX += dx * 0.05;
        robotY += dy * 0.05;
        
        // Move robot
        robotContainer.style.left = `${robotX}px`;
        robotContainer.style.top = `${robotY}px`;
        
        // Calculate robot rotation based on cursor position
        const angle = Math.atan2(dy, dx);
        const rotation = angle * (180 / Math.PI);
        
        // Apply rotation with constraint
        const maxRotation = 20;
        const constrainedRotation = Math.max(-maxRotation, Math.min(maxRotation, rotation));
        
        anime({
            targets: robotContainer,
            rotateZ: constrainedRotation,
            duration: 200,
            easing: 'easeOutQuad'
        });
        
        // Animate robot pupils to follow cursor more dramatically
        const eyeMaxMove = 5;
        const eyeXmove = (dx / window.innerWidth) * eyeMaxMove * 2;
        const eyeYmove = (dy / window.innerHeight) * eyeMaxMove * 2;
        
        anime({
            targets: robotPupils,
            translateX: eyeXmove,
            translateY: eyeYmove,
            duration: 200,
            easing: 'easeOutQuad'
        });
        
        requestAnimationFrame(animateRobot);
    }
    
    // Start animation
    animateRobot();
    
    // Initial animation to introduce the robot
    anime({
        targets: robotContainer,
        scale: [0, 1],
        opacity: [0, 1],
        duration: 1500,
        easing: 'easeOutElastic(1, .5)'
    });
    
    // Subtle breathing animation for antenna ball
    anime({
        targets: robotAntennaBall,
        scale: [1, 1.2, 1],
        opacity: [0.8, 1, 0.8],
        boxShadow: [
            '0 0 5px rgba(255, 209, 102, 0.5)',
            '0 0 15px rgba(255, 209, 102, 0.8)',
            '0 0 5px rgba(255, 209, 102, 0.5)'
        ],
        duration: 2000,
        easing: 'easeInOutQuad',
        loop: true
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        robotX = window.innerWidth / 2;
        robotY = window.innerHeight / 2;
    });
    
    // Add click interaction
    document.addEventListener('click', (e) => {
        if (document.body.classList.contains('robot-cursor-active')) {
            // Show excitement on click
            makeRobotExcited(e);
        }
    });
}

/**
 * Make the robot appear happy
 */
function makeRobotHappy() {
    const robotMouth = document.querySelector('.robot-mouth');
    const robotHead = document.querySelector('.robot-head');
    const robotContainer = document.querySelector('.robot-container');
    
    // Already happy, don't restart animations
    if (robotContainer.classList.contains('happy-wiggle')) {
        return;
    }
    
    // Change mouth to a smile
    anime({
        targets: robotMouth,
        borderRadius: '0 0 100% 100%',
        height: 25,
        duration: 300,
        easing: 'easeOutElastic(1, .5)'
    });
    
    // Add wiggle animation
    robotContainer.classList.add('happy-wiggle');
    
    // Create emoji particles
    createEmojiParticles();
    
    // Reset after a few seconds
    setTimeout(() => {
        anime({
            targets: robotMouth,
            borderRadius: '0 0 50% 50%',
            height: 20,
            duration: 300,
            easing: 'easeOutElastic(1, .5)'
        });
        
        robotContainer.classList.remove('happy-wiggle');
    }, 3000);
}

/**
 * Make the robot appear excited on click
 */
function makeRobotExcited(e) {
    const robotHead = document.querySelector('.robot-head');
    const robotEyes = document.querySelectorAll('.robot-eye');
    
    // Jump animation
    anime({
        targets: '.robot-container',
        translateY: [0, -30, 0],
        duration: 800,
        easing: 'easeOutElastic(1, .5)'
    });
    
    // Eye blink
    anime({
        targets: robotEyes,
        scaleY: [1, 0.1, 1],
        duration: 300,
        easing: 'easeInOutSine'
    });
    
    // Create emoji particles at click location
    createEmojiParticles(e.clientX, e.clientY, 10);
}

/**
 * Create emoji particles for happy effects
 */
function createEmojiParticles(x, y, count = 5) {
    const emojis = ['❤️', '😊', '✨', '🎉', '👍', '🤖', '😄', '⭐'];
    const container = document.querySelector('.robot-cursor-container');
    
    // Use robot position if no coordinates provided
    if (!x || !y) {
        const robotContainer = document.querySelector('.robot-container');
        const rect = robotContainer.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top;
    }
    
    for (let i = 0; i < count; i++) {
        const emoji = document.createElement('div');
        emoji.className = 'emoji-particle';
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.left = `${x}px`;
        emoji.style.top = `${y}px`;
        container.appendChild(emoji);
        
        // Random direction
        const angle = Math.random() * Math.PI * 2;
        const distance = 30 + Math.random() * 70;
        const xDestination = Math.cos(angle) * distance;
        const yDestination = Math.sin(angle) * distance;
        
        // Animate emoji
        anime({
            targets: emoji,
            translateX: xDestination,
            translateY: yDestination,
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
            rotate: Math.random() * 360,
            duration: 1000 + Math.random() * 1000,
            easing: 'easeOutExpo',
            complete: () => {
                emoji.remove();
            }
        });
    }
}

/**
 * Toggle robot cursor on/off
 */
function toggleRobotCursor() {
    const body = document.body;
    const toggleBtn = document.querySelector('.robot-toggle-btn');
    
    body.classList.toggle('robot-cursor-active');
    toggleBtn.classList.toggle('active');
    
    // Save preference to localStorage
    if (body.classList.contains('robot-cursor-active')) {
        localStorage.setItem('robotCursorActive', 'true');
    } else {
        localStorage.setItem('robotCursorActive', 'false');
    }
    
    // Show notification
    if (window.globalShowNotification) {
        if (body.classList.contains('robot-cursor-active')) {
            window.globalShowNotification('Joyful robot cursor activated! 🤖✨', 'success');
            // Show initial excitement
            setTimeout(() => {
                makeRobotHappy();
            }, 500);
        } else {
            window.globalShowNotification('Robot cursor deactivated', 'info');
        }
    }
}

/**
 * Check if robot cursor was previously active
 */
function checkRobotCursorState() {
    const wasActive = localStorage.getItem('robotCursorActive') === 'true';
    if (wasActive) {
        document.body.classList.add('robot-cursor-active');
        const toggleBtn = document.querySelector('.robot-toggle-btn');
        if (toggleBtn) {
            toggleBtn.classList.add('active');
        }
    }
}

// Initialize robot cursor state
checkRobotCursorState();
