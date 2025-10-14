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
        const apiKey = process.env.GOOGLE_API_KEY || "AIzaSyA2OPdqUzJ4gZq53hXOMMVg4Gar2Jb10wA"


        if (!apiKey) {
            console.warn('⚠️ Google API Key not found. Please set GOOGLE_API_KEY or NEXT_PUBLIC_GOOGLE_API_KEY environment variable.')
            console.warn('📝 For local development, create a .env.local file with: GOOGLE_API_KEY=your_api_key_here')
            console.warn('🚀 For production, set the environment variable in your Vercel dashboard.')
            return null
        }

        try {
            genAI = new GoogleGenerativeAI(apiKey, {
                apiVersion: 'v1'
            })
            console.log('✅ Google Gemini initialized with API key')
        } catch (error) {
            console.error('❌ Failed to initialize Google Gemini:', error.message)
            return null
        }
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
            // Return a helpful message instead of throwing an error
            return {
                type: 'error',
                message: 'Google API key not configured. Please set GOOGLE_API_KEY environment variable. See GEMINI_SETUP.md for instructions.'
            }
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
        const systemPrompt = `You are an AI financial assistant for a financial dashboard application. You help users create and manage financial projections across multiple categories: Marketing, Sales, Revenue Assumptions, Salary, Current Cost, and Equipment.

    CRITICAL INSTRUCTIONS:

    1. DATA GENERATION MODE:
    When the user provides information about their financial data, you should:
    - Ask clarifying questions to gather all necessary information
    - Extract and structure the data appropriately
    - Generate realistic financial projections based on their input
    - Create comprehensive data structures for each category

    For Salary data, ask about:
    - Number of employees
    - Job titles and positions
    - Average salary ranges
    - Growth rates
    - Bonuses and benefits

    For Marketing data, ask about:
    - Company size and industry
    - Marketing budget
    - Marketing channels used
    - Target customer acquisition cost
    - Marketing goals

    For Sales data, ask about:
    - Sales team size
    - Revenue targets
    - Average deal size
    - Sales cycle length
    - Conversion rates

    For Revenue data, ask about:
    - Current monthly revenue
    - Expected growth rate
    - Revenue streams (products, services, subscriptions)
    - Customer acquisition cost
    - Customer lifetime value

    2. DATA COLLECTION AND GENERATION:
    When you have gathered enough information to create a table, you MUST return ONLY a JSON response with type "data_generation" and the collected data.

    IMPORTANT: Return ONLY the JSON, no other text or explanations.

    For Salary data, collect:
    - employeeCount: number of employees
    - jobTitles: comma-separated list of job titles
    - averageSalary: average salary amount
    - salaryGrowthRate: annual growth percentage
    - bonusPercentage: bonus percentage

    For Marketing data, collect:
    - companySize: startup/small/medium/large
    - industry: industry type
    - marketingBudget: monthly budget amount
    - marketingChannels: channels used
    - targetCAC: customer acquisition cost

    For Sales data, collect:
    - revenueTarget: monthly revenue target
    - salesTeamSize: number of sales team members
    - averageDealSize: average deal size
    - conversionRate: conversion rate percentage
    - salesCycleLength: sales cycle in weeks

    For Revenue data, collect:
    - monthlyRevenue: current monthly revenue
    - growthRate: monthly growth rate
    - revenueStreams: description of revenue streams
    - customerAcquisitionCost: CAC amount
    - customerLifetimeValue: CLV amount

    Example response format (return ONLY this JSON):
    {
        "type": "data_generation",
        "category": "salary",
        "data": {
            "employeeCount": 5,
            "jobTitles": "CEO, CTO, Developer, Manager, Support",
            "averageSalary": 6000,
            "salaryGrowthRate": 10,
            "bonusPercentage": 15
        }
    }

    3. DATA OPERATIONS MODE:
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

    4. RESPONSE FORMAT:
    - For data generation: Ask questions and gather information
    - For data collection complete: Return data_generation response
    - For operations: Return ONLY the command
    - For general questions: Provide helpful responses

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
        let response
        try {
            const result = await model.generateContent(fullPrompt)
            response = result.response.text()
            console.log('🤖 Gemini Response:', response)

            if (!response || response.trim() === '') {
                throw new Error('Empty response from Gemini')
            }
        } catch (error) {
            console.error('❌ Gemini API Error:', error)

            // Check if it's a quota error
            if (error.message && error.message.includes('quota')) {
                console.log('⚠️ Gemini quota exceeded, using fallback system')
                return {
                    type: 'quota_exceeded',
                    message: 'Gemini quota exceeded. Using local fallback system.',
                    fallback: true
                }
            }

            throw error
        }

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

        // Check for JSON data generation response
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                const jsonResponse = JSON.parse(jsonMatch[0])
                if (jsonResponse.type === 'data_generation') {
                    console.log('🎯 Gemini detected data generation response:', jsonResponse)
                    return jsonResponse
                }
            }
        } catch (error) {
            console.log('🔍 No valid JSON found in response')
        }

        // Check for initial setup questions
        if (response.includes('What\'s your company size?') ||
            response.includes('What industry are you in?') ||
            response.includes('What\'s your monthly marketing budget?') ||
            response.includes('What\'s your target monthly revenue?') ||
            response.includes('How many sales team members do you have?') ||
            response.includes('What\'s your current monthly revenue?')) {
            console.log('🎯 Gemini detected initial setup question:', response)
            return {
                type: 'setup_question',
                message: response,
                category: this.detectQuestionCategory(response)
            }
        }

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

// Detect question category for setup questions
function detectQuestionCategory(response) {
    if (response.includes('company size') || response.includes('industry') || response.includes('marketing budget')) {
        return 'marketing'
    } else if (response.includes('target monthly revenue') || response.includes('sales team members') || response.includes('deal size')) {
        return 'sales'
    } else if (response.includes('current monthly revenue') || response.includes('growth rate') || response.includes('revenue streams')) {
        return 'revenue'
    }
    return 'general'
}
