/**
 * Summary Component
 * 
 * Displays financial summary with key metrics and projections.
 * Shows revenue, expenses, net income, and growth calculations.
 */

'use client';

import React from 'react';
import { SummaryData } from '../types';
import { formatCurrency, formatPercentage } from '../../utils';
import { cn } from '@/lib/utils';

interface SummaryProps {
  data: SummaryData;
  className?: string;
}

export function Summary({ data, className }: SummaryProps) {
  const {
    totalRevenue,
    totalExpenses,
    netIncome,
    growthRate,
    projections
  } = data;

  // Calculate profit margin
  const profitMargin = totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0;

  // Get latest projection
  const latestProjection = projections[projections.length - 1];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-900">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
          </div>
        </div>

        <div className={cn(
          "border rounded-lg p-4",
          netIncome >= 0 
            ? "bg-blue-50 border-blue-200" 
            : "bg-orange-50 border-orange-200"
        )}>
          <div className="flex items-center justify-between">
            <div>
              <p className={cn(
                "text-sm font-medium",
                netIncome >= 0 ? "text-blue-600" : "text-orange-600"
              )}>
                Net Income
              </p>
              <p className={cn(
                "text-2xl font-bold",
                netIncome >= 0 ? "text-blue-900" : "text-orange-900"
              )}>
                {formatCurrency(netIncome)}
              </p>
            </div>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              netIncome >= 0 ? "bg-blue-100" : "bg-orange-100"
            )}>
              <svg className={cn(
                "w-4 h-4",
                netIncome >= 0 ? "text-blue-600" : "text-orange-600"
              )} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Growth Rate</p>
              <p className="text-2xl font-bold text-purple-900">
                {formatPercentage(growthRate)}
              </p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Profit Margin</h3>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  profitMargin >= 0 ? "bg-green-500" : "bg-red-500"
                )}
                style={{ width: `${Math.min(Math.abs(profitMargin), 100)}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-600">
              {formatPercentage(profitMargin / 100)}
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Latest Month</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Revenue:</span>
              <span className="text-sm font-medium text-green-600">
                {formatCurrency(latestProjection?.revenue || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Expenses:</span>
              <span className="text-sm font-medium text-red-600">
                {formatCurrency(latestProjection?.expenses || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Net Income:</span>
              <span className={cn(
                "text-sm font-medium",
                (latestProjection?.netIncome || 0) >= 0 ? "text-blue-600" : "text-orange-600"
              )}>
                {formatCurrency(latestProjection?.netIncome || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Projections Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Projections</h3>
        <div className="space-y-3">
          {projections.slice(0, 6).map((projection, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-16 text-sm text-gray-600">
                Month {projection.month}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className="flex h-2">
                  <div 
                    className="bg-green-500 rounded-l-full"
                    style={{ 
                      width: `${totalRevenue > 0 ? (projection.revenue / totalRevenue) * 100 : 0}%` 
                    }}
                  />
                  <div 
                    className="bg-red-500"
                    style={{ 
                      width: `${totalRevenue > 0 ? (projection.expenses / totalRevenue) * 100 : 0}%` 
                    }}
                  />
                </div>
              </div>
              <div className="w-20 text-sm text-gray-600 text-right">
                {formatCurrency(projection.netIncome)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
