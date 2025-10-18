/**
 * Salary Tab Component
 * 
 * Displays and manages salary and compensation data.
 * Shows job titles, salaries, benefits, and compensation projections.
 */

'use client';

import React from 'react';
import { FinancialTable } from '../components/table';
import { Summary } from '../components/summary';
import { useTabData } from '../hooks/useTabData';
import { SalaryData, TableColumn } from '../types';
import { generateSummaryData } from '../../utils';

export function SalaryTab() {
  const { data, updateData, addRow, deleteRow, isLoading, error } = useTabData<SalaryData>();

  // Table columns configuration
  const columns: TableColumn[] = [
    {
      key: 'jobTitle',
      label: 'Job Title',
      type: 'text',
      isEditable: true,
      isRequired: true
    },
    {
      key: 'description',
      label: 'Role Description',
      type: 'text',
      isEditable: true
    },
    {
      key: 'baseSalary',
      label: 'Base Salary',
      type: 'currency',
      isEditable: true
    },
    {
      key: 'benefits',
      label: 'Benefits',
      type: 'currency',
      isEditable: true
    },
    {
      key: 'bonus',
      label: 'Bonus',
      type: 'currency',
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
    marketing: [],
    salary: data,
    equipment: []
  });

  // Handle add new salary entry
  const handleAddRow = () => {
    const newSalaryEntry: Partial<SalaryData> = {
      jobTitle: 'New Position',
      description: 'Enter role description',
      baseSalary: 0,
      benefits: 0,
      bonus: 0,
      monthlyData: Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        year: 2024,
        value: 0,
        isEditable: true
      })),
      total: 0
    };
    addRow(newSalaryEntry);
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 text-lg font-medium mb-2">Error Loading Salary Data</div>
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
          <h2 className="text-2xl font-bold text-gray-900">Salary & Compensation</h2>
          <p className="text-gray-600 mt-1">
            Manage team salaries, benefits, and compensation planning
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            Export Data
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Save Changes
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <Summary data={summaryData} />

      {/* Salary Table */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Team Compensation</h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage salaries, benefits, and compensation for your team
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

      {/* Salary Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Overview</h3>
          <div className="space-y-3">
            {data.map((position, index) => (
              <div key={position.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{position.jobTitle}</p>
                  <p className="text-sm text-gray-600">{position.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${position.total?.toLocaleString() || 0}
                  </p>
                  <p className="text-sm text-gray-600">
                    ${position.baseSalary}/month
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Compensation Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Team Cost</span>
              <span className="font-semibold text-gray-900">
                ${summaryData.totalExpenses.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Salary</span>
              <span className="font-semibold text-blue-600">
                ${data.length > 0 ? (summaryData.totalExpenses / data.length / 12).toLocaleString() : 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Team Size</span>
              <span className="font-semibold text-green-600">
                {data.length} positions
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Compensation Guidelines */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-3">Compensation Guidelines</h3>
        <div className="space-y-2 text-sm text-purple-800">
          <p>• Base salaries should be 70-80% of total compensation</p>
          <p>• Benefits typically account for 20-30% of base salary</p>
          <p>• Bonuses should be performance-based and not exceed 20% of base salary</p>
          <p>• Consider equity compensation for key roles in startups</p>
        </div>
      </div>
    </div>
  );
}
