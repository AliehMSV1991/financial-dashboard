// Automated Question Flow System
// This module manages the question flow for generating financial data

export class QuestionFlowManager {
    constructor() {
        this.currentTab = null
        this.currentQuestionIndex = 0
        this.userResponses = {}
        this.questionFlows = {
            'salary': [
                {
                    question: "How many employees do you have in your company?",
                    key: 'employeeCount',
                    type: 'number',
                    placeholder: 'e.g., 10'
                },
                {
                    question: "What's your average salary per employee? (in USD)",
                    key: 'averageSalary',
                    type: 'number',
                    placeholder: 'e.g., 5000'
                },
                {
                    question: "What are the main job titles in your company?",
                    key: 'jobTitles',
                    type: 'text',
                    placeholder: 'e.g., CEO, CTO, Developer, Manager'
                },
                {
                    question: "What's your salary growth rate per year? (percentage)",
                    key: 'salaryGrowthRate',
                    type: 'percentage',
                    placeholder: 'e.g., 5'
                },
                {
                    question: "Do you have any bonuses or benefits? (percentage of salary)",
                    key: 'bonusPercentage',
                    type: 'percentage',
                    placeholder: 'e.g., 10'
                }
            ],
            'revenue-assumptions': [
                {
                    question: "What's your current monthly revenue? (in USD)",
                    key: 'monthlyRevenue',
                    type: 'number',
                    placeholder: 'e.g., 50000'
                },
                {
                    question: "What's your expected monthly growth rate? (percentage)",
                    key: 'growthRate',
                    type: 'percentage',
                    placeholder: 'e.g., 10'
                },
                {
                    question: "What are your main revenue streams? (products, services, subscriptions)",
                    key: 'revenueStreams',
                    type: 'text',
                    placeholder: 'e.g., 70% products, 20% services, 10% subscriptions'
                },
                {
                    question: "What's your customer acquisition cost? (in USD)",
                    key: 'customerAcquisitionCost',
                    type: 'number',
                    placeholder: 'e.g., 500'
                },
                {
                    question: "What's your average customer lifetime value? (in USD)",
                    key: 'customerLifetimeValue',
                    type: 'number',
                    placeholder: 'e.g., 2000'
                }
            ],
            'marketing': [
                {
                    question: "What's your company size? (startup, small, medium, large)",
                    key: 'companySize',
                    type: 'select',
                    options: ['startup', 'small', 'medium', 'large']
                },
                {
                    question: "What industry are you in?",
                    key: 'industry',
                    type: 'text',
                    placeholder: 'e.g., technology, healthcare, finance'
                },
                {
                    question: "What's your monthly marketing budget? (in USD)",
                    key: 'marketingBudget',
                    type: 'number',
                    placeholder: 'e.g., 10000'
                },
                {
                    question: "What marketing channels do you use? (digital, content, events, PR)",
                    key: 'marketingChannels',
                    type: 'text',
                    placeholder: 'e.g., digital advertising, content marketing, events'
                },
                {
                    question: "What's your target customer acquisition cost? (in USD)",
                    key: 'targetCAC',
                    type: 'number',
                    placeholder: 'e.g., 300'
                }
            ],
            'sales': [
                {
                    question: "What's your target monthly revenue? (in USD)",
                    key: 'revenueTarget',
                    type: 'number',
                    placeholder: 'e.g., 100000'
                },
                {
                    question: "How many sales team members do you have?",
                    key: 'salesTeamSize',
                    type: 'number',
                    placeholder: 'e.g., 3'
                },
                {
                    question: "What's your average deal size? (in USD)",
                    key: 'averageDealSize',
                    type: 'number',
                    placeholder: 'e.g., 5000'
                },
                {
                    question: "What's your sales cycle length? (in weeks)",
                    key: 'salesCycleLength',
                    type: 'number',
                    placeholder: 'e.g., 4'
                },
                {
                    question: "What's your sales conversion rate? (percentage)",
                    key: 'conversionRate',
                    type: 'percentage',
                    placeholder: 'e.g., 15'
                }
            ]
        }
    }

    // Start question flow for a specific tab
    startQuestionFlow(tabName) {
        this.currentTab = tabName
        this.currentQuestionIndex = 0
        this.userResponses = {}

        const questions = this.questionFlows[tabName]
        if (questions && questions.length > 0) {
            return {
                type: 'question_flow_started',
                tab: tabName,
                question: questions[0],
                progress: `1 of ${questions.length}`
            }
        }
        return null
    }

    // Get current question
    getCurrentQuestion() {
        if (!this.currentTab || this.currentQuestionIndex < 0) return null

        const questions = this.questionFlows[this.currentTab]
        if (questions && this.currentQuestionIndex < questions.length) {
            return {
                type: 'current_question',
                question: questions[this.currentQuestionIndex],
                progress: `${this.currentQuestionIndex + 1} of ${questions.length}`,
                tab: this.currentTab
            }
        }
        return null
    }

    // Process user response and move to next question
    processUserResponse(response) {
        if (!this.currentTab || this.currentQuestionIndex < 0) return null

        const questions = this.questionFlows[this.currentTab]
        const currentQuestion = questions[this.currentQuestionIndex]

        // Parse and store user response based on question type
        let parsedResponse = response

        if (currentQuestion.type === 'number') {
            // Extract number from response - look for the first number
            const numberMatch = response.match(/(\d+)/)
            if (numberMatch) {
                parsedResponse = parseInt(numberMatch[1])
            } else {
                // If no number found, try to parse the entire response
                const parsed = parseInt(response)
                if (!isNaN(parsed)) {
                    parsedResponse = parsed
                }
            }
        } else if (currentQuestion.type === 'percentage') {
            // Extract percentage from response
            const percentageMatch = response.match(/(\d+)/)
            if (percentageMatch) {
                parsedResponse = parseInt(percentageMatch[1])
            } else {
                const parsed = parseInt(response)
                if (!isNaN(parsed)) {
                    parsedResponse = parsed
                }
            }
        } else if (currentQuestion.type === 'select') {
            // Check if response matches one of the options
            const matchedOption = currentQuestion.options.find(option =>
                response.toLowerCase().includes(option.toLowerCase())
            )
            if (matchedOption) {
                parsedResponse = matchedOption
            }
        } else if (currentQuestion.type === 'text') {
            // For text responses, clean up the input
            parsedResponse = response.trim()
        }

        // Store user response
        this.userResponses[currentQuestion.key] = parsedResponse
        console.log('🔍 Stored response:', {
            key: currentQuestion.key,
            originalResponse: response,
            parsedResponse: parsedResponse,
            allResponses: this.userResponses
        })

        // Move to next question
        this.currentQuestionIndex++

        // Check if we have more questions
        if (this.currentQuestionIndex < questions.length) {
            return {
                type: 'next_question',
                question: questions[this.currentQuestionIndex],
                progress: `${this.currentQuestionIndex + 1} of ${questions.length}`,
                tab: this.currentTab
            }
        } else {
            // All questions answered, generate data
            return {
                type: 'questions_completed',
                tab: this.currentTab,
                responses: this.userResponses
            }
        }
    }

    // Get all questions for a tab
    getQuestionsForTab(tabName) {
        return this.questionFlows[tabName] || []
    }

    // Check if a tab has questions
    hasQuestions(tabName) {
        return this.questionFlows[tabName] && this.questionFlows[tabName].length > 0
    }

    // Reset question flow
    reset() {
        this.currentTab = null
        this.currentQuestionIndex = 0
        this.userResponses = {}
    }
}

// Export singleton instance
export const questionFlowManager = new QuestionFlowManager()
