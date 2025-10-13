// Real LLM integration with Google Gemini
import { generateGeminiResponse, updateUserPreferences } from './gemini-llm.js'

let isInitialized = false
let conversationMemory = []
let userPreferences = {
    language: 'en',
    context: 'general',
    lastAction: null
}

// Google Gemini client is now in separate file

// Initialize the AI system
async function initializeModel() {
    if (!isInitialized) {
        try {
            console.log('AI system initialized')
            isInitialized = true
        } catch (error) {
            console.error('Error initializing AI system:', error)
            throw error
        }
    }
    return { initialized: true }
}

// Process user input and generate a response using real LLM
export async function runLocalModel(userInput) {
    try {
        await initializeModel()

        // Store conversation for context
        conversationMemory.push({
            type: 'user',
            message: userInput,
            timestamp: new Date()
        })

        // Use only Google Gemini for all responses
        try {
            console.log('🚀 Using Google Gemini for all processing...')
            const geminiResponse = await generateGeminiResponse(userInput)

            // If Gemini returned a command, parse it and return
            if (geminiResponse && geminiResponse.type === 'command') {
                const command = parseFinancialCommand(geminiResponse.message)
                if (command) {
                    return {
                        type: 'command',
                        command: command
                    }
                }
            }

            return geminiResponse
        } catch (error) {
            console.error('Gemini API error:', error)
            return {
                type: 'response',
                message: 'Sorry, I encountered an error. Please try again.'
            }
        }

        // Fallback to local intelligence
        {
            // Fallback to local intelligence
            const response = await generateIntelligentResponse(userInput)

            // Store assistant response
            conversationMemory.push({
                type: 'assistant',
                message: response.message,
                timestamp: new Date()
            })

            return response
        }

    } catch (error) {
        console.error('Error in runLocalModel:', error)
        return await runLocalModelFallback(userInput)
    }
}

// Advanced message analysis system
function analyzeMessage(userInput) {
    const lowerInput = userInput.toLowerCase()

    // Extract key information
    const analysis = {
        intent: null,
        entities: [],
        sentiment: 'neutral',
        urgency: 'normal',
        context: userPreferences.context,
        hasContext: conversationMemory.length > 0,
        lastAction: userPreferences.lastAction
    }

    // Intent detection
    if (lowerInput.includes('increase') || lowerInput.includes('بیشتر') || lowerInput.includes('افزایش')) {
        analysis.intent = 'increase'
    } else if (lowerInput.includes('decrease') || lowerInput.includes('کمتر') || lowerInput.includes('کاهش')) {
        analysis.intent = 'decrease'
    } else if (lowerInput.includes('create') || lowerInput.includes('make') || lowerInput.includes('ساخت')) {
        analysis.intent = 'create'
    } else if (lowerInput.includes('analyze') || lowerInput.includes('analysis') || lowerInput.includes('تحلیل')) {
        analysis.intent = 'analyze'
    } else if (lowerInput.includes('help') || lowerInput.includes('کمک')) {
        analysis.intent = 'help'
    } else if (lowerInput.includes('show') || lowerInput.includes('display') || lowerInput.includes('نمایش')) {
        analysis.intent = 'show'
    } else if (lowerInput.includes('calculate') || lowerInput.includes('محاسبه')) {
        analysis.intent = 'calculate'
    }

    // Entity extraction
    const jobTitles = ['ceo', 'cto', 'cfo', 'vp', 'manager', 'developer', 'engineer', 'marketing', 'sales']
    const months = ['month1', 'month2', 'month3', 'month4', 'month5', 'month6']
    const percentages = lowerInput.match(/(\d+)%/g) || []
    const numbers = lowerInput.match(/\b\d+\b/g) || []

    jobTitles.forEach(title => {
        if (lowerInput.includes(title)) {
            analysis.entities.push({ type: 'jobTitle', value: title })
        }
    })

    months.forEach(month => {
        if (lowerInput.includes(month)) {
            analysis.entities.push({ type: 'month', value: month })
        }
    })

    if (percentages.length > 0) {
        analysis.entities.push({ type: 'percentage', value: percentages })
    }

    if (numbers.length > 0) {
        analysis.entities.push({ type: 'number', value: numbers })
    }

    // Sentiment analysis
    if (lowerInput.includes('urgent') || lowerInput.includes('asap') || lowerInput.includes('فوری')) {
        analysis.sentiment = 'urgent'
        analysis.urgency = 'high'
    } else if (lowerInput.includes('please') || lowerInput.includes('thank') || lowerInput.includes('لطفا')) {
        analysis.sentiment = 'positive'
    } else if (lowerInput.includes('problem') || lowerInput.includes('error') || lowerInput.includes('مشکل')) {
        analysis.sentiment = 'negative'
    }

    // Context detection
    if (lowerInput.includes('salary') || lowerInput.includes('حقوق')) {
        analysis.context = 'salary'
    } else if (lowerInput.includes('budget') || lowerInput.includes('بودجه')) {
        analysis.context = 'budget'
    } else if (lowerInput.includes('chart') || lowerInput.includes('graph') || lowerInput.includes('نمودار')) {
        analysis.context = 'visualization'
    } else if (lowerInput.includes('analysis') || lowerInput.includes('تحلیل')) {
        analysis.context = 'analysis'
    }

    return analysis
}

// Generate contextual help responses
function generateHelpResponse(analysis) {
    const context = analysis.context
    const entities = analysis.entities

    if (context === 'salary') {
        return "I can help you with salary management! I can:\n• Adjust individual or all salaries\n• Apply percentage changes\n• Work with specific months or ranges\n• Add or remove positions\n\nTry commands like:\n• 'increase salary by 10%'\n• 'increase salary in CEO by 15%'\n• 'increase salary in CTO by 15% from month1 to month3'"
    }

    if (context === 'budget') {
        return "I can help you with budget planning! I can:\n• Calculate total costs\n• Project future expenses\n• Optimize allocations\n• Compare scenarios\n\nTry commands like:\n• 'calculate total budget'\n• 'show budget breakdown'\n• 'project next quarter costs'"
    }

    if (context === 'visualization') {
        return "I can create various visualizations! I can make:\n• Bar charts for salary comparisons\n• Line charts for growth trends\n• Pie charts for budget distribution\n• Heat maps for monthly data\n\nTry commands like:\n• 'create bar chart'\n• 'show salary trends'\n• 'visualize budget distribution'"
    }

    return "I'm your AI financial assistant! I can help you with:\n\n📊 **Data Management:**\n• Adjust salaries and budgets\n• Add/remove positions\n• Modify monthly projections\n\n📈 **Analysis & Insights:**\n• Create charts and visualizations\n• Analyze trends and patterns\n• Calculate growth rates\n\n💡 **Smart Commands:**\n• 'increase salary by 10%'\n• 'create a bar chart'\n• 'analyze budget trends'\n• 'insert row for Frontend Developer'\n\nWhat would you like to work on?"
}

// Generate analysis responses
function generateAnalysisResponse(analysis) {
    const entities = analysis.entities
    const jobTitles = entities.filter(e => e.type === 'jobTitle').map(e => e.value)
    const months = entities.filter(e => e.type === 'month').map(e => e.value)

    if (jobTitles.length > 0 && months.length > 0) {
        return `I can analyze ${jobTitles.join(', ')} data for ${months.join(', ')}. I can:\n• Calculate trends and patterns\n• Compare performance across months\n• Identify growth opportunities\n• Generate insights and recommendations\n\nWhat specific analysis would you like for this data?`
    }

    if (jobTitles.length > 0) {
        return `I can analyze ${jobTitles.join(', ')} data. I can:\n• Calculate salary trends\n• Compare performance\n• Identify patterns\n• Generate insights\n\nWhat type of analysis would you like?`
    }

    return "I can analyze your financial data in many ways:\n• **Trend Analysis** - Track changes over time\n• **Comparative Analysis** - Compare different positions\n• **Performance Metrics** - Calculate key indicators\n• **Predictive Analysis** - Forecast future trends\n\nWhat would you like me to analyze?"
}

// Generate creation responses
function generateCreationResponse(analysis) {
    const context = analysis.context

    if (context === 'visualization') {
        return "I can create various types of charts and visualizations:\n\n📊 **Chart Types:**\n• Bar charts for comparisons\n• Line charts for trends\n• Pie charts for distributions\n• Heat maps for patterns\n\n📈 **Data Visualizations:**\n• Salary comparisons\n• Growth projections\n• Budget breakdowns\n• Monthly trends\n\nWhat type of visualization would you like?"
    }

    return "I can help you create various financial tools:\n• Charts and graphs\n• Reports and summaries\n• Budget plans\n• Projection models\n\nWhat would you like me to create?"
}

// Generate calculation responses
function generateCalculationResponse(analysis) {
    const entities = analysis.entities
    const numbers = entities.filter(e => e.type === 'number').map(e => e.value)
    const percentages = entities.filter(e => e.type === 'percentage').map(e => e.value)

    if (percentages.length > 0) {
        return `I can calculate with ${percentages.join(', ')} changes. I can:\n• Apply percentage increases/decreases\n• Calculate compound effects\n• Project future values\n• Compare scenarios\n\nWhat calculations would you like me to perform?`
    }

    if (numbers.length > 0) {
        return `I can work with the numbers ${numbers.join(', ')}. I can:\n• Calculate totals and averages\n• Apply mathematical operations\n• Generate projections\n• Create formulas\n\nWhat calculations do you need?`
    }

    return "I can perform various financial calculations:\n• **Basic Math** - Add, subtract, multiply, divide\n• **Percentage Calculations** - Increases, decreases, ratios\n• **Projections** - Future values, growth rates\n• **Comparisons** - Ratios, differences, trends\n\nWhat would you like me to calculate?"
}

// Generate contextual responses based on conversation history
function generateContextualResponse(analysis, userInput) {
    const lowerInput = userInput.toLowerCase()

    // Check for follow-up questions
    if (analysis.hasContext && analysis.lastAction) {
        if (lowerInput.includes('again') || lowerInput.includes('دوباره')) {
            return {
                type: 'response',
                message: `I can repeat the last action (${analysis.lastAction}). Would you like me to apply the same changes again?`
            }
        }

        if (lowerInput.includes('undo') || lowerInput.includes('برگردان')) {
            return {
                type: 'response',
                message: `I can help you undo the last action (${analysis.lastAction}). Would you like me to reverse those changes?`
            }
        }

        if (lowerInput.includes('similar') || lowerInput.includes('مشابه')) {
            return {
                type: 'response',
                message: `I can apply similar changes to other positions. Based on your last action (${analysis.lastAction}), what would you like me to do?`
            }
        }
    }

    // Check for clarification requests
    if (lowerInput.includes('what') || lowerInput.includes('how') || lowerInput.includes('چی') || lowerInput.includes('چطور')) {
        return {
            type: 'response',
            message: "I can help explain and clarify:\n• How to use specific commands\n• What different features do\n• How to interpret results\n• What options are available\n\nWhat would you like me to explain?"
        }
    }

    // Check for confirmation requests
    if (lowerInput.includes('confirm') || lowerInput.includes('sure') || lowerInput.includes('مطمئن')) {
        return {
            type: 'response',
            message: "I can help you confirm actions before executing them:\n• Preview changes before applying\n• Show calculations before committing\n• Verify data before processing\n• Confirm settings before saving\n\nWhat would you like me to confirm?"
        }
    }

    return null
}

// Generate intelligent responses based on user input
async function generateIntelligentResponse(userInput) {
    const analysis = analyzeMessage(userInput)
    const lowerInput = userInput.toLowerCase()

    // Check for contextual responses first
    const contextualResponse = generateContextualResponse(analysis, userInput)
    if (contextualResponse) {
        return contextualResponse
    }

    // Generate response based on analysis
    if (analysis.intent === 'help') {
        return {
            type: 'response',
            message: generateHelpResponse(analysis)
        }
    }

    if (analysis.intent === 'analyze') {
        return {
            type: 'response',
            message: generateAnalysisResponse(analysis)
        }
    }

    if (analysis.intent === 'create') {
        return {
            type: 'response',
            message: generateCreationResponse(analysis)
        }
    }

    if (analysis.intent === 'calculate') {
        return {
            type: 'response',
            message: generateCalculationResponse(analysis)
        }
    }

    // Financial analysis responses
    if (lowerInput.includes('analyze') || lowerInput.includes('analysis')) {
        return {
            type: 'response',
            message: "I can help you analyze your financial data. I can create charts, calculate trends, and provide insights about your salary projections and hiring plans. What specific analysis would you like me to perform?"
        }
    }

    // Chart and visualization responses
    if (lowerInput.includes('chart') || lowerInput.includes('graph') || lowerInput.includes('visualize')) {
        return {
            type: 'response',
            message: "I can create various types of charts for your financial data:\n• Bar charts for salary comparisons\n• Line charts for growth projections\n• Pie charts for budget distribution\n• Heat maps for monthly trends\nWhat type of visualization would you like?"
        }
    }

    // Budget and cost responses
    if (lowerInput.includes('budget') || lowerInput.includes('cost') || lowerInput.includes('expense')) {
        return {
            type: 'response',
            message: "I can help you with budget planning and cost analysis. I can:\n• Calculate total costs across all positions\n• Project future expenses\n• Optimize budget allocations\n• Compare different scenarios\nWhat budget analysis do you need?"
        }
    }

    // Growth and projection responses
    if (lowerInput.includes('growth') || lowerInput.includes('projection') || lowerInput.includes('forecast')) {
        return {
            type: 'response',
            message: "I can help you with growth projections and forecasting. I can:\n• Calculate growth rates\n• Project future revenues\n• Analyze hiring trends\n• Create scenario models\nWhat growth analysis would you like?"
        }
    }

    // General financial assistance
    return {
        type: 'response',
        message: "I'm your AI financial assistant! I can help you with:\n• Salary adjustments and calculations\n• Budget planning and analysis\n• Chart creation and visualization\n• Data analysis and insights\n• Scenario modeling\n\nTry commands like:\n• 'increase salary by 10%'\n• 'create a bar chart'\n• 'analyze budget trends'\n• 'project growth for next quarter'\n\nWhat would you like to work on?"
    }
}

// Smart command parser for complex financial operations
export function parseFinancialCommand(userInput) {
    const lowerInput = userInput.toLowerCase()

    // Pattern: "حقوق Senior Developer رو برای ماه اول تا سوم بزار 0" - NEW SIMPLE PATTERN
    if (lowerInput.includes('رو برای') && lowerInput.includes('بزار')) {
        const parts = lowerInput.split('رو برای')
        if (parts.length === 2) {
            const jobTitle = parts[0].replace(/^(?:حقوق|salary)\s+/, '').trim()
            const restPart = parts[1]
            const monthMatch = restPart.match(/(month\d+)\s+(?:تا|to)\s+(month\d+)\s+(?:بزار|set to)\s+(\d+)/)
            if (monthMatch) {
                return {
                    action: 'set_range',
                    jobTitle: jobTitle,
                    startMonth: monthMatch[1],
                    endMonth: monthMatch[2],
                    value: parseInt(monthMatch[3]),
                    message: `Setting ${jobTitle} salary from ${monthMatch[1]} to ${monthMatch[2]} to ${monthMatch[3]}.`
                }
            }
        }
    }

    // Pattern: "increase salary in CTO by 15% from month1 to month3"
    const rangeIncreasePattern = /increase\s+salary\s+in\s+(\w+)\s+by\s+(\d+)%\s+from\s+(month\d+)\s+to\s+(month\d+)/i
    const rangeIncreaseMatch = lowerInput.match(rangeIncreasePattern)
    if (rangeIncreaseMatch) {
        const jobTitle = rangeIncreaseMatch[1]
        const percent = parseInt(rangeIncreaseMatch[2])
        const startMonth = rangeIncreaseMatch[3]
        const endMonth = rangeIncreaseMatch[4]
        return {
            action: 'increase_range',
            jobTitle: jobTitle,
            startMonth: startMonth,
            endMonth: endMonth,
            percent: percent,
            message: `Increasing ${jobTitle} salary by ${percent}% from ${startMonth} to ${endMonth}.`
        }
    }

    // Pattern: "decrease salary in CTO by 10% from month1 to month3"
    const rangeDecreasePattern = /decrease\s+salary\s+in\s+(\w+)\s+by\s+(\d+)%\s+from\s+(month\d+)\s+to\s+(month\d+)/i
    const rangeDecreaseMatch = lowerInput.match(rangeDecreasePattern)
    if (rangeDecreaseMatch) {
        const jobTitle = rangeDecreaseMatch[1]
        const percent = parseInt(rangeDecreaseMatch[2])
        const startMonth = rangeDecreaseMatch[3]
        const endMonth = rangeDecreaseMatch[4]
        return {
            action: 'decrease_range',
            jobTitle: jobTitle,
            startMonth: startMonth,
            endMonth: endMonth,
            percent: percent,
            message: `Decreasing ${jobTitle} salary by ${percent}% from ${startMonth} to ${endMonth}.`
        }
    }

    // Pattern: "حقوق Senior Developer رو برای ماه اول تا سوم بزار 0" or "Senior Developer salary for month1 to month3 set to 0"
    const rangeSetPattern1 = /(?:حقوق|salary)\s+([^رو\s]+(?:\s+[^رو\s]+)*)\s+(?:رو برای|for)\s+(month\d+)\s+(?:تا|to)\s+(month\d+)\s+(?:بزار|set to)\s+(\d+)/i
    const rangeSetMatch1 = lowerInput.match(rangeSetPattern1)
    if (rangeSetMatch1) {
        const jobTitle = rangeSetMatch1[1].trim()
        const startMonth = rangeSetMatch1[2]
        const endMonth = rangeSetMatch1[3]
        const value = parseInt(rangeSetMatch1[4])
        return {
            action: 'set_range',
            jobTitle: jobTitle,
            startMonth: startMonth,
            endMonth: endMonth,
            value: value,
            message: `Setting ${jobTitle} salary from ${startMonth} to ${endMonth} to ${value}.`
        }
    }

    // Pattern: "حقوق CEO رو از ماه اول تا سوم صفر کن" or "CEO salary from month1 to month3 set to zero"
    const rangeZeroPattern = /(?:حقوق|salary)\s+(\w+)\s+(?:رو از|from)\s+(month\d+)\s+(?:تا|to)\s+(month\d+)\s+(?:صفر کن|set to zero)/i
    const rangeZeroMatch = lowerInput.match(rangeZeroPattern)
    if (rangeZeroMatch) {
        const jobTitle = rangeZeroMatch[1]
        const startMonth = rangeZeroMatch[2]
        const endMonth = rangeZeroMatch[3]
        return {
            action: 'set_range',
            jobTitle: jobTitle,
            startMonth: startMonth,
            endMonth: endMonth,
            value: 0,
            message: `Setting ${jobTitle} salary from ${startMonth} to ${endMonth} to zero.`
        }
    }

    // Pattern: "حقوق Senior Developer رو برای ماه اول تا سوم بزار 0" - simple and effective
    const rangeSetPattern2 = /(?:حقوق|salary)\s+([^رو\s]+(?:\s+[^رو\s]+)*)\s+(?:رو برای|for)\s+(month\d+)\s+(?:تا|to)\s+(month\d+)\s+(?:بزار|set to)\s+(\d+)/i
    const rangeSetMatch2 = lowerInput.match(rangeSetPattern2)
    if (rangeSetMatch2) {
        const jobTitle = rangeSetMatch2[1].trim()
        const startMonth = rangeSetMatch2[2]
        const endMonth = rangeSetMatch2[3]
        const value = parseInt(rangeSetMatch2[4])
        return {
            action: 'set_range',
            jobTitle: jobTitle,
            startMonth: startMonth,
            endMonth: endMonth,
            value: value,
            message: `Setting ${jobTitle} salary from ${startMonth} to ${endMonth} to ${value}.`
        }
    }

    // Pattern: "حقوق Senior Developer رو برای ماه اول تا سوم بزار 0" - alternative approach
    const rangeSetPattern3 = /(?:حقوق|salary)\s+([^رو\s]+(?:\s+[^رو\s]+)*)\s+(?:رو برای|for)\s+(month\d+)\s+(?:تا|to)\s+(month\d+)\s+(?:بزار|set to)\s+(\d+)/i
    const rangeSetMatch3 = lowerInput.match(rangeSetPattern3)
    if (rangeSetMatch3) {
        const jobTitle = rangeSetMatch3[1].trim()
        const startMonth = rangeSetMatch3[2]
        const endMonth = rangeSetMatch3[3]
        const value = parseInt(rangeSetMatch3[4])
        return {
            action: 'set_range',
            jobTitle: jobTitle,
            startMonth: startMonth,
            endMonth: endMonth,
            value: value,
            message: `Setting ${jobTitle} salary from ${startMonth} to ${endMonth} to ${value}.`
        }
    }

    // Pattern: "حقوق CEO رو از ماه اول تا سوم 5000 کن" or "CEO salary from month1 to month3 set to 5000"
    const rangeSetPattern = /(?:حقوق|salary)\s+(\w+)\s+(?:رو از|from)\s+(month\d+)\s+(?:تا|to)\s+(month\d+)\s+(?:کن|set to)\s+(\d+)/i
    const rangeSetMatch = lowerInput.match(rangeSetPattern)
    if (rangeSetMatch) {
        const jobTitle = rangeSetMatch[1]
        const startMonth = rangeSetMatch[2]
        const endMonth = rangeSetMatch[3]
        const value = parseInt(rangeSetMatch[4])
        return {
            action: 'set_range',
            jobTitle: jobTitle,
            startMonth: startMonth,
            endMonth: endMonth,
            value: value,
            message: `Setting ${jobTitle} salary from ${startMonth} to ${endMonth} to ${value}.`
        }
    }

    // Pattern: "increase salary in CEO by 10%"
    const specificIncreasePattern = /increase\s+salary\s+in\s+(\w+)\s+by\s+(\d+)%/i
    const specificIncreaseMatch = lowerInput.match(specificIncreasePattern)
    if (specificIncreaseMatch) {
        const jobTitle = specificIncreaseMatch[1]
        const percent = parseInt(specificIncreaseMatch[2])
        return {
            action: 'increase',
            column: 'salaryPerMonth',
            jobTitle: jobTitle,
            percent: percent,
            message: `Increasing salary for ${jobTitle} by ${percent}%.`
        }
    }

    // Pattern: "decrease salary in CEO by 10%"
    const specificDecreasePattern = /decrease\s+salary\s+in\s+(\w+)\s+by\s+(\d+)%/i
    const specificDecreaseMatch = lowerInput.match(specificDecreasePattern)
    if (specificDecreaseMatch) {
        const jobTitle = specificDecreaseMatch[1]
        const percent = parseInt(specificDecreaseMatch[2])
        return {
            action: 'decrease',
            column: 'salaryPerMonth',
            jobTitle: jobTitle,
            percent: percent,
            message: `Decreasing salary for ${jobTitle} by ${percent}%.`
        }
    }

    // Pattern: "increase salary in month1 by 10%"
    const increasePattern = /increase\s+salary\s+in\s+(month\d+)\s+by\s+(\d+)%/i
    const increaseMatch = lowerInput.match(increasePattern)
    if (increaseMatch) {
        const month = increaseMatch[1]
        const percent = parseInt(increaseMatch[2])
        return {
            action: 'increase',
            column: month,
            rows: [0, 1, 2, 3, 4, 5, 6], // All rows except total
            percent: percent,
            message: `Increasing salary in ${month} by ${percent}% for all positions.`
        }
    }

    // Pattern: "decrease salary in month1 by 10%"
    const decreasePattern = /decrease\s+salary\s+in\s+(month\d+)\s+by\s+(\d+)%/i
    const decreaseMatch = lowerInput.match(decreasePattern)
    if (decreaseMatch) {
        const month = decreaseMatch[1]
        const percent = parseInt(decreaseMatch[2])
        return {
            action: 'decrease',
            column: month,
            rows: [0, 1, 2, 3, 4, 5, 6], // All rows except total
            percent: percent,
            message: `Decreasing salary in ${month} by ${percent}% for all positions.`
        }
    }

    // Pattern: "increase salary by 10%"
    const salaryIncreasePattern = /increase\s+salary\s+by\s+(\d+)%/i
    const salaryIncreaseMatch = lowerInput.match(salaryIncreasePattern)
    if (salaryIncreaseMatch) {
        const percent = parseInt(salaryIncreaseMatch[1])
        return {
            action: 'increase',
            column: 'salaryPerMonth',
            rows: [0, 1, 2, 3, 4, 5, 6], // All rows except total
            percent: percent,
            message: `Increasing base salary by ${percent}% for all positions.`
        }
    }

    // Pattern: "decrease salary by 10%"
    const salaryDecreasePattern = /decrease\s+salary\s+by\s+(\d+)%/i
    const salaryDecreaseMatch = lowerInput.match(salaryDecreasePattern)
    if (salaryDecreaseMatch) {
        const percent = parseInt(salaryDecreaseMatch[1])
        return {
            action: 'decrease',
            column: 'salaryPerMonth',
            rows: [0, 1, 2, 3, 4, 5, 6], // All rows except total
            percent: percent,
            message: `Decreasing base salary by ${percent}% for all positions.`
        }
    }

    // Pattern: "insert 1 row for Frontend Developer"
    const insertRowPattern = /insert\s+(\d+)\s+row\s+for\s+(.+)/i
    const insertRowMatch = lowerInput.match(insertRowPattern)
    if (insertRowMatch) {
        const count = parseInt(insertRowMatch[1])
        const jobTitle = insertRowMatch[2].trim()
        return {
            action: 'insert',
            jobTitle: jobTitle,
            count: count,
            message: `Inserting ${count} row(s) for ${jobTitle}.`
        }
    }

    // Pattern: "add row for Frontend Developer"
    const addRowPattern = /add\s+row\s+for\s+(.+)/i
    const addRowMatch = lowerInput.match(addRowPattern)
    if (addRowMatch) {
        const jobTitle = addRowMatch[1].trim()
        return {
            action: 'insert',
            jobTitle: jobTitle,
            count: 1,
            message: `Adding row for ${jobTitle}.`
        }
    }

    // Pattern: "delete CEO row"
    const deleteRowPattern = /delete\s+(\w+)\s+row/i
    const deleteRowMatch = lowerInput.match(deleteRowPattern)
    if (deleteRowMatch) {
        const jobTitle = deleteRowMatch[1]
        return {
            action: 'delete',
            jobTitle: jobTitle,
            message: `Deleting row for ${jobTitle}.`
        }
    }

    // Pattern: "set selected cells to 5000" or "سلول‌های انتخاب شده رو 5000 کن"
    const selectedSetPattern = /(?:set\s+selected\s+cells\s+to|سلول‌های\s+انتخاب\s+شده\s+رو)\s+(\d+)(?:\s+کن|$)/i
    const selectedSetMatch = lowerInput.match(selectedSetPattern)
    if (selectedSetMatch) {
        const value = parseInt(selectedSetMatch[1])
        return {
            action: 'set_selected',
            value: value,
            message: `Setting selected cells to ${value}.`
        }
    }

    // Pattern: "increase selected cells by 10%" or "سلول‌های انتخاب شده رو 10% افزایش بده"
    const selectedIncreasePattern = /(?:increase\s+selected\s+cells\s+by|سلول‌های\s+انتخاب\s+شده\s+رو)\s+(\d+)%\s*(?:افزایش\s+بده|increase)?/i
    const selectedIncreaseMatch = lowerInput.match(selectedIncreasePattern)
    if (selectedIncreaseMatch) {
        const percent = parseInt(selectedIncreaseMatch[1])
        return {
            action: 'increase_selected',
            percent: percent,
            message: `Increasing selected cells by ${percent}%.`
        }
    }

    // Pattern: "decrease selected cells by 5%" or "سلول‌های انتخاب شده رو 5% کاهش بده"
    const selectedDecreasePattern = /(?:decrease\s+selected\s+cells\s+by|سلول‌های\s+انتخاب\s+شده\s+رو)\s+(\d+)%\s*(?:کاهش\s+بده|decrease)?/i
    const selectedDecreaseMatch = lowerInput.match(selectedDecreasePattern)
    if (selectedDecreaseMatch) {
        const percent = parseInt(selectedDecreaseMatch[1])
        return {
            action: 'decrease_selected',
            percent: percent,
            message: `Decreasing selected cells by ${percent}%.`
        }
    }

    // Pattern: "create chart" or "show chart" or "make chart"
    const chartPattern = /(?:create|show|make|generate)\s+(?:a\s+)?(?:chart|graph|visualization)/i
    const chartMatch = lowerInput.match(chartPattern)
    if (chartMatch) {
        return {
            action: 'create_chart',
            message: 'I can create various types of charts for your financial data. What type of chart would you like?'
        }
    }

    // Pattern: "analyze data" or "show analysis"
    const analysisPattern = /(?:analyze|analysis|show\s+analysis)/i
    const analysisMatch = lowerInput.match(analysisPattern)
    if (analysisMatch) {
        return {
            action: 'analyze_data',
            message: 'I can analyze your financial data and provide insights. What specific analysis would you like?'
        }
    }

    return null
}

// Alternative function for when the model fails to load
export async function runLocalModelFallback(userInput) {
    const lowerInput = userInput.toLowerCase()

    // Check for financial commands first
    const command = parseFinancialCommand(userInput)
    if (command) {
        return {
            type: 'command',
            command: command
        }
    }

    // Simple keyword-based responses
    if (lowerInput.includes('salary') || lowerInput.includes('increase')) {
        return {
            type: 'response',
            message: "I can help you adjust salary projections. Try commands like:\n• 'increase salary by 10%' - for all positions\n• 'increase salary in CEO by 15%' - for specific job title\n• 'increase salary in CTO by 15% from month1 to month3' - range operations\n• 'decrease salary in month1 by 5%' - for specific month\n• 'حقوق CEO رو از ماه اول تا سوم صفر کن' - range operations\n• 'insert 1 row for Frontend Developer' - add new position\n• 'delete CEO row' - remove position\n• 'set selected cells to 5000' - work with selected cells\n• 'سلول‌های انتخاب شده رو 10% افزایش بده' - increase selected cells"
        }
    }

    if (lowerInput.includes('chart') || lowerInput.includes('graph')) {
        return {
            type: 'response',
            message: "I can help you create visualizations of your financial data. What type of chart would be most useful - bar charts for salary comparisons or line charts for growth projections?"
        }
    }

    if (lowerInput.includes('budget') || lowerInput.includes('cost')) {
        return {
            type: 'response',
            message: "I can assist with budget planning and cost analysis. Are you looking to adjust marketing budgets, operational costs, or equipment expenses?"
        }
    }

    if (lowerInput.includes('revenue') || lowerInput.includes('income')) {
        return {
            type: 'response',
            message: "I can help you analyze revenue projections and income streams. What revenue assumptions would you like to review or modify?"
        }
    }

    // Advanced context-aware responses
    if (analysis.sentiment === 'urgent') {
        return {
            type: 'response',
            message: `I understand this is urgent! I can help you quickly with:\n• Immediate salary adjustments\n• Quick budget calculations\n• Emergency data analysis\n• Rapid chart generation\n\nWhat do you need done right away?`
        }
    }

    if (analysis.sentiment === 'negative') {
        return {
            type: 'response',
            message: `I'm here to help solve any problems! I can:\n• Fix data issues\n• Correct calculations\n• Resolve display problems\n• Debug any errors\n\nWhat specific problem are you experiencing?`
        }
    }

    if (analysis.sentiment === 'positive') {
        return {
            type: 'response',
            message: `Thank you! I'm glad I can help. I'm here to assist you with:\n• Financial planning and analysis\n• Data visualization\n• Budget optimization\n• Strategic insights\n\nWhat else can I help you with today?`
        }
    }

    // Context-aware responses based on common financial queries
    if (lowerInput.includes('help') || lowerInput.includes('what can you do')) {
        return {
            type: 'response',
            message: generateHelpResponse(analysis)
        }
    }

    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
        return {
            type: 'response',
            message: "Hello! I'm your AI financial assistant. I can help you manage your financial data, create visualizations, and analyze your business projections. What would you like to work on today?"
        }
    }

    if (lowerInput.includes('thank') || lowerInput.includes('thanks')) {
        return {
            type: 'response',
            message: "You're welcome! I'm here to help you with all your financial planning needs. Feel free to ask me anything about your data, charts, or analysis."
        }
    }

    return {
        type: 'response',
        message: "I'm your AI financial assistant! I can help you with:\n• Salary adjustments and calculations\n• Budget planning and analysis\n• Chart creation and visualization\n• Data analysis and insights\n• Scenario modeling\n\nTry commands like:\n• 'increase salary by 10%'\n• 'create a bar chart'\n• 'analyze budget trends'\n• 'project growth for next quarter'\n\nWhat would you like to work on?"
    }
}
