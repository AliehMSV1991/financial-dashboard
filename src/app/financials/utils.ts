/**
 * Financials Module Utilities
 * 
 * Generic utility functions for the financials module.
 * Provides common functionality used across components and hooks.
 */

import { FinancialData, MonthlyData, SummaryData } from './financial-plan/types';

// Format currency values
export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(value);
}

// Format percentage values
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

// Format large numbers with K, M, B suffixes
export function formatLargeNumber(value: number): string {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(1)}B`;
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(1)}M`;
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(1)}K`;
  }
  return value.toString();
}

// Calculate total from monthly data
export function calculateTotal(monthlyData: MonthlyData[]): number {
  return monthlyData.reduce((sum, month) => sum + month.value, 0);
}

// Calculate growth rate between two values
export function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return 0;
  return (current - previous) / previous;
}

// Calculate compound annual growth rate (CAGR)
export function calculateCAGR(startValue: number, endValue: number, periods: number): number {
  if (startValue === 0 || periods === 0) return 0;
  return Math.pow(endValue / startValue, 1 / periods) - 1;
}

// Generate summary data from financial data
export function generateSummaryData(data: {
  revenue: FinancialData[];
  marketing: FinancialData[];
  salary: FinancialData[];
  equipment: FinancialData[];
}): SummaryData {
  const totalRevenue = data.revenue.reduce((sum, item) => sum + calculateTotal(item.monthlyData), 0);
  const totalExpenses = [
    ...data.marketing,
    ...data.salary,
    ...data.equipment
  ].reduce((sum, item) => sum + calculateTotal(item.monthlyData), 0);
  
  const netIncome = totalRevenue - totalExpenses;
  const growthRate = totalRevenue > 0 ? calculateGrowthRate(totalRevenue, totalRevenue * 0.9) : 0;

  // Generate monthly projections
  const projections = Array.from({ length: 12 }, (_, i) => {
    const monthRevenue = data.revenue.reduce((sum, item) => {
      const monthData = item.monthlyData.find(m => m.month === i + 1);
      return sum + (monthData?.value || 0);
    }, 0);
    
    const monthExpenses = [
      ...data.marketing,
      ...data.salary,
      ...data.equipment
    ].reduce((sum, item) => {
      const monthData = item.monthlyData.find(m => m.month === i + 1);
      return sum + (monthData?.value || 0);
    }, 0);

    return {
      month: i + 1,
      revenue: monthRevenue,
      expenses: monthExpenses,
      netIncome: monthRevenue - monthExpenses
    };
  });

  return {
    totalRevenue,
    totalExpenses,
    netIncome,
    growthRate,
    projections
  };
}

// Validate financial data
export function validateFinancialData(data: Partial<FinancialData>): string[] {
  const errors: string[] = [];

  if (!data.category || data.category.trim() === '') {
    errors.push('Category is required');
  }

  if (!data.description || data.description.trim() === '') {
    errors.push('Description is required');
  }

  if (data.monthlyData && data.monthlyData.some(month => month.value < 0)) {
    errors.push('Monthly values cannot be negative');
  }

  return errors;
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Deep clone object
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Debounce function for search/input
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function for scroll/resize events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Format date for display
export function formatDate(date: Date, format: 'short' | 'long' | 'iso' = 'short'): string {
  switch (format) {
    case 'short':
      return date.toLocaleDateString();
    case 'long':
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    case 'iso':
      return date.toISOString();
    default:
      return date.toString();
  }
}

// Calculate percentage of total
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

// Sort array by property
export function sortBy<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

// Filter array by search term
export function filterBySearch<T>(
  array: T[], 
  searchTerm: string, 
  searchKeys: (keyof T)[]
): T[] {
  if (!searchTerm.trim()) return array;
  
  const term = searchTerm.toLowerCase();
  return array.filter(item =>
    searchKeys.some(key => {
      const value = item[key];
      return typeof value === 'string' && value.toLowerCase().includes(term);
    })
  );
}
