/**
 * Tab Data Hook
 * 
 * Generic hook for managing data within individual tabs.
 * Provides common data operations for each financial plan tab.
 */

'use client';

import { useState, useCallback } from 'react';
import { UseTabDataReturn } from '../types';

export function useTabData<T extends { id: string }>(
  initialData: T[] = []
): UseTabDataReturn<T> {
  const [data, setData] = useState<T[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update entire dataset
  const updateData = useCallback((newData: T[]) => {
    setData(newData);
  }, []);

  // Add new row
  const addRow = useCallback((newRow: Partial<T>) => {
    const newItem = {
      id: Date.now().toString(),
      ...newRow,
      createdAt: new Date(),
      updatedAt: new Date()
    } as unknown as T;

    setData(prev => [...prev, newItem]);
  }, []);

  // Delete row by ID
  const deleteRow = useCallback((id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
  }, []);

  // Refresh data (simulate API call)
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // In a real implementation, this would fetch from API
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
      setIsLoading(false);
    }
  }, []);

  return {
    data,
    isLoading,
    error,
    updateData,
    addRow,
    deleteRow,
    refreshData
  };
}
