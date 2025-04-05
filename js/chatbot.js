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

    // Chatbot Responses
    const chatbotResponses = {
        greeting: [
            "Hello! I'm your productivity assistant. How can I help you today? ",
            "Hi there! Ready to boost your productivity? Ask me anything! ",
            "Welcome back! What productivity challenges can I help you with today? ",
            "Hey! I'm here to make your day more productive and fun. What's on your mind? "
        ],
        farewell: [
            "Goodbye! Remember: small steps every day lead to big results! ",
            "See you later! Don't forget to take breaks between tasks - your brain needs them! ",
            "Until next time! Stay focused, stay awesome! ",
            "Catch you later! Remember that progress is progress, no matter how small! "
        ],
        moodResponses: {
            happy: [
                "That's fantastic! Positive energy is like rocket fuel for productivity. Let's channel that energy! ",
                "Awesome! When you're in a good mood, you're 12% more productive according to research. Let's make the most of it! ",
                "Love that positive vibe! Did you know happy people are more creative problem solvers? What are you working on today? "
            ],
            neutral: [
                "How can I help boost your productivity today? I've got tips, tricks, and maybe a joke or two! ",
                "Need some productivity advice or just a quick brain break? I'm here for both! What can I help with? ",
                "I'm your productivity sidekick! Need help with focus, task management, or just a quick motivation boost? "
            ],
            stressed: [
                "I can tell you're feeling the pressure. Let's break things down: what's your biggest stressor right now? Sometimes just naming it helps. ",
                "When you're stressed, your brain's prefrontal cortex (the planning part) works less efficiently. Let's take 3 deep breaths together, then tackle one small task. ",
                "Stress happens to everyone! Try the 5-5-5 technique: name 5 things you see, 5 things you hear, and 5 body parts you can feel. It helps reset your nervous system. Then we'll tackle your tasks. "
            ],
            unmotivated: [
                "Motivation slump? Try the 'two-minute rule' - if something takes less than two minutes, do it now. What's one tiny task you could knock out? ",
                "Feeling unmotivated is your brain asking for either rest or novelty. Which do you think you need right now? ",
                "Low motivation happens to everyone! Try changing your environment - even moving to a different chair can give your brain a fresh perspective. Want to try that? "
            ]
        },
        jokes: [
            "Why don't scientists trust atoms? Because they make up everything! ",
            "Why did the scarecrow win an award? Because he was outstanding in his field! ",
            "How does a computer get drunk? It takes screenshots! ",
            "Why don't programmers like nature? It has too many bugs! ",
            "What did the janitor say when he jumped out of the closet? SUPPLIES! ",
            "Why did the developer go broke? Because he used up all his cache! ",
            "What's a computer's favorite snack? Microchips! ",
            "Why was the math book sad? Because it had too many problems! "
        ],
        quotes: [
            "\"The secret of getting ahead is getting started.\" – Mark Twain ",
            "\"It always seems impossible until it's done.\" – Nelson Mandela ",
            "\"Don't watch the clock; do what it does. Keep going.\" – Sam Levenson ",
            "\"Productivity is never an accident. It is always the result of a commitment to excellence.\" – Paul J. Meyer ",
            "\"You don't have to be great to start, but you have to start to be great.\" – Zig Ziglar ",
            "\"The way to get started is to quit talking and begin doing.\" – Walt Disney ",
            "\"Focus on being productive instead of busy.\" – Tim Ferriss ",
            "\"Until we can manage time, we can manage nothing else.\" – Peter Drucker ",
            "\"The most difficult thing is the decision to act, the rest is merely tenacity.\" – Amelia Earhart ",
            "\"Success is not final, failure is not fatal: it is the courage to continue that counts.\" – Winston Churchill "
        ],
        breaks: [
            "Taking breaks is essential! The ideal work-to-break ratio is 52 minutes of work followed by a 17-minute break, according to research. Want to try it? ",
            "Your brain needs breaks! Even a 30-second microbreak of looking at nature can improve concentration by 13%. Maybe look out the window for a moment? ",
            "Did you know? Regular breaks improve creativity! The 'aha moment' often happens when you step away from the problem. What's your favorite quick break activity? "
        ],
        techniques: {
            pomodoro: "The Pomodoro Technique is a productivity powerhouse! Work for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer 15-30 minute break. This method works because it aligns with your brain's natural focus cycles. Want me to time a Pomodoro session for you? ",
            gtd: "Getting Things Done (GTD) is all about clearing your mind by capturing everything. The 5 steps are: 1) Capture everything that needs your attention, 2) Clarify what each item means and what to do about it, 3) Organize the results into a system you trust, 4) Reflect on your options, and 5) Engage and take action. Which step do you struggle with most? ",
            eisenhower: "The Eisenhower Matrix is a game-changer for prioritization! Divide tasks into four categories: 1) Urgent & Important (do now), 2) Important but Not Urgent (schedule time), 3) Urgent but Not Important (delegate if possible), 4) Neither Urgent nor Important (eliminate). This method was used by President Eisenhower and is why he accomplished so much! Want help categorizing your tasks? "
        },
        timeBlocking: [
            "Time blocking is like making appointments with yourself. Research shows it can reduce the constant switching that costs us 40% of our productive time! Try blocking 90-minute deep work sessions when your energy is highest. ",
            "Pro tip for time blocking: Include buffer time between blocks! Things often take 1.5x longer than we expect. I recommend 15-minute buffers between major tasks. ",
            "Time blocking works best when aligned with your energy levels. Most people have peak focus 2-4 hours after waking up. When's your peak energy time? "
        ],
        taskReminders: [
            "I noticed you have some pending tasks. Research shows that having unfinished tasks in mind creates mental tension called the Zeigarnik effect. Want to review them to clear your mental space? ",
            "Your pending tasks are waiting! Did you know that writing down your tasks can increase your productivity by 23%? Let's review what you need to tackle. ",
            "About those pending tasks... Studies show that completing just one task on your list can boost your motivation to continue. Which one could you finish today? "
        ],
        focus: [
            "Need to focus? Try the 3-3-3 rule: Focus on just 3 tasks, for 3 hours, with 3 minutes of preparation. It's simple but effective! ",
            "To improve focus, try the 20-20-20 rule if you work on screens: Every 20 minutes, look at something 20 feet away for 20 seconds. It reduces eye strain and mental fatigue! ",
            "Did you know that background noise at about 70 decibels (like coffee shop chatter) can actually improve creative thinking? Try coffitivity.com if you're stuck on a creative task! "
        ],
        motivation: [
            "Need a motivation boost? Try 'temptation bundling' - pair something you need to do with something you want to do. Like watching your favorite show only while folding laundry! ",
            "For motivation, try the 5-second rule: If you have an impulse to act on a goal, count 5-4-3-2-1 and physically move before your brain kills the idea. It works! ",
            "Motivation hack: Use implementation intentions - 'If [situation X], then I will [behavior Y]'. This format makes you 2-3x more likely to follow through! "
        ],
        procrastination: [
            "Fighting procrastination? Try the 'Swiss cheese' approach - poke small holes in the task by doing tiny portions. Even 5 minutes counts! ",
            "Procrastinating? Your brain might be protecting you from negative emotions. Ask yourself: What feeling am I avoiding by not starting? Name it to tame it! ",
            "Pro tip for procrastination: Make the first step ridiculously small. Don't write a paper - just open the document. Don't clean the house - just put one thing away. Starting is the hardest part! "
        ],
        fallback: [
            "I'm still learning! Could you rephrase that or ask something about productivity, time management, or motivation? ",
            "Hmm, I'm not sure I understood that correctly. I'm best at helping with productivity tips, focus techniques, and motivation boosts. What can I help with? ",
            "I didn't quite catch that. I'm your productivity assistant - I can help with work techniques, time management, motivation, or even tell a joke to brighten your day! "
        ],
        knowledgeBase: {
            "pomodoro": "The Pomodoro Technique was developed by Francesco Cirillo in the late 1980s. It uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks. Each interval is known as a 'pomodoro', the Italian word for tomato, after the tomato-shaped kitchen timer Cirillo used as a university student. ",
            "deep work": "Deep Work is a concept coined by Cal Newport in his 2016 book. It refers to professional activities performed in a state of distraction-free concentration that push your cognitive capabilities to their limit. These efforts create new value, improve your skill, and are hard to replicate. The opposite is 'Shallow Work' - non-cognitively demanding, logistical-style tasks. ",
            "flow state": "Flow state, also known as being 'in the zone', is a mental state where a person is fully immersed and focused on an activity, with energized focus and enjoyment. It was identified by psychologist Mihály Csíkszentmihályi. To achieve flow, you need clear goals, immediate feedback, and a balance between the challenge of the task and your skill level. ",
            "time blocking": "Time blocking is a productivity method where you divide your day into blocks of time, each dedicated to accomplishing a specific task or group of tasks. It helps combat Parkinson's Law (work expands to fill the time available) and prevents multitasking, which can reduce productivity by up to 40%. ",
            "eat the frog": "\"Eat the Frog\" is a productivity technique based on a quote attributed to Mark Twain: \"If it's your job to eat a frog, it's best to do it first thing in the morning.\" The 'frog' is your most important task of the day - the one you're most likely to procrastinate on. By tackling it first, you ensure it gets done. ",
            "pareto principle": "The Pareto Principle, also known as the 80/20 rule, states that roughly 80% of effects come from 20% of causes. In productivity, this means 80% of your results come from 20% of your efforts. Identifying and focusing on that critical 20% can dramatically improve your efficiency. ",
            "parkinson's law": "Parkinson's Law states that 'work expands to fill the time available for its completion.' This means if you give yourself a week to complete a task that should take an hour, the task will grow in complexity to fill that week. Setting tight but realistic deadlines can help combat this tendency. "
        }
    };

    // Chatbot State
    let chatbotState = {
        isOpen: false,
        conversationCount: parseInt(localStorage.getItem('chatConversationCount') || '0'),
        productivityAdviceCount: parseInt(localStorage.getItem('productivityAdviceCount') || '0'),
        motivationQuoteCount: parseInt(localStorage.getItem('motivationQuoteCount') || '0'),
        currentConversationLength: 0,
        userMood: 'neutral', // Can be: happy, neutral, stressed, unmotivated
        lastInteraction: Date.now()
    };

    // Initialize Chatbot
    function initChatbot() {
        console.log("Initializing chatbot...");
        
        if (!chatbotContainer || !chatbotToggle) {
            console.error("Chatbot elements not found in the DOM");
            return;
        }
        
        // Set up event listeners
        chatbotToggle.addEventListener('click', function() {
            console.log("Toggle button clicked");
            toggleChatbot();
        });
        
        if (chatbotClose) {
            chatbotClose.addEventListener('click', function() {
                console.log("Close button clicked");
                toggleChatbot();
            });
        }
        
        if (sendButton && chatInput) {
            sendButton.addEventListener('click', function() {
                console.log("Send button clicked");
                sendMessage();
            });
            
            chatInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    console.log("Enter key pressed in input");
                    sendMessage();
                }
            });
        }
        
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
        console.log("Toggling chatbot, current state:", chatbotState.isOpen);
        chatbotState.isOpen = !chatbotState.isOpen;
        
        if (chatbotContainer) {
            if (chatbotState.isOpen) {
                console.log("Opening chatbot");
                chatbotContainer.classList.add('open');
                
                // If this is the first message in a new conversation
                if (chatMessages && chatMessages.children.length === 0) {
                    console.log("Sending greeting message");
                    // Send greeting message
                    const greeting = getRandomResponse(chatbotResponses.greeting);
                    sendBotMessage(greeting);
                    
                    // Check for pending tasks after a short delay
                    setTimeout(() => {
                        checkPendingTasks();
                    }, 1000);
                    
                    // Increment conversation count
                    chatbotState.conversationCount++;
                    localStorage.setItem('chatConversationCount', chatbotState.conversationCount.toString());
                    
                    // Reset conversation length counter
                    chatbotState.currentConversationLength = 1;
                    
                    // Check for first conversation badge
                    if (chatbotState.conversationCount === 1) {
                        if (typeof unlockBadge === 'function') {
                            unlockBadge('chatbot-hello');
                        }
                    } else if (chatbotState.conversationCount === 10) {
                        if (typeof unlockBadge === 'function') {
                            unlockBadge('chatbot-enthusiast');
                        }
                    }
                }
            } else {
                console.log("Closing chatbot");
                chatbotContainer.classList.remove('open');
            }
        } else {
            console.error("Chatbot container not found");
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

    // Process Message
    async function processMessage(message) {
        // Check if we should use NLP service
        const useNLP = localStorage.getItem('use_nlp') !== 'false';
        const apiKey = localStorage.getItem('nlp_api_key');
        
        if (useNLP && apiKey) {
            try {
                showTypingIndicator();
                
                // Get response from NLP service
                const response = await nlpService.processMessage(message);
                
                hideTypingIndicator();
                sendBotMessage(response);
                
                return;
            } catch (error) {
                console.error('Error with NLP service:', error);
                hideTypingIndicator();
                // Fall back to rule-based responses
            }
        }
        
        // If NLP is disabled or failed, use the original rule-based responses
        showTypingIndicator();
        
        // Simulate typing delay
        setTimeout(() => {
            hideTypingIndicator();
            
            // Original rule-based processing
            const messageLower = message.toLowerCase();
            
            // Detect user mood from message
            detectMood(messageLower);
            
            // Check for specific knowledge questions first
            if (messageLower.includes('what time is it') || messageLower.includes('current time')) {
                const now = new Date();
                const timeString = now.toLocaleTimeString();
                sendBotMessage(`The current time is ${timeString}. Time is our most valuable resource - use it wisely! `);
                return;
            }
            
            if (messageLower.includes('what day is') || messageLower.includes('what date is')) {
                const now = new Date();
                const dateString = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                sendBotMessage(`Today is ${dateString}. Each new day is a fresh start! `);
                return;
            }
            
            // Check for knowledge base items
            for (const [key, value] of Object.entries(chatbotResponses.knowledgeBase)) {
                if (messageLower.includes(key)) {
                    sendBotMessage(value);
                    return;
                }
            }
            
            if (messageLower.includes('pomodoro timer') || messageLower.includes('start pomodoro')) {
                sendBotMessage("I'll help you start a Pomodoro session! The timer tab is available in the app. Would you like me to explain how to use it effectively? ");
                return;
            }
            
            if (messageLower.includes('how to use this app') || messageLower.includes('app features') || messageLower.includes('what can this app do')) {
                sendAppFeatures();
                return;
            }
            
            if (messageLower.includes('best productivity technique') || messageLower.includes('most effective technique')) {
                sendBotMessage("The most effective productivity technique depends on your personal style and the task at hand. Research shows the Pomodoro Technique works well for focus, GTD for organization, and time blocking for planning. Which aspect of productivity are you struggling with? I can recommend a specific technique for your needs. ");
                return;
            }
            
            if (messageLower.includes('focus tips') || messageLower.includes('how to focus') || messageLower.includes('improve focus')) {
                sendBotMessage(getRandomResponse(chatbotResponses.focus));
                return;
            }
            
            if (messageLower.includes('procrastination') || messageLower.includes('procrastinating') || messageLower.includes('putting off')) {
                sendBotMessage(getRandomResponse(chatbotResponses.procrastination));
                return;
            }
            
            if (messageLower.includes('motivation') || messageLower.includes('motivate me') || messageLower.includes('feeling lazy')) {
                sendBotMessage(getRandomResponse(chatbotResponses.motivation));
                return;
            }
            
            // Check for specific requests (original logic)
            if (containsAny(messageLower, ['hello', 'hi', 'hey', 'greetings'])) {
                sendBotMessage(getRandomResponse(chatbotResponses.greeting));
            }
            else if (containsAny(messageLower, ['bye', 'goodbye', 'see you', 'farewell'])) {
                sendBotMessage(getRandomResponse(chatbotResponses.farewell));
            }
            else if (containsAny(messageLower, ['motivate', 'motivation', 'inspire', 'quote'])) {
                sendMotivationalQuote();
            }
            else if (containsAny(messageLower, ['joke', 'funny', 'laugh', 'humor'])) {
                sendBotMessage(getRandomResponse(chatbotResponses.jokes));
            }
            else if (containsAny(messageLower, ['gif', 'animation'])) {
                sendGif('motivation');
            }
            else if (containsAny(messageLower, ['pomodoro', 'timer', 'focus technique'])) {
                sendBotMessage(chatbotResponses.techniques.pomodoro);
            }
            else if (containsAny(messageLower, ['gtd', 'getting things done', 'organize tasks'])) {
                sendBotMessage(chatbotResponses.techniques.gtd);
            }
            else if (containsAny(messageLower, ['eisenhower', 'priority matrix', 'prioritize'])) {
                sendBotMessage(chatbotResponses.techniques.eisenhower);
                
                // Increment productivity advice count
                chatbotState.productivityAdviceCount++;
                localStorage.setItem('productivityAdviceCount', chatbotState.productivityAdviceCount.toString());
                
                // Check for productivity seeker badge
                if (chatbotState.productivityAdviceCount >= 5) {
                    if (typeof unlockBadge === 'function') {
                        unlockBadge('productivity-seeker');
                    }
                }
            }
            else if (containsAny(messageLower, ['break', 'rest', 'pause', 'tired'])) {
                sendBotMessage(getRandomResponse(chatbotResponses.breaks));
            }
            else if (containsAny(messageLower, ['task', 'todo', 'to-do', 'pending'])) {
                checkPendingTasks();
            }
            else if (containsAny(messageLower, ['time block', 'schedule', 'plan my day'])) {
                suggestTimeBlocking();
            }
            else if (containsAny(messageLower, ['stressed', 'anxious', 'overwhelmed', 'pressure'])) {
                chatbotState.userMood = 'stressed';
                sendBotMessage(getRandomResponse(chatbotResponses.moodResponses.stressed));
            }
            else if (containsAny(messageLower, ['unmotivated', 'lazy', 'procrastinating', 'can\'t start'])) {
                chatbotState.userMood = 'unmotivated';
                sendBotMessage(getRandomResponse(chatbotResponses.moodResponses.unmotivated));
            }
            else if (containsAny(messageLower, ['happy', 'great', 'awesome', 'productive'])) {
                chatbotState.userMood = 'happy';
                sendBotMessage(getRandomResponse(chatbotResponses.moodResponses.happy));
            }
            else {
                // Try to extract a question
                const questionWords = ['what', 'how', 'why', 'when', 'where', 'who', 'which', 'can', 'could', 'would', 'should', 'is', 'are', 'do', 'does'];
                const isQuestion = questionWords.some(word => messageLower.startsWith(word) || messageLower.includes(` ${word} `));
                
                if (isQuestion) {
                    // Try to provide a more specific answer based on keywords
                    if (messageLower.includes('productivity') && messageLower.includes('tip')) {
                        const tips = [
                            "One of my favorite productivity tips is the 'touch it once' principle. When you encounter an email, message, or task, deal with it immediately rather than coming back to it multiple times. ",
                            "Try the 'two-minute rule': if a task takes less than two minutes, do it immediately rather than scheduling it for later. It prevents small tasks from piling up! ",
                            "Block distracting websites during your focus time. Tools like Freedom or Cold Turkey can help you stay on track. ",
                            "Keep a 'done list' alongside your to-do list. Seeing what you've accomplished provides motivation to keep going! "
                        ];
                        sendBotMessage(tips[Math.floor(Math.random() * tips.length)]);
                    }
                    else if (messageLower.includes('work') && messageLower.includes('from home')) {
                        sendBotMessage("Working from home effectively requires creating boundaries. Set up a dedicated workspace, establish a routine, take regular breaks, and communicate clearly with both colleagues and family about your work hours. Also, get dressed as if you're going to the office - it puts your brain in 'work mode'! ");
                    }
                    else if (messageLower.includes('morning routine') || (messageLower.includes('start') && messageLower.includes('day'))) {
                        sendBotMessage("The most productive morning routines typically avoid checking email/social media first thing, include some physical movement, a healthy breakfast, and time for planning your day. Many successful people also include meditation or journaling. What specific part of your morning routine would you like to improve? ");
                    }
                    else if (messageLower.includes('night routine') || (messageLower.includes('end') && messageLower.includes('day'))) {
                        sendBotMessage("A good evening routine should help you wind down and prepare for the next day. Try to stop screen time 1 hour before bed, write down your top 3 priorities for tomorrow, and practice a relaxation technique like deep breathing or light stretching. This helps your brain transition to sleep mode! ");
                    }
                    else {
                        // If we can't provide a specific answer, respond based on mood
                        sendBotMessage(getRandomResponse(chatbotResponses.fallback));
                    }
                } else {
                    // If no specific pattern is matched, respond based on user's mood
                    respondBasedOnMood();
                }
            }
        }, 1000);
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
        const quote = getRandomResponse(chatbotResponses.quotes);
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