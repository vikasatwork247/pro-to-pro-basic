/**
 * Pro-To-Pro Animations
 * 
 * This file contains all Anime.js animations for the Pro-To-Pro productivity app.
 * Animations are organized by feature and designed to be elegant, minimal, and soothing.
 */

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initPageLoadAnimations();
    initTaskAnimations();
    initPomodoroAnimations();
    initDiaryAnimations();
    initAnalyticsAnimations();
    initBadgeAnimations();
    initMicroInteractions();
    initAdvancedAnimations();
});

/**
 * Global Animation Settings
 */
const animationSettings = {
    duration: {
        fast: 400,
        normal: 800,
        slow: 1200,
        verySlow: 2000
    },
    easing: {
        smooth: 'easeInOutSine',
        bounce: 'easeOutElastic(1, .5)',
        sharp: 'easeOutExpo',
        spring: 'spring(1, 80, 10, 0)',
        bounceOut: 'easeOutBounce',
        elastic: 'easeOutElastic(1, 0.3)'
    },
    delay: {
        stagger: 50,
        short: 100,
        medium: 300,
        long: 500
    }
};

/**
 * Page Load Animations
 */
function initPageLoadAnimations() {
    // Animate logo and header elements
    anime({
        targets: '.logo-container *',
        translateY: [20, 0],
        opacity: [0, 1],
        easing: animationSettings.easing.smooth,
        duration: animationSettings.duration.normal,
        delay: anime.stagger(150)
    });

    // Animate sidebar navigation
    anime({
        targets: '.nav-item',
        translateX: [-30, 0],
        opacity: [0, 1],
        easing: animationSettings.easing.smooth,
        duration: animationSettings.duration.normal,
        delay: anime.stagger(100)
    });

    // Animate content sections
    anime({
        targets: '.content-section.active',
        translateY: [20, 0],
        opacity: [0, 1],
        easing: animationSettings.easing.smooth,
        duration: animationSettings.duration.normal,
        delay: 300
    });
}

/**
 * Task Animations
 */
function initTaskAnimations() {
    // Task list item animations
    const taskObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                anime({
                    targets: entry.target,
                    translateY: [20, 0],
                    opacity: [0, 1],
                    easing: animationSettings.easing.spring,
                    duration: animationSettings.duration.normal
                });
                taskObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Observe task items
    document.querySelectorAll('.task-item').forEach(task => {
        taskObserver.observe(task);
    });

    // Add animation for task completion
    document.addEventListener('click', (e) => {
        if (e.target.matches('.task-checkbox') || e.target.closest('.task-checkbox')) {
            const taskItem = e.target.closest('.task-item');
            if (taskItem) {
                const taskText = taskItem.querySelector('.task-text');
                
                if (taskItem.classList.contains('completed')) {
                    // Uncomplete animation
                    anime({
                        targets: taskText,
                        textDecoration: 'none',
                        color: 'var(--text-primary)',
                        easing: animationSettings.easing.smooth,
                        duration: animationSettings.duration.fast
                    });
                } else {
                    // Complete animation with checkmark
                    anime({
                        targets: taskText,
                        textDecoration: 'line-through',
                        color: 'var(--text-secondary)',
                        easing: animationSettings.easing.smooth,
                        duration: animationSettings.duration.fast
                    });
                    
                    // Add checkmark animation
                    const checkbox = taskItem.querySelector('.task-checkbox');
                    anime({
                        targets: checkbox,
                        rotateZ: [0, 360],
                        scale: [1, 1.2, 1],
                        duration: animationSettings.duration.fast,
                        easing: animationSettings.easing.bounce
                    });
                }
            }
        }
    });
}

/**
 * Pomodoro Animations
 */
function initPomodoroAnimations() {
    // Pomodoro timer animations
    const timerCircle = document.querySelector('.timer-circle');
    if (timerCircle) {
        // Breathing animation when timer is idle
        const breathingAnimation = anime({
            targets: '.timer-circle',
            scale: [1, 1.05, 1],
            duration: 4000,
            easing: 'easeInOutSine',
            loop: true,
            autoplay: true
        });
        
        // Store animation in DOM element for later access
        if (timerCircle) {
            timerCircle.breathingAnimation = breathingAnimation;
        }
    }
    
    // Add ripple effect on timer start
    const startButton = document.querySelector('.start-btn');
    if (startButton) {
        startButton.addEventListener('click', createRippleEffect);
    }
    
    // Add ripple effect on timer reset
    const resetButton = document.querySelector('.reset-btn');
    if (resetButton) {
        resetButton.addEventListener('click', createRippleEffect);
    }
}

/**
 * Diary Animations
 */
function initDiaryAnimations() {
    // Animate diary entries
    const diaryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                anime({
                    targets: entry.target,
                    translateY: [20, 0],
                    opacity: [0, 1],
                    easing: animationSettings.easing.smooth,
                    duration: animationSettings.duration.normal,
                    delay: anime.stagger(100)
                });
                diaryObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // Observe diary entries
    document.querySelectorAll('.diary-entry').forEach(entry => {
        diaryObserver.observe(entry);
    });
    
    // Typing effect for diary title
    const journalTitle = document.querySelector('.journal-title');
    if (journalTitle) {
        journalTitle.addEventListener('focus', () => {
            // Reset animation only if it's the default title
            if (journalTitle.value === 'Untitled Entry') {
                journalTitle.value = '';
                
                // Set up typing animation
                const text = 'New Journal Entry';
                let i = 0;
                
                const typeInterval = setInterval(() => {
                    if (i < text.length && document.activeElement === journalTitle) {
                        journalTitle.value += text.charAt(i);
                        i++;
                    } else {
                        clearInterval(typeInterval);
                    }
                }, 100);
            }
        });
    }
}

/**
 * Analytics Animations
 */
function initAnalyticsAnimations() {
    // Chart animations are handled by Chart.js
    // Add additional animations for analytics cards
    const analyticsCards = document.querySelectorAll('.analytics-card');
    
    analyticsCards.forEach((card, index) => {
        anime({
            targets: card,
            translateY: [50, 0],
            opacity: [0, 1],
            easing: animationSettings.easing.smooth,
            duration: animationSettings.duration.normal,
            delay: 100 * index
        });
    });
}

/**
 * Badge Animations
 */
function initBadgeAnimations() {
    // Badge hover animations
    const badges = document.querySelectorAll('.badge-item');
    
    badges.forEach(badge => {
        badge.addEventListener('mouseenter', () => {
            anime({
                targets: badge,
                scale: [1, 1.05],
                boxShadow: ['0 5px 15px rgba(0,0,0,0.1)', '0 8px 20px rgba(0,0,0,0.2)'],
                duration: animationSettings.duration.fast,
                easing: animationSettings.easing.smooth
            });
        });
        
        badge.addEventListener('mouseleave', () => {
            anime({
                targets: badge,
                scale: [1.05, 1],
                boxShadow: ['0 8px 20px rgba(0,0,0,0.2)', '0 5px 15px rgba(0,0,0,0.1)'],
                duration: animationSettings.duration.fast,
                easing: animationSettings.easing.smooth
            });
        });
    });
}

/**
 * Micro-Interactions
 */
function initMicroInteractions() {
    // Button hover animations
    const buttons = document.querySelectorAll('button:not(.nav-item)');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            anime({
                targets: button,
                scale: 1.05,
                duration: animationSettings.duration.fast,
                easing: animationSettings.easing.smooth
            });
        });
        
        button.addEventListener('mouseleave', () => {
            anime({
                targets: button,
                scale: 1,
                duration: animationSettings.duration.fast,
                easing: animationSettings.easing.smooth
            });
        });
    });
    
    // Input focus animations
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            anime({
                targets: input,
                borderColor: ['var(--border-color)', 'var(--primary-color)'],
                duration: animationSettings.duration.fast,
                easing: animationSettings.easing.smooth
            });
        });
    });
}

/**
 * Advanced Animations
 */
function initAdvancedAnimations() {
    // Parallax scrolling effect for background elements
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.2;
            element.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
    
    // Morphing animations for shapes
    const morphingElements = document.querySelectorAll('.morphing-shape');
    
    morphingElements.forEach(element => {
        const paths = element.dataset.paths.split(',');
        let currentPath = 0;
        
        setInterval(() => {
            currentPath = (currentPath + 1) % paths.length;
            
            anime({
                targets: element,
                d: paths[currentPath],
                duration: 3000,
                easing: 'easeInOutQuad'
            });
        }, 5000);
    });
    
    // Particle effects
    initParticleEffects();
    
    // Text scramble effect
    initTextScrambleEffects();
    
    // 3D card tilt effect
    init3DCardEffects();
    
    // Liquid button effects
    initLiquidButtonEffects();
}

/**
 * Particle Effects
 */
function initParticleEffects() {
    // Create particle container if it doesn't exist
    let particleContainer = document.querySelector('.particle-container');
    
    if (!particleContainer) {
        particleContainer = document.createElement('div');
        particleContainer.classList.add('particle-container');
        document.body.appendChild(particleContainer);
    }
    
    // Create particles
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random position
        const posX = Math.random() * window.innerWidth;
        const posY = Math.random() * window.innerHeight;
        
        // Random size
        const size = Math.random() * 10 + 5;
        
        // Set styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        
        // Add to container
        particleContainer.appendChild(particle);
        
        // Animate particle
        anime({
            targets: particle,
            translateX: anime.random(-100, 100),
            translateY: anime.random(-100, 100),
            opacity: [
                { value: 0, duration: 0 },
                { value: Math.random() * 0.5 + 0.1, duration: 1000 },
                { value: 0, duration: 1000 }
            ],
            scale: [
                { value: 0, duration: 0 },
                { value: 1, duration: 1000 },
                { value: 0, duration: 1000 }
            ],
            easing: 'easeInOutQuad',
            duration: anime.random(3000, 8000),
            delay: anime.random(0, 2000),
            loop: true
        });
    }
}

/**
 * Text Scramble Effects
 */
function initTextScrambleEffects() {
    // Apply to section titles
    const sectionTitles = document.querySelectorAll('.section-header h2');
    
    sectionTitles.forEach(title => {
        const originalText = title.textContent;
        
        title.addEventListener('mouseenter', () => {
            // Create scramble effect
            let iteration = 0;
            const maxIterations = 10;
            const chars = '!<>-_\\/[]{}—=+*^?#________';
            
            const interval = setInterval(() => {
                title.textContent = originalText
                    .split('')
                    .map((char, index) => {
                        if (index < iteration) {
                            return originalText[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');
                
                if (iteration >= originalText.length) {
                    clearInterval(interval);
                }
                
                iteration += 1 / 3;
            }, 30);
        });
        
        title.addEventListener('mouseleave', () => {
            title.textContent = originalText;
        });
    });
}

/**
 * 3D Card Tilt Effects
 */
function init3DCardEffects() {
    // Apply to technique cards
    const cards = document.querySelectorAll('.technique-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 10;
            const angleY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

/**
 * Liquid Button Effects
 */
function initLiquidButtonEffects() {
    // Apply to primary buttons
    const buttons = document.querySelectorAll('.add-task-btn, .new-entry-btn, .start-btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            anime({
                targets: button,
                borderRadius: ['8px', '12px', '16px', '12px', '8px'],
                duration: 1000,
                easing: 'easeInOutSine',
                loop: true
            });
        });
        
        button.addEventListener('mouseleave', () => {
            anime.remove(button);
            anime({
                targets: button,
                borderRadius: '8px',
                duration: 500,
                easing: 'easeOutSine'
            });
        });
    });
}

/**
 * Ripple Effect
 */
function createRippleEffect(e) {
    const button = e.currentTarget;
    
    // Create ripple element
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-effect');
    
    // Position ripple
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    
    // Add ripple to button
    button.appendChild(ripple);
    
    // Animate ripple
    anime({
        targets: ripple,
        scale: [0, 1],
        opacity: [1, 0],
        easing: 'easeOutExpo',
        duration: 900,
        complete: () => {
            ripple.remove();
        }
    });
}
