'use client'

import { useState } from 'react'

export default function Sidebar() {
    const [activeSection, setActiveSection] = useState('workflow')
    const [activeItem, setActiveItem] = useState('fundraising')

    const navigationItems = {
        main: [
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'workflow', label: 'Workflow', icon: '⚡', active: true },
            { id: 'timeline', label: 'Timeline', icon: '📅' }
        ],
        workflow: [
            { id: 'inbox', label: 'Inbox', icon: '📥' },
            { id: 'fundraising', label: 'Fundraising', icon: '💰', active: true },
            { id: 'financial-projection', label: 'Financial Projection', icon: '📈' },
            { id: 'financial', label: 'Financial', icon: '💼' },
            { id: 'production', label: 'Production', icon: '🏭' },
            { id: 'growth', label: 'Growth', icon: '📈' },
            { id: 'ai-admin', label: 'Your AI Admin', icon: '🤖' },
            { id: 'inbox-2', label: 'Inbox', icon: '📥' }
        ],
        operation: [
            { id: 'crm-management', label: 'CRM Management', icon: '👥' },
            { id: 'crm', label: 'CRM', icon: '📞' },
            { id: 'financials', label: 'Financials', icon: '💳' }
        ],
        general: [
            { id: 'community', label: 'Community', icon: '🌐' },
            { id: 'resources', label: 'Resources', icon: '📚' },
            { id: 'legal', label: 'Legal', icon: '⚖️' },
            { id: 'docs', label: 'Docs', icon: '📄' }
        ]
    }

    return (
        <div className="h-full flex flex-col bg-gray-900">
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-gray-100">Toolpad</h1>
                    <button className="text-gray-400 hover:text-gray-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 p-4 space-y-6">
                {/* Main Section */}
                <div>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Main</h3>
                    <div className="space-y-1">
                        {navigationItems.main.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${item.active
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                                    }`}
                            >
                                <span className="mr-3 text-sm">{item.icon}</span>
                                {item.label}
                                {item.active && (
                                    <div className="ml-auto w-1 h-6 bg-blue-400 rounded-full"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Workflow Section */}
                <div>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Workflow</h3>
                    <div className="space-y-1">
                        {navigationItems.workflow.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveItem(item.id)}
                                className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${item.active
                                        ? 'text-blue-400'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                                    }`}
                            >
                                <span className="mr-3 text-sm">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Operation Section */}
                <div>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Operation</h3>
                    <div className="space-y-1">
                        {navigationItems.operation.map((item) => (
                            <button
                                key={item.id}
                                className="w-full flex items-center px-3 py-2 text-sm rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                            >
                                <span className="mr-3 text-sm">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* General Section */}
                <div>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">General</h3>
                    <div className="space-y-1">
                        {navigationItems.general.map((item) => (
                            <button
                                key={item.id}
                                className="w-full flex items-center px-3 py-2 text-sm rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                            >
                                <span className="mr-3 text-sm">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* User Profile */}
            <div className="p-4 border-t border-gray-700">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">DM</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-100">Delia Mahmoudi</p>
                        <p className="text-xs text-gray-400">Co-founder</p>
                    </div>
                    <div className="flex space-x-2">
                        <button className="text-gray-400 hover:text-gray-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                        <button className="text-gray-400 hover:text-gray-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4 4m0 0l-4 4m4-4H3m6-4v6a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h2a2 2 0 012 2v6z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
