/**
 * Sidebar Component
 * 
 * Left navigation sidebar matching the design from the reference image.
 * Includes collapsible sections, navigation items, and user profile.
 */

'use client';

import { useState } from 'react';

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
    const [expandedSections, setExpandedSections] = useState({
        fundraising: true,
        financialProjection: true,
        aiTeam: false,
        inbox: false
    });

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section as keyof typeof prev]: !prev[section as keyof typeof prev]
        }));
    };

    return (
        <div className={`${collapsed ? 'w-16' : 'w-64'} bg-gray-800 border-r border-gray-700 transition-all duration-300 flex flex-col h-full`}>
            {/* Logo Section */}
            <div className="p-4 border-b border-gray-700 flex-shrink-0">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2z" />
                        </svg>
                    </div>
                    {!collapsed && (
                        <div>
                            <h1 className="text-lg font-bold text-white">Yolpak</h1>
                        </div>
                    )}
                </div>
                {!collapsed && (
                    <button className="mt-3 w-full p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Navigation - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {/* Main Section */}
                <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        {!collapsed && 'Main'}
                    </h3>

                    <NavItem icon="grid" label="Dashboard" active={false} collapsed={collapsed} />
                    <NavItem icon="flow" label="Workflow" active={false} collapsed={collapsed} />
                    <NavItem icon="lightbulb" label="Idea" active={false} collapsed={collapsed} />

                    {/* Fundraising Section */}
                    <CollapsibleSection
                        title="Fundraising"
                        icon="money"
                        expanded={expandedSections.fundraising}
                        onToggle={() => toggleSection('fundraising')}
                        collapsed={collapsed}
                    >
                        <NavItem icon="presentation" label="Pitch Deck" active={false} collapsed={collapsed} />
                    </CollapsibleSection>

                    {/* Financial Projection Section */}
                    <CollapsibleSection
                        title="Financial Projection"
                        icon="chart"
                        expanded={expandedSections.financialProjection}
                        onToggle={() => toggleSection('financialProjection')}
                        collapsed={collapsed}
                    >
                        <NavItem icon="dollar" label="Financial" active={true} collapsed={collapsed} />
                        <NavItem icon="gear" label="Production" active={false} collapsed={collapsed} />
                        <NavItem icon="trending-up" label="Growth" active={false} collapsed={collapsed} />
                    </CollapsibleSection>
                </div>

                {/* AI Team Section */}
                <CollapsibleSection
                    title="Your AI team"
                    icon="users"
                    expanded={expandedSections.aiTeam}
                    onToggle={() => toggleSection('aiTeam')}
                    collapsed={collapsed}
                />

                {/* Inbox Section */}
                <CollapsibleSection
                    title="Inbox"
                    icon="envelope"
                    expanded={expandedSections.inbox}
                    onToggle={() => toggleSection('inbox')}
                    collapsed={collapsed}
                />

                {/* Operation Section */}
                <div className="space-y-1 mt-6">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        {!collapsed && 'Operation'}
                    </h3>
                    <NavItem icon="clipboard" label="Task Management" active={false} collapsed={collapsed} />
                    <NavItem icon="building" label="CRM" active={false} collapsed={collapsed} />
                    <NavItem icon="chart-green" label="Financials" active={false} collapsed={collapsed} />
                </div>

                {/* General Section */}
                <div className="space-y-1 mt-6">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        {!collapsed && 'General'}
                    </h3>
                    <NavItem icon="users" label="Community" active={false} collapsed={collapsed} />
                    <NavItem icon="book" label="Resources" active={false} collapsed={collapsed} />
                    <NavItem icon="gavel" label="Legal" active={false} collapsed={collapsed} />
                    <NavItem icon="gears" label="Tools" active={false} collapsed={collapsed} />
                </div>
            </div>

            {/* User Profile Section - Fixed at bottom */}
            <div className="flex-shrink-0 p-4 border-t border-gray-700 bg-gray-800">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    {!collapsed && (
                        <>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">Della Mahmoudi</p>
                                <p className="text-xs text-gray-400 truncate">Founder</p>
                            </div>
                            <button className="text-gray-400 hover:text-white flex-shrink-0 p-1 rounded hover:bg-gray-700 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

interface NavItemProps {
    icon: string;
    label: string;
    active: boolean;
    collapsed: boolean;
}

function NavItem({ icon, label, active, collapsed }: NavItemProps) {
    const getIcon = (iconName: string) => {
        const icons = {
            grid: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />,
            flow: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
            lightbulb: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
            money: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />,
            chart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
            presentation: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2" />,
            dollar: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />,
            gear: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />,
            'trending-up': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
            users: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />,
            envelope: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
            clipboard: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
            building: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h2m0 0h2m-2 0v2m0-2v2m0 0h2m-2 0v2m0-2v2" />,
            'chart-green': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
            book: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />,
            gavel: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
            gears: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        };
        return icons[iconName as keyof typeof icons] || icons.grid;
    };

    return (
        <button className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${active
            ? 'bg-green-600 text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {getIcon(icon)}
            </svg>
            {!collapsed && <span className="text-sm font-medium">{label}</span>}
        </button>
    );
}

interface CollapsibleSectionProps {
    title: string;
    icon: string;
    expanded: boolean;
    onToggle: () => void;
    collapsed: boolean;
    children?: React.ReactNode;
}

function CollapsibleSection({ title, icon, expanded, onToggle, collapsed, children }: CollapsibleSectionProps) {
    const getIcon = (iconName: string) => {
        const icons = {
            money: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />,
            chart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
            users: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />,
            envelope: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        };
        return icons[iconName as keyof typeof icons] || icons.chart;
    };

    return (
        <div>
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
            >
                <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {getIcon(icon)}
                    </svg>
                    {!collapsed && <span className="text-sm font-medium">{title}</span>}
                </div>
                {!collapsed && (
                    <svg className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                )}
            </button>

            {expanded && !collapsed && children && (
                <div className="ml-6 mt-1 space-y-1">
                    {children}
                </div>
            )}
        </div>
    );
}
