/**
 * Financial Table Component
 * 
 * Reusable table component for displaying financial data.
 * Uses shadcn/ui components and supports editing, sorting, and filtering.
 */

'use client';

import React, { useState, useMemo } from 'react';
import { TableColumn, FinancialData } from '../types';
import { CellEditor } from './cell-editor';
import { cn } from '@/lib/utils';

interface FinancialTableProps<T extends { id: string; monthlyData: any[] } = FinancialData> {
  data: T[];
  columns: TableColumn[];
  onDataChange: (data: T[]) => void;
  onRowAdd?: () => void;
  onRowDelete?: (id: string) => void;
  isLoading?: boolean;
  className?: string;
}

export function FinancialTable<T extends { id: string; monthlyData: any[] } = FinancialData>({
  data,
  columns,
  onDataChange,
  onRowAdd,
  onRowDelete,
  isLoading = false,
  className
}: FinancialTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aVal = (a as any)[sortConfig.key];
      const bVal = (b as any)[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  // Filter data
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return sortedData;

    return sortedData.filter(item =>
      columns.some(col => {
        const value = (item as any)[col.key];
        return typeof value === 'string' &&
          value.toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [sortedData, searchTerm, columns]);

  // Handle sort
  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle cell value change
  const handleCellChange = (rowId: string, columnKey: string, value: any) => {
    const updatedData = data.map(row =>
      row.id === rowId ? { ...row, [columnKey]: value, updatedAt: new Date() } : row
    );
    onDataChange(updatedData);
  };

  // Handle monthly data change
  const handleMonthlyDataChange = (rowId: string, month: number, value: number) => {
    const updatedData = data.map(row => {
      if (row.id === rowId) {
        const updatedMonthlyData = row.monthlyData.map(m =>
          m.month === month ? { ...m, value } : m
        );
        return {
          ...row,
          monthlyData: updatedMonthlyData,
          total: updatedMonthlyData.reduce((sum, m) => sum + m.value, 0),
          updatedAt: new Date()
        };
      }
      return row;
    });
    onDataChange(updatedData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-500">
            {filteredData.length} of {data.length} items
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {onRowAdd && (
            <button
              onClick={onRowAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Row
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                    column.width && `w-${column.width}`
                  )}
                >
                  <button
                    onClick={() => handleSort(column.key)}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>{column.label}</span>
                    {sortConfig?.key === column.key && (
                      <span className="text-blue-600">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                </th>
              ))}
              {onRowDelete && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                    {column.key.startsWith('month') ? (
                      <CellEditor
                        value={row.monthlyData.find(m => m.month === parseInt(column.key.replace('month', '')))?.value || 0}
                        onChange={(value) => handleMonthlyDataChange(row.id, parseInt(column.key.replace('month', '')), value)}
                        isEditable={column.isEditable !== false}
                        type={column.type === 'currency' ? 'currency' : 'number'}
                      />
                    ) : (
                      <CellEditor
                        value={(row as any)[column.key]}
                        onChange={(value) => handleCellChange(row.id, column.key, value)}
                        isEditable={column.isEditable !== false}
                        type={column.type === 'date' ? 'text' : column.type}
                      />
                    )}
                  </td>
                ))}
                {onRowDelete && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onRowDelete(row.id)}
                      className="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No data found
        </div>
      )}
    </div>
  );
}
