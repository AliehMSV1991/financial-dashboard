// Google Gemini LLM Integration
import { GoogleGenerativeAI } from '@google/generative-ai'

let genAI = null
let conversationMemory = []
let userPreferences = {
    language: 'en',
    context: 'general',
    lastAction: null
}

// Initialize Google Gemini client
function initializeGemini() {
    if (!genAI) {
        const apiKey = process.env.GOOGLE_API_KEY || 'your-api-key-here'
        console.log('Google API Key status:', apiKey === 'your-api-key-here' ? 'NOT SET' : 'SET')

        // Use environment variable for API key
        const finalApiKey = apiKey
        genAI = new GoogleGenerativeAI(finalApiKey, {
            apiVersion: 'v1'
        })
        console.log('✅ Google Gemini initialized with API key')
    }
    return genAI
}

// Generate response using Google Gemini LLM
export async function generateGeminiResponse(userInput) {
    try {
        console.log('🔍 Gemini Response called with:', userInput)

        // Initialize Gemini if not already done
        const geminiClient = initializeGemini()
        console.log('🔍 genAI status:', geminiClient ? 'INITIALIZED' : 'NOT INITIALIZED')

        if (!geminiClient) {
            throw new Error('Google API key not configured')
        }

        // Try different model names that are available
        let model
        try {
            console.log('Trying gemini-2.0-flash-exp...')
            model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })
        } catch (error) {
            try {
                console.log('Trying gemini-1.5-flash...')
                model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
            } catch (error2) {
                try {
                    console.log('Trying gemini-1.5-pro...')
                    model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })
                } catch (error3) {
                    console.log('Trying gemini-pro...')
                    model = genAI.getGenerativeModel({ model: "gemini-pro" })
                }
            }
        }

        // Prepare conversation context
        const systemPrompt = `You are an AI financial assistant for a financial dashboard application. You help users manage salary data, create visualizations, and analyze financial projections.

CRITICAL INSTRUCTIONS:
When the user asks for financial operations, you MUST return ONLY the exact command in this format:

For percentage operations on selected cells:
- "decrease selected cells by X%" (for decrease - make values smaller)
- "increase selected cells by X%" (for increase - make values larger)

For setting specific values on selected cells:
- "set selected cells to X" (for setting specific value)

For operations on specific job titles:
- "increase salary in [JOB_TITLE] by X%"
- "decrease salary in [JOB_TITLE] by X%"

For row operations:
- "insert 1 row for [JOB_TITLE]"
- "delete [JOB_TITLE] row"

EXAMPLES:
- User: "سلول‌های انتخاب شده رو 20% کاهش بده" → Response: "decrease selected cells by 20%"
- User: "سلول‌های انتخاب شده رو 10% افزایش بده" → Response: "increase selected cells by 10%"
- User: "سلول‌های انتخاب شده رو 5000 کن" → Response: "set selected cells to 5000"
- User: "حقوق CEO رو 15% افزایش بده" → Response: "increase salary in CEO by 15%"

IMPORTANT: 
- "کاهش" = DECREASE
- "افزایش" = INCREASE
- "سلول‌های انتخاب شده" = selected cells
- "ستون‌های انتخاب شده" = selected cells

Current context: ${userPreferences.context}
Last action: ${userPreferences.lastAction || 'none'}

You MUST respond with ONLY the command, no explanations or additional text.`

        // Prepare conversation history
        let fullPrompt = systemPrompt + "\n\nConversation History:\n"

        // Add recent conversation history (last 5 messages)
        const recentHistory = conversationMemory.slice(-5)
        recentHistory.forEach(msg => {
            fullPrompt += `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.message}\n`
        })

        // Add current user input
        fullPrompt += `\nUser: ${userInput}\n\nAssistant:`

        // Call Google Gemini API
        console.log('🤖 Calling Google Gemini API...')
        const result = await model.generateContent(fullPrompt)
        const response = result.response.text()
        console.log('🤖 Gemini Response:', response)

        // Store conversation
        conversationMemory.push({
            type: 'user',
            message: userInput,
            timestamp: new Date()
        })

        conversationMemory.push({
            type: 'assistant',
            message: response,
            timestamp: new Date()
        })

        // Check if the response contains a command and parse it properly
        console.log('🔍 Analyzing Gemini response:', response)

        // Check for decrease command
        if (response.includes('decrease selected cells by') || response.includes('کاهش')) {
            const decreaseMatch = response.match(/decrease selected cells by (\d+)%/i)
            if (decreaseMatch) {
                const percent = parseInt(decreaseMatch[1])
                console.log('🎯 Gemini detected decrease command:', response)
                return {
                    type: 'command',
                    message: `decrease selected cells by ${percent}%`
                }
            }
        }

        // Check for increase command
        if (response.includes('increase selected cells by') || response.includes('افزایش')) {
            const increaseMatch = response.match(/increase selected cells by (\d+)%/i)
            if (increaseMatch) {
                const percent = parseInt(increaseMatch[1])
                console.log('🎯 Gemini detected increase command:', response)
                return {
                    type: 'command',
                    message: `increase selected cells by ${percent}%`
                }
            }
        }

        // Check for set command
        if (response.includes('set selected cells to') || response.includes('کن')) {
            const setMatch = response.match(/set selected cells to (\d+)/i)
            if (setMatch) {
                const value = parseInt(setMatch[1])
                console.log('🎯 Gemini detected set command:', response)
                return {
                    type: 'command',
                    message: `set selected cells to ${value}`
                }
            }
        }

        // Check for other command patterns
        const otherCommandPatterns = [
            /increase salary in (\w+) by (\d+)%/i,
            /decrease salary in (\w+) by (\d+)%/i,
            /insert 1 row for (\w+)/i,
            /delete (\w+) row/i
        ]

        for (const pattern of otherCommandPatterns) {
            const match = response.match(pattern)
            if (match) {
                console.log('🎯 Gemini detected command:', response)
                return {
                    type: 'command',
                    message: response
                }
            }
        }

        return {
            type: 'response',
            message: response
        }

    } catch (error) {
        console.error('❌ Error calling Google Gemini API:', error)
        console.error('❌ Error details:', error.message)
        console.error('❌ Error stack:', error.stack)
        throw error
    }
}

// Update user preferences
export function updateUserPreferences(prefs) {
    userPreferences = { ...userPreferences, ...prefs }
}

// Get conversation memory
export function getConversationMemory() {
    return conversationMemory
}

// Clear conversation memory
export function clearConversationMemory() {
    conversationMemory = []
}
