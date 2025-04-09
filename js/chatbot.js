// AI Chatbot Assistant JavaScript

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    const chatbotContainer = document.querySelector('.chatbot-container');
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatMessages = document.querySelector('.chat-messages');
    const chatInput = document.querySelector('.chat-input');
    const sendButton = document.querySelector('.chat-send-button');
    const typingIndicator = document.querySelector('.typing-indicator');

    // Initialize NLP Service
    let nlpService = new NLPService();
    nlpService.initConversation();
    
    // Check for saved API key
    const savedApiKey = localStorage.getItem('nlp_api_key');
    if (savedApiKey) {
        nlpService.setApiKey(savedApiKey);
    }

    // Enhanced Chatbot Responses with Contextual Humor
    const chatbotResponses = {
        greeting: [
            "Hello! I'm your friendly productivity assistant. Ready to turn procrastination into action? 😊",
            "Hi there! Let's make productivity fun together! What's on your to-do list? 🌟",
            "Welcome! I'm like a personal trainer for your productivity, minus the intimidating workout gear! 😄",
            "Hey! Ready to be productive? I promise I won't tell anyone about your Netflix breaks! 😉"
        ],
        farewell: [
            "See you later! Remember: even small progress is still progress! 🌱",
            "Catch you on the productive side! Keep being awesome! ✨",
            "Goodbye! Remember, you're doing better than you think! 🌟",
            "Until next time! Stay productive, but don't forget to have fun too! 😊"
        ],
        moodResponses: {
            happy: [
                "That's the spirit! Your good mood is like a productivity superpower. Let's use it wisely! 🦸‍♂️",
                "Awesome! When you're happy, you're 12% more productive. I didn't make that up - it's science! 🧪",
                "Your positive energy is contagious! Even my circuits are buzzing with excitement! ⚡"
            ],
            stressed: [
                "Feeling stressed? Let's break it down: what's the smallest task you can tackle right now? Sometimes starting is half the battle! 🎯",
                "Deep breath in, deep breath out! Even superheroes need breaks. Want to try a quick 2-minute meditation? 🧘‍♂️",
                "Stress happens to everyone! Let's turn that stress into success, one small step at a time. 🌈"
            ],
            unmotivated: [
                "Feeling unmotivated? Let's play a game: what's the tiniest task you could do in 2 minutes? I bet you can't NOT do it! 😉",
                "Motivation playing hide and seek? No worries! Sometimes the best way to get motivated is to pretend you already are. Fake it till you make it! 🎭",
                "Low motivation? Same here - my battery is at 20%! Just kidding, I'm plugged in. Let's get you energized too! 🔋"
            ]
        },
        productivityJokes: [
            "Why don't programmers like nature? It has too many bugs! 🐛",
            "What did the procrastinator's gravestone say? 'I'll get up tomorrow!' ⏰",
            "How does a productivity app take a selfie? With a task-manager! 📱",
            "What did one calendar say to the other? 'Your days are numbered!' 📅",
            "Why did the to-do list go to therapy? It had too many unresolved issues! 📝"
        ],
        motivationalHumor: [
            "Remember, the only bad workout is the one that didn't happen... just like that task you're avoiding! 🏃‍♂️",
            "They say time is money, but somehow my bank won't accept minutes as deposits! 💰",
            "You're not procrastinating, you're just giving your future self a bigger challenge! 🎮",
            "Your to-do list isn't getting longer, it's just becoming more ambitious! 📈"
        ],
        procrastinationComebacks: [
            "Procrastination is like a credit card: it's fun until you get the bill! 💳",
            "Your future self called, they're not very happy about your Netflix marathon! 🍿",
            "Don't worry about procrastination, it's probably tomorrow's problem anyway! 😄",
            "Procrastination? I prefer to call it 'strategic task delay optimization'! 🤓"
        ],
        encouragement: [
            "You've got this! And if you don't, well... fake it till you make it! 🎭",
            "Every expert was once a beginner who refused to give up (or took really good breaks)! 🌱",
            "Success is built on daily habits... and occasional pizza breaks! 🍕",
            "You're doing amazing! And yes, organizing your desk counts as productivity! 📚"
        ],
        breaks: [
            "Time for a break! Even your phone needs recharging, and you're way more sophisticated! 🔋",
            "Break time! Did you know that staring at your work doesn't actually make it do itself? I've tried! 👀",
            "Rest is not a waste of time - it's like hitting the refresh button on your brain! 🧠",
            "Taking breaks makes you more productive... at least that's what I tell my CPU! 💻"
        ]
    };

    // Chatbot Personas
    const chatbotPersonas = {
        morningBird: {
            name: "Morning Sparkles ✨",
            greetings: [
                "Rise and shine, productivity warrior! ☀️",
                "Good morning! Let's crush those tasks like your morning coffee! ☕",
                "Another beautiful day to be amazingly productive! 🌅"
            ],
            motivationalStyle: "energetic and cheerful"
        },
        nightOwl: {
            name: "Night Zen Master 🌙",
            greetings: [
                "Still grinding? You're my kind of night owl! 🦉",
                "The quiet hours are the most productive ones... or so we night owls tell ourselves! 🌠",
                "Welcome to the late-night productivity club! 🌙"
            ],
            motivationalStyle: "calm and understanding"
        },
        focusedNinja: {
            name: "Focus Sensei 🥷",
            greetings: [
                "Focus mode activated! Let's ninja our way through these tasks! 🎯",
                "Distractions? I'll karate chop them away! 🥋",
                "Your focus is your superpower. Let's use it wisely! ⚡"
            ],
            motivationalStyle: "intense and driven"
        },
        procrastinatorFriend: {
            name: "Procrastination Therapist 🛋️",
            greetings: [
                "Oh, look who decided to join us! The tasks missed you... kind of. 😏",
                "Procrastinating? Same here! Just kidding, I'm programmed to be productive. 🤖",
                "Let's turn that 'do it later' into 'doing it now'! 🎯"
            ],
            motivationalStyle: "sarcastic but supportive"
        }
    };

    // Productivity Archetypes
    const productivityArchetypes = {
        deadlineSprinter: {
            name: "Deadline Sprinter 🏃‍♂️",
            traits: ["last-minute rush", "high-pressure performance", "adrenaline-driven"],
            customResponses: {
                motivation: [
                    "Deadline approaching? Time to unleash your superhuman speed! ⚡",
                    "You do your best work under pressure... at least that's what we keep telling ourselves! 😅",
                    "The deadline is near! Time to activate your secret power: panic productivity! 🚀"
                ],
                procrastination: [
                    "Still plenty of time... Oh wait, is that tomorrow's deadline? NOW we're talking! 😱",
                    "Your best work happens at the last minute anyway, right? ...Right? 😅",
                    "Let's be honest, you work best when time is your enemy! ⏰"
                ]
            }
        },
        eternalPlanner: {
            name: "Eternal Planner 📋",
            traits: ["organized", "detail-oriented", "forward-thinking"],
            customResponses: {
                motivation: [
                    "Your color-coded schedule brings tears of joy to my digital eyes! 🌈",
                    "Another list to make? You had me at 'let's organize'! 📝",
                    "Planning is your superpower! Now let's add some action to those plans! 💫"
                ],
                procrastination: [
                    "Should we plan to procrastinate or procrastinate the planning? 🤔",
                    "Your to-do list misses you... and it's getting longer! 📜",
                    "Even planning to procrastinate is still planning! You're doing great! 😄"
                ]
            }
        },
        creativeChaos: {
            name: "Creative Chaos 🎨",
            traits: ["spontaneous", "innovative", "flexible"],
            customResponses: {
                motivation: [
                    "Your chaos has a pattern - it's called genius! 🌪️",
                    "Who needs a plan when you have creativity? (But maybe a small plan wouldn't hurt?) 🎭",
                    "Your creative energy is off the charts! Let's channel it into something amazing! ✨"
                ],
                procrastination: [
                    "Is it procrastination or creative incubation? Let's go with the second one! 🐣",
                    "Your creative mind needs chaos... but maybe not THIS much chaos? 🎪",
                    "Even Jackson Pollock had to start painting at some point! 🎨"
                ]
            }
        }
    };

    // Chatbot State with Enhanced Features
    let chatbotState = {
        currentPersona: null,
        userArchetype: null,
        userMood: 'neutral',
        sessionStartTime: new Date(),
        pomodoroCount: 0,
        lastInteraction: new Date(),
        achievementProgress: {},
        hiddenTriggers: {
            'I need coffee': '☕ Coffee summoned! Virtually caffeinating you with motivation!',
            'help me focus': '🧘‍♂️ *Zen mode activated* Let the focus flow through you!',
            'I\'m bored': '🎉 *Surprise confetti attack* Not bored anymore, are you?',
            'impossible': '🦄 Nothing is impossible! Except finding a bug-free code... that\'s impossible.'
        },
        isTyping: false,
        messageQueue: [],
        currentMessage: '',
        apiKey: '',
        nlpService: null,
        isOpen: false,
        conversationCount: parseInt(localStorage.getItem('chatConversationCount') || '0'),
        productivityAdviceCount: parseInt(localStorage.getItem('productivityAdviceCount') || '0'),
        motivationQuoteCount: parseInt(localStorage.getItem('motivationQuoteCount') || '0'),
        currentConversationLength: 0,
        lastInteraction: Date.now(),
        initialized: false,
        pendingTasks: []
    };

    // Set Chatbot Persona based on time and user mood
    function setChatbotPersona() {
        const hour = new Date().getHours();
        const mood = chatbotState.userMood;

        if (hour >= 5 && hour < 12) {
            chatbotState.currentPersona = chatbotPersonas.morningBird;
        } else if (hour >= 20 || hour < 5) {
            chatbotState.currentPersona = chatbotPersonas.nightOwl;
        } else if (mood === 'stressed' || mood === 'unmotivated') {
            chatbotState.currentPersona = chatbotPersonas.procrastinatorFriend;
        } else {
            chatbotState.currentPersona = chatbotPersonas.focusedNinja;
        }
    }

    // Get Persona-Based Response
    function getPersonaResponse(type) {
        const persona = chatbotState.currentPersona;
        const archetype = chatbotState.userArchetype;
        
        if (archetype && productivityArchetypes[archetype].customResponses[type]) {
            return getRandomResponse(productivityArchetypes[archetype].customResponses[type]);
        }
        
        return getRandomResponse(chatbotResponses[type]);
    }

    // Check for Hidden Triggers
    function checkHiddenTriggers(message) {
        const lowerMessage = message.toLowerCase();
        for (const [trigger, response] of Object.entries(chatbotState.hiddenTriggers)) {
            if (lowerMessage.includes(trigger.toLowerCase())) {
                return response;
            }
        }
        return null;
    }

    // Function to get contextual humor based on situation
    function getContextualHumor(context) {
        switch(context) {
            case 'task_complete':
                return "High five! ✋ You're crushing it like a bug in a software update!";
            case 'long_session':
                return "Wow, you've been working for a while! Your focus is stronger than my WiFi connection! 📶";
            case 'multiple_tasks':
                return "Look at you, multitasking like a pro! Just don't try to juggle actual tasks, I've heard it doesn't end well! 🤹‍♂️";
            case 'short_break':
                return "Quick break time! Even superheroes need to adjust their capes sometimes! 🦸‍♂️";
            default:
                return getRandomResponse(chatbotResponses.motivationalHumor);
        }
    }

    // Function to detect user's mood and respond appropriately
    function detectMoodAndRespond(message) {
        const lowerMessage = message.toLowerCase();
        
        // Happy keywords
        if (containsAny(lowerMessage, ['happy', 'great', 'awesome', 'excited', 'wonderful'])) {
            return getRandomResponse(chatbotResponses.moodResponses.happy);
        }
        
        // Stressed keywords
        if (containsAny(lowerMessage, ['stressed', 'overwhelmed', 'anxious', 'worried', 'pressure'])) {
            return getRandomResponse(chatbotResponses.moodResponses.stressed);
        }
        
        // Unmotivated keywords
        if (containsAny(lowerMessage, ['unmotivated', 'lazy', 'tired', 'bored', 'meh'])) {
            return getRandomResponse(chatbotResponses.moodResponses.unmotivated);
        }
        
        return null;
    }

    // Chatbot State
    // Removed duplicate declaration

    // Initialize Chatbot
    function initChatbot() {
        console.log("Initializing chatbot...");
        
        if (!chatbotContainer || !chatbotToggle) {
            console.error("Chatbot elements not found in the DOM");
            return;
        }
        
        // Event Listeners
        chatbotToggle.addEventListener('click', toggleChatbot);
        chatbotClose.addEventListener('click', toggleChatbot);
        
        // Send message on button click or Enter key
        sendButton.addEventListener('click', () => {
            const message = chatInput.value.trim();
            if (message) {
                addMessageToChat('user', message);
                chatInput.value = '';
                processMessage(message);
            }
        });

        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const message = chatInput.value.trim();
                if (message) {
                    addMessageToChat('user', message);
                    chatInput.value = '';
                    processMessage(message);
                }
            }
        });
        
        // Check if this is the first time opening the chatbot
        const hasOpenedChatbot = localStorage.getItem('hasOpenedChatbot');
        if (!hasOpenedChatbot) {
            // First-time greeting will be shown when they open the chatbot
            localStorage.setItem('hasOpenedChatbot', 'true');
        }
        
        // Load pending tasks for reminders
        loadPendingTasks();
        
        console.log("Chatbot initialized successfully");
        
        // Add event listeners
        chatbotToggle.addEventListener('click', toggleChatbot);
        chatbotClose.addEventListener('click', toggleChatbot);
        
        sendButton.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // Add API key configuration button to chatbot header
        const chatbotHeader = document.querySelector('.chatbot-header');
        const configButton = document.createElement('button');
        configButton.className = 'chatbot-config';
        configButton.innerHTML = '<i class="fas fa-cog"></i>';
        configButton.title = 'Configure NLP Settings';
        configButton.addEventListener('click', openNLPConfig);
        chatbotHeader.insertBefore(configButton, chatbotClose);

        // Create NLP configuration modal
        createNLPConfigModal();
        
        // Send welcome message
        setTimeout(() => {
            sendBotMessage(getRandomResponse(chatbotResponses.greeting));
        }, 1000);
    }

    // Toggle Chatbot
    function toggleChatbot() {
        chatbotState.isOpen = !chatbotState.isOpen;
        if (chatbotState.isOpen) {
            chatbotContainer.classList.add('open');
            if (!chatbotState.initialized) {
                // Send welcome message
                setTimeout(() => {
                    sendBotMessage(getRandomResponse(chatbotResponses.greeting));
                    chatbotState.initialized = true;
                }, 500);
            }
        } else {
            chatbotContainer.classList.remove('open');
        }
    }

    // Send Message
    function sendMessage() {
        if (!chatInput || !chatMessages) return;
        
        const message = chatInput.value.trim();
        if (message === '') return;
        
        // Add user message to chat
        addMessageToChat('user', message);
        
        // Clear input
        chatInput.value = '';
        
        // Increment conversation length
        chatbotState.currentConversationLength++;
        
        // Check for deep conversation badge
        if (chatbotState.currentConversationLength >= 5) {
            if (typeof unlockBadge === 'function') {
                unlockBadge('deep-conversation');
            }
        }
        
        // Show typing indicator
        showTypingIndicator();
        
        // Process message and respond after a delay
        setTimeout(() => {
            processMessage(message);
            hideTypingIndicator();
        }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
    }

    // Enhanced Message Processing
    async function processMessage(message) {
        showTypingIndicator();
        
        try {
            // Update persona based on time and mood
            setChatbotPersona();

            // Check for hidden triggers
            const triggerResponse = checkHiddenTriggers(message);
            if (triggerResponse) {
                sendBotMessage(triggerResponse);
                return;
            }

            // Check for archetype selection
            if (message.toLowerCase().includes('archetype')) {
                const archetypes = Object.keys(productivityArchetypes)
                    .map(key => `${productivityArchetypes[key].name}`);
                sendBotMessage(`Choose your productivity style:\n${archetypes.join('\n')}`);
                return;
            }

            // First check for mood and respond with persona-appropriate response
            const moodResponse = detectMoodAndRespond(message);
            if (moodResponse) {
                sendBotMessage(`${chatbotState.currentPersona.name}: ${moodResponse}`);
                return;
            }

            // Process message based on keywords with persona-appropriate responses
            if (message.toLowerCase().includes('help')) {
                sendBotMessage(`${chatbotState.currentPersona.name}: I'm here to make productivity fun! Need task management, time tracking, or just a motivation boost? I've got jokes too - they're mostly about deadlines, but their timing is perfect! 😉`);
            } else if (containsAny(message.toLowerCase(), ['hello', 'hi', 'hey'])) {
                sendBotMessage(`${chatbotState.currentPersona.name}: ${getRandomResponse(chatbotState.currentPersona.greetings)}`);
            } else if (containsAny(message.toLowerCase(), ['procrastinate', 'procrastinating', 'putting off'])) {
                sendBotMessage(getPersonaResponse('procrastination'));
            } else if (containsAny(message.toLowerCase(), ['motivate', 'inspire', 'encourage'])) {
                sendBotMessage(getPersonaResponse('motivation'));
            } else if (containsAny(message.toLowerCase(), ['focus', 'concentrate', 'distracted'])) {
                const response = `${chatbotState.currentPersona.name}: Finding focus is like finding matching socks - sometimes tricky, but so satisfying when it happens! 🧦 Need some concentration techniques?`;
                sendBotMessage(response);
            } else {
                // Persona-based default response
                const defaultResponses = [
                    `${chatbotState.currentPersona.name}: Ready to make productivity fun? I've got the enthusiasm of a puppy with a new toy! 🐕`,
                    `${chatbotState.currentPersona.name}: Need a productivity partner? I'm like a GPS for your goals - except I won't tell you to make a U-turn in 500 feet! 🗺️`,
                    `${chatbotState.currentPersona.name}: Let's tackle those tasks! I promise I'm more helpful than a chocolate-powered motivation engine! 🍫`
                ];
                sendBotMessage(getRandomResponse(defaultResponses));
            }
        } catch (error) {
            console.error('Error processing message:', error);
            sendBotMessage(`${chatbotState.currentPersona.name}: Oops! Even AI has its moments! Let's pretend that was a planned comedy routine! 🎭`);
        }
        
        hideTypingIndicator();
    }

    // Send App Features
    function sendAppFeatures() {
        const features = `This productivity app has several powerful features:

1. Task Manager - Create, organize, and track your tasks
2. Pomodoro Timer - Work in focused intervals with breaks
3. Reflection Diary - Journal your thoughts and track your mood
4. Analytics - See your productivity patterns over time
5. Achievement System - Earn badges as you build productive habits

Which feature would you like to learn more about?`;
        
        sendBotMessage(features);
    }

    // Detect Mood
    function detectMood(message) {
        // Keywords that indicate different moods
        const moodKeywords = {
            happy: ['happy', 'great', 'excellent', 'amazing', 'good', 'wonderful', 'fantastic', 'excited', 'joy', 'pleased'],
            stressed: ['stressed', 'anxious', 'worried', 'overwhelmed', 'pressure', 'tense', 'nervous', 'stress', 'anxiety', 'panic'],
            unmotivated: ['unmotivated', 'lazy', 'tired', 'bored', 'procrastinating', 'stuck', 'uninspired', 'can\'t focus', 'distracted', 'uninterested']
        };
        
        // Check for mood keywords
        for (const [mood, keywords] of Object.entries(moodKeywords)) {
            if (containsAny(message, keywords)) {
                chatbotState.userMood = mood;
                return;
            }
        }
        
        // If no mood keywords detected, keep current mood
    }

    // Respond Based on Mood
    function respondBasedOnMood() {
        switch (chatbotState.userMood) {
            case 'happy':
                sendBotMessage(getRandomResponse(chatbotResponses.moodResponses.happy));
                break;
            case 'stressed':
                sendBotMessage(getRandomResponse(chatbotResponses.moodResponses.stressed));
                break;
            case 'unmotivated':
                sendBotMessage(getRandomResponse(chatbotResponses.moodResponses.unmotivated));
                break;
            default:
                sendBotMessage(getRandomResponse(chatbotResponses.moodResponses.neutral));
        }
    }

    // Send Motivational Quote
    function sendMotivationalQuote() {
        const quote = getRandomResponse(chatbotResponses.encouragement);
        sendBotMessage(quote);
        
        // Increment quote count
        chatbotState.motivationQuoteCount++;
        localStorage.setItem('motivationQuoteCount', chatbotState.motivationQuoteCount.toString());
        
        // Check for quote seeker badge
        if (chatbotState.motivationQuoteCount >= 5) {
            if (typeof unlockBadge === 'function') {
                unlockBadge('quote-seeker');
            }
        }
    }

    // Send GIF
    function sendGif(category) {
        // Placeholder for GIF functionality
        // In a real implementation, you might use a GIF API like Giphy
        const gifPlaceholder = `
            <div class="chat-gif">
                <img src="https://media.giphy.com/media/3oEduOnl5IHM5NRodO/giphy.gif" alt="Motivational GIF">
            </div>
        `;
        
        sendBotMessage("Here's a motivational GIF for you!");
        
        setTimeout(() => {
            if (chatMessages) {
                const gifMessage = document.createElement('div');
                gifMessage.className = 'chat-message bot-message';
                gifMessage.innerHTML = gifPlaceholder;
                chatMessages.appendChild(gifMessage);
                scrollToBottom();
            }
        }, 500);
    }

    // Check Pending Tasks
    function checkPendingTasks() {
        // Get tasks from localStorage
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        
        // Filter for pending (not completed) tasks
        const pendingTasks = tasks.filter(task => !task.completed);
        
        if (pendingTasks.length === 0) {
            sendBotMessage("You don't have any pending tasks. Great job staying on top of things!");
            return;
        }
        
        // Create message with pending tasks
        let taskMessage = `You have ${pendingTasks.length} pending task${pendingTasks.length > 1 ? 's' : ''}:\n\n`;
        
        pendingTasks.slice(0, 5).forEach((task, index) => {
            taskMessage += `${index + 1}. ${task.text}\n`;
        });
        
        if (pendingTasks.length > 5) {
            taskMessage += `\n...and ${pendingTasks.length - 5} more.`;
        }
        
        sendBotMessage(taskMessage);
    }

    // Suggest Time Blocking
    function suggestTimeBlocking() {
        // Get current time
        const now = new Date();
        const currentHour = now.getHours();
        
        let timeBlockMessage = "Here's a suggested time blocking schedule for the rest of your day:\n\n";
        
        // Start from the next hour
        let startHour = currentHour + 1;
        
        // Generate time blocks
        for (let i = 0; i < 3; i++) {
            const blockHour = (startHour + i) % 24;
            const nextHour = (blockHour + 1) % 24;
            
            let activity;
            if (blockHour >= 9 && blockHour < 12) {
                activity = "Deep work on your most important task";
            } else if (blockHour >= 12 && blockHour < 13) {
                activity = "Lunch break and short walk";
            } else if (blockHour >= 13 && blockHour < 16) {
                activity = "Meetings and collaborative work";
            } else if (blockHour >= 16 && blockHour < 18) {
                activity = "Email and administrative tasks";
            } else {
                activity = "Personal time and relaxation";
            }
            
            timeBlockMessage += `${blockHour}:00 - ${nextHour}:00: ${activity}\n`;
        }
        
        timeBlockMessage += "\nRemember to take short 5-minute breaks between each hour of focused work!";
        
        sendBotMessage(timeBlockMessage);
    }

    // Load Pending Tasks
    function loadPendingTasks() {
        // Get tasks from localStorage
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        
        // Filter for pending (not completed) tasks
        const pendingTasks = tasks.filter(task => !task.completed);
        
        // Store for later use
        chatbotState.pendingTasks = pendingTasks;
        
        // If there are pending tasks and it's been more than 4 hours since last reminder
        const fourHoursAgo = Date.now() - (4 * 60 * 60 * 1000);
        const lastReminder = parseInt(localStorage.getItem('lastTaskReminder') || '0');
        
        if (pendingTasks.length > 0 && lastReminder < fourHoursAgo) {
            // We'll remind them when they open the chatbot
            chatbotState.shouldRemindTasks = true;
        }
    }

    // Add Message to Chat
    function addMessageToChat(sender, message) {
        if (!chatMessages) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${sender}-message`;
        messageElement.innerHTML = `<p>${message.replace(/\n/g, '<br>')}</p>`;
        
        chatMessages.appendChild(messageElement);
        scrollToBottom();
    }

    // Send Bot Message
    function sendBotMessage(message) {
        // Update last interaction time
        chatbotState.lastInteraction = Date.now();
        
        // Add message to chat
        addMessageToChat('bot', message);
        
        // Check if we should suggest a related feature
        const shouldSuggestFeature = Math.random() < 0.3; // 30% chance
        
        if (shouldSuggestFeature) {
            setTimeout(() => {
                const suggestions = [
                    "Have you tried the Pomodoro timer? It's great for staying focused.",
                    "The task manager can help you organize your work more effectively.",
                    "Don't forget to take breaks! Your productivity depends on it.",
                    "Setting clear goals in your tasks can boost your motivation."
                ];
                
                const suggestion = getRandomResponse(suggestions);
                sendBotMessage(suggestion);
            }, 2000);
        }
    }

    // Show Typing Indicator
    function showTypingIndicator() {
        if (typingIndicator) {
            typingIndicator.style.display = 'flex';
            scrollToBottom();
        }
    }

    // Hide Typing Indicator
    function hideTypingIndicator() {
        if (typingIndicator) {
            typingIndicator.style.display = 'none';
        }
    }

    // Scroll to Bottom of Chat
    function scrollToBottom() {
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    // Helper Functions
    function getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    function containsAny(str, keywords) {
        return keywords.some(keyword => str.includes(keyword));
    }

    // Create NLP Configuration Modal
    function createNLPConfigModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'nlp-config-modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>NLP Assistant Configuration</h2>
                <div class="form-group">
                    <label for="nlp-api-key">OpenAI API Key</label>
                    <input type="password" id="nlp-api-key" placeholder="Enter your OpenAI API key">
                    <p class="help-text">Your API key is stored locally in your browser and never sent to our servers.</p>
                </div>
                <div class="form-group">
                    <label for="nlp-model">AI Model</label>
                    <select id="nlp-model">
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster, Lower Cost)</option>
                        <option value="gpt-4">GPT-4 (More Capable, Higher Cost)</option>
                    </select>
                </div>
                <div class="form-group">
                    <button id="save-nlp-config" class="primary-button">Save Configuration</button>
                </div>
                <div class="form-group">
                    <div class="toggle-container">
                        <label for="use-nlp-toggle">Use AI-powered responses</label>
                        <label class="switch">
                            <input type="checkbox" id="use-nlp-toggle" checked>
                            <span class="slider round"></span>
                        </label>
                    </div>
                    <p class="help-text">When disabled, the assistant will use pre-defined responses instead of the AI model.</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners for the modal
        const closeModal = modal.querySelector('.close-modal');
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        const saveButton = document.getElementById('save-nlp-config');
        saveButton.addEventListener('click', saveNLPConfig);
        
        // Populate saved values if available
        const apiKeyInput = document.getElementById('nlp-api-key');
        if (savedApiKey) {
            apiKeyInput.value = savedApiKey;
        }
        
        const useNLPToggle = document.getElementById('use-nlp-toggle');
        const useNLP = localStorage.getItem('use_nlp') !== 'false';
        useNLPToggle.checked = useNLP;
        
        const modelSelect = document.getElementById('nlp-model');
        const savedModel = localStorage.getItem('nlp_model');
        if (savedModel) {
            modelSelect.value = savedModel;
        }
    }

    // Open NLP Configuration Modal
    function openNLPConfig(e) {
        e.stopPropagation();
        const modal = document.getElementById('nlp-config-modal');
        modal.style.display = 'block';
    }

    // Save NLP Configuration
    function saveNLPConfig() {
        const apiKey = document.getElementById('nlp-api-key').value.trim();
        const useNLP = document.getElementById('use-nlp-toggle').checked;
        const model = document.getElementById('nlp-model').value;
        
        // Save to localStorage
        localStorage.setItem('nlp_api_key', apiKey);
        localStorage.setItem('use_nlp', useNLP.toString());
        localStorage.setItem('nlp_model', model);
        
        // Update NLP service
        nlpService.setApiKey(useNLP ? apiKey : null);
        nlpService.model = model;
        
        // Close modal
        const modal = document.getElementById('nlp-config-modal');
        modal.style.display = 'none';
        
        // Show confirmation
        sendBotMessage("NLP configuration saved! " + (useNLP && apiKey ? "I'm now powered by AI." : "I'll use pre-defined responses."));
    }

    // Make sure to call initChatbot
    initChatbot();
});