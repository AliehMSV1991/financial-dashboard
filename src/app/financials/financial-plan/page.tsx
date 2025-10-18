/**
 * Financial Plan Page
 * 
 * Main page for the financial plan module with tabbed interface.
 * Integrates all financial plan components and provides navigation.
 */

'use client';

import React, { useState, useMemo } from 'react';
import { useFinancialPlan } from './hooks/useFinancialPlan';
import { RevenueTab } from './tabs/revenue';
import { MarketingTab } from './tabs/marketing';
import { SalaryTab } from './tabs/salary';
import { EquipmentTab } from './tabs/equipment';
import { TabConfig } from './types';

export default function FinancialPlanPage() {
  const { state, actions } = useFinancialPlan();
  const [activeTab, setActiveTab] = useState('revenue');

  // Tab configuration
  const tabs: TabConfig[] = useMemo(() => [
    {
      id: 'revenue',
      name: 'Revenue Assumptions',
      icon: '📈',
      color: 'blue',
      component: RevenueTab
    },
    {
      id: 'marketing',
      name: 'Marketing Budget',
      icon: '📢',
      color: 'green',
      component: MarketingTab
    },
    {
      id: 'salary',
      name: 'Salary & Compensation',
      icon: '👥',
      color: 'purple',
      component: SalaryTab
    },
    {
      id: 'equipment',
      name: 'Equipment & Hardware',
      icon: '💻',
      color: 'orange',
      component: EquipmentTab
    }
  ], []);

  // Get current tab configuration
  const currentTab = tabs.find(tab => tab.id === activeTab);

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    actions.setActiveTab(tabId);
  };

  // Get tab color classes
  const getTabColorClasses = (color: string, isActive: boolean) => {
    const colorMap = {
      blue: isActive ? 'bg-blue-100 text-blue-700 border-blue-200' : 'text-blue-600 hover:bg-blue-50',
      green: isActive ? 'bg-green-100 text-green-700 border-green-200' : 'text-green-600 hover:bg-green-50',
      purple: isActive ? 'bg-purple-100 text-purple-700 border-purple-200' : 'text-purple-600 hover:bg-purple-50',
      orange: isActive ? 'bg-orange-100 text-orange-700 border-orange-200' : 'text-orange-600 hover:bg-orange-50'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  // Render current tab component
  const renderTabContent = () => {
    if (!currentTab) return null;

    const TabComponent = currentTab.component;
    return <TabComponent />;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financial Plan</h1>
            <p className="text-gray-600 mt-2">
              Create and manage your comprehensive financial plan with detailed projections and analysis.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Export
            </button>
            <button 
              onClick={actions.saveData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save Plan
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? `border-${tab.color}-500 ${getTabColorClasses(tab.color, true)}`
                    : `border-transparent ${getTabColorClasses(tab.color, false)}`
                }`}
              >
                <span className={activeTab === tab.id ? `text-${tab.color}-500` : `text-${tab.color}-400`}>
                  {tab.icon}
                </span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {state.isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : state.error ? (
            <div className="text-center py-12">
              <div className="text-red-600 text-lg font-medium mb-2">Error Loading Data</div>
              <div className="text-red-500 text-sm mb-4">{state.error}</div>
              <button
                onClick={() => actions.refreshData()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            renderTabContent()
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">Generate Report</div>
              <div className="text-sm text-gray-500">Create comprehensive financial report</div>
            </div>
          </button>

          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">Add Scenario</div>
              <div className="text-sm text-gray-500">Create new financial scenario</div>
            </div>
          </button>

          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">Validate Plan</div>
              <div className="text-sm text-gray-500">Check plan for inconsistencies</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
