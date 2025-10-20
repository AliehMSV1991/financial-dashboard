/**
 * AI Assistant Panel Component
 * 
 * Sliding panel from the right side with chat interface,
 * quick actions, and input field matching the design.
 */

'use client';

import { useState } from 'react';

interface AIAssistantProps {
    isOpen: boolean;
    onClose: () => void;
    onDataGenerated: (category: string, data: any) => void;
    runLocalModel: (input: string) => Promise<any>;
}

export function AIAssistant({ isOpen, onClose, onDataGenerated, runLocalModel }: AIAssistantProps) {
    const [activeTab, setActiveTab] = useState('chat');
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'assistant',
            content: 'Hello I can help you with formulas, data analysis, and growth projections. What would you like to work on?',
            timestamp: '14:40'
        }
    ]);


    const quickActions = [
        { label: '+ Apply Formula', icon: 'function' },
        { label: '+ Edit values', icon: 'edit' },
        { label: '+ Growth Ra', icon: 'trending-up' }
    ];

    const getIcon = (iconName: string) => {
        const icons = {
            robot: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
            close: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />,
            minimize: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />,
            chat: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
            history: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
            formula: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />,
            attach: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />,
            brainstorm: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
            mic: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />,
            send: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2z" />,
            function: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />,
            edit: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />,
            'trending-up': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        };
        return icons[iconName as keyof typeof icons] || icons.chat;
    };

    const handleSend = async () => {
        if (inputValue.trim()) {
            const userMessage = {
                id: Date.now(),
                type: 'user',
                content: inputValue,
                timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 5)
            };

            setMessages(prev => [...prev, userMessage]);
            const currentInput = inputValue;
            setInputValue('');

            try {
                const response = await runLocalModel(currentInput);

                if (response && response.type === 'data_generation') {
                    // Handle data generation response
                    onDataGenerated(response.category, response.data);

                    const assistantMessage = {
                        id: Date.now() + 1,
                        type: 'assistant',
                        content: `✅ ${response.category} data has been generated successfully!`,
                        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 5)
                    };
                    setMessages(prev => [...prev, assistantMessage]);
                } else if (response && response.type === 'response') {
                    // Handle regular response
                    const assistantMessage = {
                        id: Date.now() + 1,
                        type: 'assistant',
                        content: response.message,
                        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 5)
                    };
                    setMessages(prev => [...prev, assistantMessage]);
                }
            } catch (error) {
                console.error('Error sending message:', error);
                const errorMessage = {
                    id: Date.now() + 1,
                    type: 'assistant',
                    content: 'Sorry, I encountered an error. Please try again.',
                    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 5)
                };
                setMessages(prev => [...prev, errorMessage]);
            }
        }
    };

    return (
        <div className={`fixed inset-y-0 right-0 w-96 bg-gray-800 border-l border-gray-700 transform transition-transform duration-300 z-50 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {getIcon('robot')}
                        </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-white p-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {getIcon('minimize')}
                        </svg>
                    </button>
                    <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {getIcon('close')}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Status */}
            <div className="px-4 py-3 border-b border-gray-700">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Crowded</span>
                    <span className="text-sm text-gray-400">12 cells across 3 columns</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-4 py-3 border-b border-gray-700">
                <div className="flex space-x-6">
                    {[
                        { id: 'chat', label: 'Chat', icon: 'chat' },
                        { id: 'history', label: 'History', icon: 'history' },
                        { id: 'formulas', label: 'Formulas', icon: 'formula' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${activeTab === tab.id
                                ? 'bg-gray-700 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {getIcon(tab.icon)}
                            </svg>
                            <span className="text-sm font-medium">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${message.type === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-100'
                                }`}
                        >
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-3 border-t border-gray-700">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Quick Actions</h3>
                <div className="flex flex-wrap gap-2">
                    {quickActions.map((action, index) => (
                        <button
                            key={index}
                            className="flex items-center space-x-2 px-3 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 hover:text-white transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {getIcon(action.icon)}
                            </svg>
                            <span className="text-sm">{action.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Input Field */}
            <div className="p-4 border-t border-gray-700">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask River anything..."
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <div className="flex items-center space-x-1">
                        <button className="text-gray-400 hover:text-white p-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {getIcon('attach')}
                            </svg>
                        </button>
                        <button className="text-gray-400 hover:text-white p-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {getIcon('brainstorm')}
                            </svg>
                        </button>
                        <button className="text-gray-400 hover:text-white p-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {getIcon('mic')}
                            </svg>
                        </button>
                        <button
                            onClick={handleSend}
                            className="text-gray-400 hover:text-white p-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {getIcon('send')}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
