/**
 * Cell Editor Component
 * 
 * Inline cell editor for table cells with different input types.
 * Supports text, number, currency, and percentage inputs.
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CellEditorProps } from '../types';
import { cn } from '@/lib/utils';

export function CellEditor({
  value,
  onChange,
  isEditable = true,
  type = 'text'
}: CellEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Update edit value when prop value changes
  useEffect(() => {
    setEditValue(value);
  }, [value]);

  // Handle double click to edit
  const handleDoubleClick = () => {
    if (isEditable) {
      setIsEditing(true);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setEditValue(newValue);
  };

  // Handle save
  const handleSave = () => {
    let processedValue: any = editValue;

    // Process value based on type
    switch (type) {
      case 'number':
      case 'currency':
        processedValue = parseFloat(editValue) || 0;
        break;
      case 'percentage':
        processedValue = parseFloat(editValue) / 100 || 0;
        break;
      default:
        processedValue = editValue;
    }

    onChange(processedValue);
    setIsEditing(false);
  };

  // Handle cancel
  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  // Handle key events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // Handle blur
  const handleBlur = () => {
    handleSave();
  };

  // Format display value
  const formatDisplayValue = (val: any) => {
    if (val === null || val === undefined) return '';

    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(parseFloat(val) || 0);
      case 'percentage':
        return `${(parseFloat(val) * 100).toFixed(2)}%`;
      case 'number':
        return parseFloat(val).toLocaleString();
      default:
        return val.toString();
    }
  };

  // Get input type
  const getInputType = () => {
    switch (type) {
      case 'number':
      case 'currency':
        return 'number';
      case 'percentage':
        return 'number';
      default:
        return 'text';
    }
  };

  // Get input step
  const getInputStep = () => {
    switch (type) {
      case 'currency':
        return '0.01';
      case 'percentage':
        return '0.01';
      default:
        return '1';
    }
  };

  if (!isEditable) {
    return (
      <span className="text-gray-900 font-medium">
        {formatDisplayValue(value)}
      </span>
    );
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type={getInputType()}
        step={getInputStep()}
        value={editValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={cn(
          "w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500",
          "text-sm"
        )}
      />
    );
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className={cn(
        "cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors",
        "min-h-[32px] flex items-center"
      )}
    >
      <span className="text-gray-900">
        {formatDisplayValue(value)}
      </span>
    </div>
  );
}
