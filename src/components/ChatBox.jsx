'use client'

import { useState, useRef, useEffect } from 'react'
import { runLocalModel, runLocalModelFallback } from '@/utils/llm'
import { useFinancial } from '@/context/FinancialContext'
import { financialDataGenerator } from '@/utils/financial-data-generator'

export default function ChatBox() {
    const { applySalaryChange, initializeTabData, isInitialized, activeTab, generateInitialData } = useFinancial()

    // Check if current tab is initialized
    const isCurrentTabInitialized = isInitialized[activeTab] || false
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'assistant',
            content: 'Welcome! I can help you create a comprehensive financial plan. Let\'s start by understanding your business. What type of company are you running and what\'s your main focus? (Marketing, Sales, or Revenue planning?)',
            timestamp: new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })
        }
    ])
    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef(null)
    const [chatActiveTab, setChatActiveTab] = useState('chat')

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Check if we need to start data generation for current tab
    useEffect(() => {
        if (activeTab && !isCurrentTabInitialized) {
            // Let Gemini handle the conversation flow
            const welcomeMessage = {
                id: Date.now(),
                type: 'assistant',
                content: `Let's set up your ${activeTab} data. Please tell me about your ${activeTab} requirements and I'll help you create the appropriate data structure.`,
                timestamp: new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                })
            }
            setMessages(prev => [...prev, welcomeMessage])
        }
    }, [activeTab, isCurrentTabInitialized])

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: inputValue,
            timestamp: new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })
        }

        setMessages(prev => [...prev, userMessage])
        setInputValue('')
        setIsLoading(true)

        try {
            // Use Gemini for all interactions
            const response = await runLocalModel(inputValue)

            // Handle data generation responses
            if (response && response.type === 'data_generation') {
                // Generate table data based on collected information
                const generatedData = generateInitialData(response.category, response.data)
                initializeTabData(response.category, response.data)

                const assistantMessage = {
                    id: Date.now() + 1,
                    type: 'assistant',
                    content: `✅ Perfect! I've created your ${response.category} table based on the information you provided. The table is now ready with realistic financial projections.`,
                    timestamp: new Date().toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })
                }
                setMessages(prev => [...prev, assistantMessage])
            }
            // Handle setup questions
            else if (response && response.type === 'setup_question') {
                const assistantMessage = {
                    id: Date.now() + 1,
                    type: 'assistant',
                    content: response.message,
                    timestamp: new Date().toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })
                }
                setMessages(prev => [...prev, assistantMessage])
            }
            // Handle user responses to setup questions
            else if (response && response.type === 'response' && !isInitialized) {
                // Regular response when not in question flow
                const assistantMessage = {
                    id: Date.now() + 1,
                    type: 'assistant',
                    content: response?.message || response,
                    timestamp: new Date().toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })
                }
                setMessages(prev => [...prev, assistantMessage])
            }
            // Handle command responses
            else if (response && response.type === 'command') {
                // Apply the financial command
                applySalaryChange(response.command)

                // Create appropriate message based on action
                let actionMessage = ''
                if (response.command.action === 'decrease_selected') {
                    actionMessage = `✅ Decreasing selected cells by ${response.command.percent}%.`
                } else if (response.command.action === 'increase_selected') {
                    actionMessage = `✅ Increasing selected cells by ${response.command.percent}%.`
                } else if (response.command.action === 'set_selected') {
                    actionMessage = `✅ Setting selected cells to ${response.command.value}.`
                } else {
                    actionMessage = `✅ ${response.command.message}`
                }

                const assistantMessage = {
                    id: Date.now() + 1,
                    type: 'assistant',
                    content: actionMessage,
                    timestamp: new Date().toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })
                }
                setMessages(prev => [...prev, assistantMessage])
            } else {
                const assistantMessage = {
                    id: Date.now() + 1,
                    type: 'assistant',
                    content: response?.message || response,
                    timestamp: new Date().toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })
                }
                setMessages(prev => [...prev, assistantMessage])
            }
        } catch (error) {
            console.error('Error calling LLM:', error)

            // Use fallback function
            try {
                const fallbackResponse = await runLocalModelFallback(inputValue)

                // Handle command responses
                if (fallbackResponse && fallbackResponse.type === 'command') {
                    // Apply the financial command
                    applySalaryChange(fallbackResponse.command)

                    const assistantMessage = {
                        id: Date.now() + 1,
                        type: 'assistant',
                        content: `✅ ${fallbackResponse.command.message}`,
                        timestamp: new Date().toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        })
                    }
                    setMessages(prev => [...prev, assistantMessage])
                } else {
                    const assistantMessage = {
                        id: Date.now() + 1,
                        type: 'assistant',
                        content: fallbackResponse?.message || fallbackResponse,
                        timestamp: new Date().toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        })
                    }
                    setMessages(prev => [...prev, assistantMessage])
                }
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError)
                const errorMessage = {
                    id: Date.now() + 1,
                    type: 'assistant',
                    content: 'I can help you with financial data analysis, budget planning, and creating visualizations. What would you like to work on?',
                    timestamp: new Date().toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })
                }
                setMessages(prev => [...prev, errorMessage])
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    return (
        <div className="h-full flex flex-col bg-gray-800">
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold text-blue-400">AI Assistant</h2>
                    </div>
                    <button className="text-gray-400 hover:text-gray-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-6 py-3 border-b border-gray-700">
                <div className="flex space-x-6">
                    {['Chat', 'History', 'Formulas'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                            className={`text-sm font-medium pb-2 border-b-2 transition-colors ${activeTab === tab.toLowerCase()
                                ? 'text-blue-400 border-blue-400'
                                : 'text-gray-400 border-transparent hover:text-gray-200'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Context Info */}
            <div className="px-6 py-3 bg-gray-700/50">
                <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-300">Current</span>
                    <span className="text-xs text-gray-400">12 cells across 3 columns</span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.type === 'user'
                                ? 'bg-gray-700 text-gray-100'
                                : 'bg-gray-600 text-gray-100'
                                }`}
                        >
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs text-gray-400 mt-1">{message.timestamp}</p>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-600 rounded-2xl px-4 py-3">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-gray-700">
                <div className="flex items-center space-x-3 mb-4">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask Brian anything..."
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isLoading}
                    />
                    <button className="text-gray-400 hover:text-gray-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    </button>
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-full p-3 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:border-gray-500 transition-colors">
                        <span className="text-sm">+ Apply Formula</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:border-gray-500 transition-colors">
                        <span className="text-sm">+ Edit Values</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:border-gray-500 transition-colors">
                        <span className="text-sm">+ Chart & BI</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
