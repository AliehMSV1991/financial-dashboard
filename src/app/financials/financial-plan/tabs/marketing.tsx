/**
 * Marketing Tab Component
 * 
 * Displays and manages marketing budget data.
 * Shows marketing channels, budgets, and campaign costs.
 */

'use client';

import React from 'react';
import { FinancialTable } from '../components/table';
import { Summary } from '../components/summary';
import { useTabData } from '../hooks/useTabData';
import { MarketingData, TableColumn } from '../types';
import { generateSummaryData } from '../../utils';

export function MarketingTab() {
  const { data, updateData, addRow, deleteRow, isLoading, error } = useTabData<MarketingData>();

  // Table columns configuration
  const columns: TableColumn[] = [
    {
      key: 'category',
      label: 'Marketing Channel',
      type: 'text',
      isEditable: true,
      isRequired: true
    },
    {
      key: 'description',
      label: 'Campaign Description',
      type: 'text',
      isEditable: true
    },
    {
      key: 'budget',
      label: 'Monthly Budget',
      type: 'currency',
      isEditable: true
    },
    {
      key: 'targetAudience',
      label: 'Target Audience',
      type: 'text',
      isEditable: true
    },
    {
      key: 'month1',
      label: 'Month 1',
      type: 'currency',
      isEditable: true
    },
    {
      key: 'month2',
      label: 'Month 2',
      type: 'currency',
      isEditable: true
    },
    {
      key: 'month3',
      label: 'Month 3',
      type: 'currency',
      isEditable: true
    },
    {
      key: 'month4',
      label: 'Month 4',
      type: 'currency',
      isEditable: true
    },
    {
      key: 'month5',
      label: 'Month 5',
      type: 'currency',
      isEditable: true
    },
    {
      key: 'month6',
      label: 'Month 6',
      type: 'currency',
      isEditable: true
    }
  ];

  // Generate summary data
  const summaryData = generateSummaryData({
    revenue: [],
    marketing: data,
    salary: [],
    equipment: []
  });

  // Handle add new marketing channel
  const handleAddRow = () => {
    const newMarketingChannel: Partial<MarketingData> = {
      category: 'New Marketing Channel',
      description: 'Enter campaign description',
      budget: 0,
      targetAudience: 'Target audience',
      channels: ['Digital Marketing'],
      monthlyData: Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        year: 2024,
        value: 0,
        isEditable: true
      })),
      total: 0
    };
    addRow(newMarketingChannel);
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 text-lg font-medium mb-2">Error Loading Marketing Data</div>
        <div className="text-red-500 text-sm mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Marketing Budget</h2>
          <p className="text-gray-600 mt-1">
            Plan and track your marketing spend across different channels
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            Export Data
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Save Changes
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <Summary data={summaryData} />

      {/* Marketing Table */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Marketing Channels</h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage your marketing channels and budget allocations
          </p>
        </div>
        
        <div className="p-6">
          <FinancialTable
            data={data}
            columns={columns}
            onDataChange={updateData}
            onRowAdd={handleAddRow}
            onRowDelete={deleteRow}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Marketing Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Channel Performance</h3>
          <div className="space-y-3">
            {data.map((channel, index) => (
              <div key={channel.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{channel.category}</p>
                  <p className="text-sm text-gray-600">{channel.targetAudience}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${channel.total?.toLocaleString() || 0}
                  </p>
                  <p className="text-sm text-gray-600">
                    ${channel.budget}/month
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Allocation</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Marketing Budget</span>
              <span className="font-semibold text-gray-900">
                ${summaryData.totalExpenses.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Monthly Spend</span>
              <span className="font-semibold text-blue-600">
                ${(summaryData.totalExpenses / 12).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Channels Active</span>
              <span className="font-semibold text-green-600">
                {data.length} channels
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Marketing Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Marketing Tips</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>• Allocate 10-15% of your revenue to marketing for sustainable growth</p>
          <p>• Diversify across multiple channels to reduce risk</p>
          <p>• Track ROI for each channel to optimize your budget</p>
          <p>• Consider seasonal trends when planning your campaigns</p>
        </div>
      </div>
    </div>
  );
}
