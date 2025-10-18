/**
 * Revenue Tab Component
 * 
 * Displays and manages revenue assumptions data.
 * Shows revenue streams, income per model, and user projections.
 */

'use client';

import React from 'react';
import { FinancialTable } from '../components/table';
import { Summary } from '../components/summary';
import { useTabData } from '../hooks/useTabData';
import { RevenueData, TableColumn } from '../types';
import { generateSummaryData } from '../../utils';

export function RevenueTab() {
  const { data, updateData, addRow, deleteRow, isLoading, error } = useTabData<RevenueData>();

  // Table columns configuration
  const columns: TableColumn[] = [
    {
      key: 'category',
      label: 'Revenue Streams',
      type: 'text',
      isEditable: true,
      isRequired: true
    },
    {
      key: 'description',
      label: 'Description',
      type: 'text',
      isEditable: true
    },
    {
      key: 'incomePerModel',
      label: 'Income per Model',
      type: 'currency',
      isEditable: true
    },
    {
      key: 'userCount',
      label: 'Number of Users',
      type: 'number',
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
    revenue: data,
    marketing: [],
    salary: [],
    equipment: []
  });

  // Handle add new revenue stream
  const handleAddRow = () => {
    const newRevenueStream: Partial<RevenueData> = {
      category: 'New Revenue Stream',
      description: 'Enter description',
      incomePerModel: 0,
      userCount: 0,
      revenueStreams: ['Online Sales'],
      monthlyData: Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        year: 2024,
        value: 0,
        isEditable: true
      })),
      total: 0
    };
    addRow(newRevenueStream);
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 text-lg font-medium mb-2">Error Loading Revenue Data</div>
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
          <h2 className="text-2xl font-bold text-gray-900">Revenue Assumptions</h2>
          <p className="text-gray-600 mt-1">
            Define your revenue streams and income projections
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            Export Data
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <Summary data={summaryData} />

      {/* Revenue Table */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Revenue Streams</h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage your revenue streams and monthly projections
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

      {/* Revenue Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
          <div className="space-y-3">
            {data.map((stream, index) => (
              <div key={stream.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{stream.category}</p>
                  <p className="text-sm text-gray-600">{stream.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${stream.total?.toLocaleString() || 0}
                  </p>
                  <p className="text-sm text-gray-600">
                    {stream.userCount} users
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Projections</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Current Revenue</span>
              <span className="font-semibold text-gray-900">
                ${summaryData.totalRevenue.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Growth Rate</span>
              <span className="font-semibold text-green-600">
                {(summaryData.growthRate * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Projected Annual</span>
              <span className="font-semibold text-blue-600">
                ${(summaryData.totalRevenue * 12).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
