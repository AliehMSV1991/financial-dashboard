/**
 * Equipment Tab Component
 * 
 * Displays and manages equipment and hardware costs.
 * Shows equipment types, quantities, costs, and maintenance expenses.
 */

'use client';

import React from 'react';
import { FinancialTable } from '../components/table';
import { Summary } from '../components/summary';
import { useTabData } from '../hooks/useTabData';
import { EquipmentData, TableColumn } from '../types';
import { generateSummaryData } from '../../utils';

export function EquipmentTab() {
  const { data, updateData, addRow, deleteRow, isLoading, error } = useTabData<EquipmentData>();

  // Table columns configuration
  const columns: TableColumn[] = [
    {
      key: 'equipmentType',
      label: 'Equipment Type',
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
      key: 'quantity',
      label: 'Quantity',
      type: 'number',
      isEditable: true
    },
    {
      key: 'unitCost',
      label: 'Unit Cost',
      type: 'currency',
      isEditable: true
    },
    {
      key: 'maintenanceCost',
      label: 'Monthly Maintenance',
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
    salary: [],
    equipment: data
  });

  // Handle add new equipment
  const handleAddRow = () => {
    const newEquipment: Partial<EquipmentData> = {
      equipmentType: 'New Equipment',
      description: 'Enter equipment description',
      quantity: 1,
      unitCost: 0,
      maintenanceCost: 0,
      monthlyData: Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        year: 2024,
        value: 0,
        isEditable: true
      })),
      total: 0
    };
    addRow(newEquipment);
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 text-lg font-medium mb-2">Error Loading Equipment Data</div>
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
          <h2 className="text-2xl font-bold text-gray-900">Equipment & Hardware</h2>
          <p className="text-gray-600 mt-1">
            Track equipment purchases, maintenance costs, and hardware expenses
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            Export Data
          </button>
          <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
            Save Changes
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <Summary data={summaryData} />

      {/* Equipment Table */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Equipment Inventory</h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage your equipment and hardware costs
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

      {/* Equipment Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment Overview</h3>
          <div className="space-y-3">
            {data.map((equipment, index) => (
              <div key={equipment.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{equipment.equipmentType}</p>
                  <p className="text-sm text-gray-600">Qty: {equipment.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${equipment.total?.toLocaleString() || 0}
                  </p>
                  <p className="text-sm text-gray-600">
                    ${equipment.unitCost}/unit
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Analysis</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Equipment Cost</span>
              <span className="font-semibold text-gray-900">
                ${summaryData.totalExpenses.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Unit Cost</span>
              <span className="font-semibold text-blue-600">
                ${data.length > 0 ? (summaryData.totalExpenses / data.reduce((sum, item) => sum + item.quantity, 0)).toLocaleString() : 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Equipment Types</span>
              <span className="font-semibold text-green-600">
                {data.length} types
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Computing Equipment</h4>
          <p className="text-sm text-blue-800">
            Laptops, desktops, servers, and networking equipment
          </p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-2">Office Equipment</h4>
          <p className="text-sm text-green-800">
            Furniture, printers, phones, and office supplies
          </p>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-semibold text-purple-900 mb-2">Specialized Equipment</h4>
          <p className="text-sm text-purple-800">
            Industry-specific tools and specialized hardware
          </p>
        </div>
      </div>

      {/* Equipment Tips */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-orange-900 mb-3">Equipment Planning Tips</h3>
        <div className="space-y-2 text-sm text-orange-800">
          <p>• Plan for equipment depreciation and replacement cycles</p>
          <p>• Consider leasing vs. buying based on your cash flow</p>
          <p>• Factor in maintenance and support costs</p>
          <p>• Plan for scalability as your team grows</p>
        </div>
      </div>
    </div>
  );
}
