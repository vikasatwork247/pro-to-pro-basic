// NLP Service for Pro-To-Pro Chatbot
// This service handles communication with NLP APIs like OpenAI

class NLPService {
    constructor(apiKey = null) {
        this.apiKey = apiKey;
        this.apiEndpoint = 'https://api.openai.com/v1/chat/completions';
        this.model = 'gpt-3.5-turbo';
        this.conversationHistory = [];
        this.maxHistoryLength = 10; // Keep last 10 messages for context
        this.systemPrompt = `You are a helpful AI assistant for the Pro-To-Pro productivity application. 
Your goal is to help users become more productive, overcome procrastination, and manage their tasks effectively.
You can provide advice on productivity techniques, time management, motivation, and focus.
You can also help users with the features of the Pro-To-Pro app, including:
- Task management and prioritization
- Pomodoro timer and work sessions
- Productivity analytics and insights
- Journal/diary entries and reflection
- Achievement badges and gamification
Be concise, helpful, and occasionally motivational. If asked about topics outside of productivity or the app's features,
gently guide the conversation back to how you can help the user be more productive.`;
    }

    // Initialize conversation with system prompt
    initConversation() {
        this.conversationHistory = [{
            role: 'system',
            content: this.systemPrompt
        }];
    }

    // Add a message to the conversation history
    addMessageToHistory(role, content) {
        this.conversationHistory.push({ role, content });
        
        // Trim history if it gets too long (keeping system prompt)
        if (this.conversationHistory.length > this.maxHistoryLength + 1) {
            // Keep the system prompt (first message) and remove the oldest user/assistant message
            this.conversationHistory = [
                this.conversationHistory[0],
                ...this.conversationHistory.slice(this.conversationHistory.length - this.maxHistoryLength + 1)
            ];
        }
    }

    // Process a message using the OpenAI API
    async processMessage(message) {
        // If no API key is provided, use fallback responses
        if (!this.apiKey) {
            return this.getFallbackResponse(message);
        }

        try {
            // Add user message to history
            this.addMessageToHistory('user', message);

            // Prepare the request to OpenAI API
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: this.conversationHistory,
                    max_tokens: 300,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('OpenAI API Error:', errorData);
                throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            const reply = data.choices[0].message.content.trim();
            
            // Add assistant response to history
            this.addMessageToHistory('assistant', reply);
            
            return reply;
        } catch (error) {
            console.error('Error processing message with NLP service:', error);
            return this.getFallbackResponse(message);
        }
    }

    // Get app-specific information to enhance responses
    getAppContext() {
        const context = {
            pendingTasks: window.pendingTasks || [],
            completedTasks: window.completedTasks || [],
            currentPomodoroSettings: window.pomodoroSettings || { work: 25, shortBreak: 5, longBreak: 15 },
            // Add other app-specific context as needed
        };
        return context;
    }

    // Fallback responses when API is not available
    getFallbackResponse(message) {
        // Reuse some of the existing chatbot responses
        const responses = {
            greeting: [
                "Hello! I'm your productivity assistant. How can I help you today? 🚀",
                "Hi there! Ready to boost your productivity? Ask me anything! ✨",
                "Welcome back! What productivity challenges can I help you with today? 💪"
            ],
            productivity: [
                "Looking to boost your productivity? Try the Pomodoro technique - 25 minutes of focused work followed by a 5-minute break. It's scientifically proven to improve focus! ⏱️",
                "One productivity tip: Try time-blocking your day. Assign specific time blocks for different types of tasks. It can increase your efficiency by up to 25%! 📅",
                "For better productivity, try the 2-minute rule: If a task takes less than 2 minutes, do it immediately rather than scheduling it for later. Small wins add up! ⚡"
            ],
            motivation: [
                "Need motivation? Remember that progress is progress, no matter how small. What's one tiny step you could take right now? 🌱",
                "Motivation hack: Use the 5-second rule. Count 5-4-3-2-1 and then take immediate action before your brain talks you out of it! 🚀",
                "For motivation, try setting implementation intentions: 'When X happens, I will do Y.' This format makes you 2-3x more likely to follow through! 📈"
            ],
            focus: [
                "To improve focus, try the Pomodoro technique in our app! It's based on working in focused sprints with intentional breaks. 🍅",
                "Need better focus? Try the 3-3-3 rule: Focus on just 3 tasks, for 3 hours, with 3 minutes of preparation. Simple but effective! 🎯",
                "For better focus, eliminate distractions. Try putting your phone in another room and using website blockers during focused work sessions. 📵"
            ],
            fallback: [
                "I'm here to help with productivity and using the Pro-To-Pro app. Could you rephrase your question? 🤔",
                "I'm not sure I understood that. I can help with productivity techniques, time management, or using features of the Pro-To-Pro app. What would you like to know? 💭",
                "I'm still learning! Could you ask something about productivity, time management, or how to use the Pro-To-Pro app? 🌟"
            ]
        };

        // Simple keyword matching for fallback responses
        const messageLower = message.toLowerCase();
        
        if (messageLower.includes('hello') || messageLower.includes('hi') || messageLower.includes('hey')) {
            return this.getRandomResponse(responses.greeting);
        } else if (messageLower.includes('productive') || messageLower.includes('productivity') || messageLower.includes('efficient')) {
            return this.getRandomResponse(responses.productivity);
        } else if (messageLower.includes('motivate') || messageLower.includes('motivation') || messageLower.includes('inspired')) {
            return this.getRandomResponse(responses.motivation);
        } else if (messageLower.includes('focus') || messageLower.includes('concentrate') || messageLower.includes('attention')) {
            return this.getRandomResponse(responses.focus);
        } else {
            return this.getRandomResponse(responses.fallback);
        }
    }

    // Helper function to get a random response from an array
    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Set API key
    setApiKey(apiKey) {
        this.apiKey = apiKey;
        // Reinitialize conversation when API key changes
        this.initConversation();
    }
}

// Export the NLP service
window.NLPService = NLPService;
