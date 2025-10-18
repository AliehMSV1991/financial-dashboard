/**
 * Financial Plan Hook
 * 
 * Main hook for managing financial plan state and actions.
 * Provides centralized state management for the entire financial plan module.
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { 
  FinancialPlanState, 
  FinancialPlanActions, 
  UseFinancialPlanReturn,
  RevenueData,
  MarketingData,
  SalaryData,
  EquipmentData
} from '../types';

// Initial state
const initialState: FinancialPlanState = {
  activeTab: 'revenue',
  isLoading: false,
  error: null,
  data: {
    revenue: [],
    marketing: [],
    salary: [],
    equipment: []
  }
};

export function useFinancialPlan(): UseFinancialPlanReturn {
  const [state, setState] = useState<FinancialPlanState>(initialState);

  // Set active tab
  const setActiveTab = useCallback((tabId: string) => {
    setState(prev => ({
      ...prev,
      activeTab: tabId
    }));
  }, []);

  // Update data for a specific tab
  const updateData = useCallback((tabId: string, data: any[]) => {
    setState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [tabId]: data
      }
    }));
  }, []);

  // Add new row to a tab
  const addRow = useCallback((tabId: string, newData: Partial<any>) => {
    setState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [tabId]: [
          ...prev.data[tabId as keyof typeof prev.data],
          {
            id: Date.now().toString(),
            ...newData,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      }
    }));
  }, []);

  // Delete row from a tab
  const deleteRow = useCallback((tabId: string, id: string) => {
    setState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [tabId]: prev.data[tabId as keyof typeof prev.data].filter(
          (item: any) => item.id !== id
        )
      }
    }));
  }, []);

  // Refresh data from API
  const refreshData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration
      const mockData = {
        revenue: [
          {
            id: '1',
            category: 'Product Sales',
            description: 'Revenue from product sales',
            monthlyData: Array.from({ length: 12 }, (_, i) => ({
              month: i + 1,
              year: 2024,
              value: 10000 + (i * 1000),
              isEditable: true
            })),
            total: 150000,
            revenueStreams: ['Online Sales', 'Retail Sales'],
            incomePerModel: 100,
            userCount: 1500,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        marketing: [
          {
            id: '1',
            category: 'Digital Marketing',
            description: 'Online advertising and campaigns',
            monthlyData: Array.from({ length: 12 }, (_, i) => ({
              month: i + 1,
              year: 2024,
              value: 5000 + (i * 500),
              isEditable: true
            })),
            total: 75000,
            channels: ['Google Ads', 'Facebook Ads', 'SEO'],
            budget: 10000,
            targetAudience: 'Tech-savvy professionals',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        salary: [
          {
            id: '1',
            category: 'Development Team',
            description: 'Software development team salaries',
            monthlyData: Array.from({ length: 12 }, (_, i) => ({
              month: i + 1,
              year: 2024,
              value: 25000 + (i * 1000),
              isEditable: true
            })),
            total: 300000,
            jobTitle: 'Senior Developer',
            baseSalary: 8000,
            benefits: 2000,
            bonus: 1000,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        equipment: [
          {
            id: '1',
            category: 'Computing Equipment',
            description: 'Laptops and workstations',
            monthlyData: Array.from({ length: 12 }, (_, i) => ({
              month: i + 1,
              year: 2024,
              value: i === 0 ? 50000 : 0, // One-time purchase
              isEditable: true
            })),
            total: 50000,
            equipmentType: 'Laptops',
            quantity: 10,
            unitCost: 5000,
            maintenanceCost: 500,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      };

      setState(prev => ({
        ...prev,
        data: mockData,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load data',
        isLoading: false
      }));
    }
  }, []);

  // Save data to API
  const saveData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setState(prev => ({
        ...prev,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to save data',
        isLoading: false
      }));
    }
  }, []);

  // Load initial data
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const actions: FinancialPlanActions = {
    setActiveTab,
    updateData,
    addRow,
    deleteRow,
    refreshData,
    saveData
  };

  return {
    state,
    actions
  };
}
