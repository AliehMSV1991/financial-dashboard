/**
 * Financial Spreadsheet Component
 * 
 * Main content area with project header, tabs, and spreadsheet table.
 * Matches the design from the reference image.
 */

'use client';

import { useState, useRef, useEffect } from 'react';

interface FinancialSpreadsheetProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    tableData: any[];
    setTableData: (data: any[]) => void;
    isInitialized: { [key: string]: boolean };
    selectedCell: { row: number, col: number } | null;
    setSelectedCell: (cell: { row: number, col: number } | null) => void;
    selectedRange: { start: { row: number, col: number }, end: { row: number, col: number } } | null;
    setSelectedRange: (range: { start: { row: number, col: number }, end: { row: number, col: number } } | null) => void;
    formulaBar: string;
    setFormulaBar: (formula: string) => void;
    isEditing: boolean;
    setIsEditing: (editing: boolean) => void;
    getCellReference: (row: number, col: number) => string;
    getCellValue: (row: number, col: number) => string;
    setCellValue: (row: number, col: number, value: string) => void;
    calculateFormula: (formula: string) => string;
}

export function FinancialSpreadsheet({
    activeTab,
    setActiveTab,
    tableData,
    setTableData,
    isInitialized,
    selectedCell,
    setSelectedCell,
    selectedRange,
    setSelectedRange,
    formulaBar,
    setFormulaBar,
    isEditing,
    setIsEditing,
    getCellReference,
    getCellValue,
    setCellValue,
    calculateFormula
}: FinancialSpreadsheetProps) {
    const [originalSelectedCell, setOriginalSelectedCell] = useState<{ row: number, col: number } | null>(null);
    const [isFormulaMode, setIsFormulaMode] = useState(false);
    const formulaBarRef = useRef<HTMLInputElement>(null);

    // Live-evaluate formulas into the original cell (Excel-like behavior)
    useEffect(() => {
        if (!isFormulaMode) return;
        if (!originalSelectedCell) return;
        if (!formulaBar.startsWith('=')) return;

        const result = calculateFormula(formulaBar);
        if (result !== 'Error' && result !== '') {
            setCellValue(originalSelectedCell.row, originalSelectedCell.col, result);
        }
    }, [formulaBar, isFormulaMode, originalSelectedCell]);

    const tabs = [
        { id: 'revenue', label: 'Revenue Assumptions', icon: 'chart', active: activeTab === 'revenue' },
        { id: 'marketing', label: 'Marketing', icon: 'megaphone', active: activeTab === 'marketing' },
        { id: 'salary', label: 'Salary', icon: 'money', active: activeTab === 'salary' },
        { id: 'current-cost', label: 'Current Cost', icon: 'document', active: activeTab === 'current-cost' },
        { id: 'equipment', label: 'Equipments and hardware', icon: 'wrench', active: activeTab === 'equipment' }
    ];

    // Dynamic table structure based on active tab
    const getTableStructure = () => {
        switch (activeTab) {
            case 'salary':
                return {
                    headers: ['Job Title', 'salary per month', 'Hiring Plan'],
                    months: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6', 'Month 7', 'Month 8', 'Month 9', 'Month 10', 'Month 11', 'Month 12', 'Month 13'],
                    fields: ['jobTitle', 'salaryPerMonth', 'hiringPlan']
                };
            case 'marketing':
                return {
                    headers: ['Marketing Channel', 'Cost per Lead', 'Monthly Budget'],
                    months: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6', 'Month 7', 'Month 8', 'Month 9', 'Month 10', 'Month 11', 'Month 12', 'Month 13'],
                    fields: ['channel', 'costPerLead', 'monthlyBudget']
                };
            case 'revenue':
                return {
                    headers: ['Revenue Streams', 'Income per model', 'Number of users'],
                    months: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6', 'Month 7', 'Month 8', 'Month 9', 'Month 10', 'Month 11', 'Month 12', 'Month 13'],
                    fields: ['revenueStream', 'incomePerModel', 'users']
                };
            default:
                return {
                    headers: ['Job Title', 'salary per month', 'Hiring Plan'],
                    months: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6', 'Month 7', 'Month 8', 'Month 9', 'Month 10', 'Month 11', 'Month 12', 'Month 13'],
                    fields: ['jobTitle', 'salaryPerMonth', 'hiringPlan']
                };
        }
    };

    const tableStructure = getTableStructure();
    const months = tableStructure.months;

    // Handle cell selection for formula building
    const handleCellClick = (row: number, col: number) => {
        setSelectedCell({ row, col });
        const cellValue = getCellValue(row, col);
        setFormulaBar(cellValue);
    };
    const [selectedCells, setSelectedCells] = useState<{ row: number, col: number }[]>([]);

    const handleCellClickForFormula = (row: number, col: number) => {
        console.log('handleCellClickForFormula:', { isFormulaMode, formulaBar, row, col });

        const cellRef = getCellReference(row, col);

        if (isFormulaMode && formulaBar.startsWith('=')) {
            if (selectedCells.length >= 3) {
                console.warn('حداکثر 3 سلول قابل انتخاب است.');
                return;
            }

            setFormulaBar(prev => prev + cellRef);
            setSelectedCells(prev => [...prev, { row, col }]);
            setSelectedCell({ row, col });

            setTimeout(() => formulaBarRef.current?.focus(), 0);
        } else {
            // حالت نرمال
            setSelectedCell({ row, col });
            setOriginalSelectedCell({ row, col });
            setSelectedCells([{ row, col }]);
            const cellValue = getCellValue(row, col);
            setFormulaBar(cellValue);
            setIsFormulaMode(false);
        }
    };
    const evaluateFormula = (formula: string) => {
        try {
            // حذف '=' از ابتدای رشته
            let expression = formula.slice(1);

            // جایگزینی رفرنس سلول‌ها با مقادیر عددی
            expression = expression.replace(/[A-Z]+\d+/g, (ref) => {
                const [row, col] = ref.match(/[A-Z]+(\d+)/)?.slice(1) || []; // مثلاً A1 → ['1', '0']
                const rowNum = parseInt(row, 10) - 1;
                const colNum = ref.charCodeAt(0) - 65;
                const value = parseFloat(getCellValue(rowNum, colNum)) || 0;
                return value.toString();
            });

            // محاسبه با eval (ایمن‌تر: از Function استفاده کن)
            const result = Function(`"use strict"; return (${expression});`)();
            return result;
        } catch (err) {
            console.error('خطا در محاسبه فرمول:', err);
            return '#ERROR';
        }
    };
    const handleFormulaSubmit = () => {
        if (formulaBar.startsWith('=')) {
            const result = evaluateFormula(formulaBar);
            const target = selectedCells[0]; // سلول اول نتیجه را نگه می‌گیرد
            setCellValue(target.row, target.col, result);
            setIsFormulaMode(false);
            setSelectedCells([]);
        }
    };



    const getIcon = (iconName: string) => {
        const icons = {
            chart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
            megaphone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />,
            money: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />,
            document: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
            wrench: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        };
        return icons[iconName as keyof typeof icons] || icons.chart;
    };

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* Project Header */}
            <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-400 mb-1">My financial projects</p>
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-white">Financial Plan 3</h1>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                            Share
                        </button>
                        <button className="text-gray-400 hover:text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-6 py-4 border-b border-gray-700">
                <div className="flex items-center space-x-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${tab.active
                                ? 'bg-white text-gray-900 border-b-2 border-white'
                                : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {getIcon(tab.icon)}
                            </svg>
                            <span className="text-sm font-medium">{tab.label}</span>
                        </button>
                    ))}
                    <button className="text-gray-400 hover:text-white p-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Spreadsheet Table */}
            <div
                className="flex-1 p-6 overflow-auto"
                onKeyDown={(e) => {
                    if (!selectedCell) return;

                    const { row, col } = selectedCell;
                    const maxRows = tableData.length;
                    const maxCols = 2 + (tableStructure.months.length);

                    switch (e.key) {
                        case 'ArrowUp':
                            e.preventDefault();
                            if (row > 0) setSelectedCell({ row: row - 1, col });
                            break;
                        case 'ArrowDown':
                            e.preventDefault();
                            if (row < maxRows - 1) setSelectedCell({ row: row + 1, col });
                            break;
                        case 'ArrowLeft':
                            e.preventDefault();
                            if (col > 0) setSelectedCell({ row, col: col - 1 });
                            break;
                        case 'ArrowRight':
                            e.preventDefault();
                            if (col < maxCols - 1) setSelectedCell({ row, col: col + 1 });
                            break;
                        case 'Enter':
                            e.preventDefault();
                            if (row < maxRows - 1) setSelectedCell({ row: row + 1, col });
                            break;
                        case 'Tab':
                            e.preventDefault();
                            if (e.shiftKey) {
                                if (col > 0) setSelectedCell({ row, col: col - 1 });
                            } else {
                                if (col < maxCols - 1) setSelectedCell({ row, col: col + 1 });
                            }
                            break;
                    }
                }}
                tabIndex={0}
            >
                {/* Formula Bar */}
                <div className="mb-4 flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-400">
                            {selectedCell ? getCellReference(selectedCell.row, selectedCell.col) : 'Cell name'}
                        </span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <input
                            ref={formulaBarRef}
                            type="text"
                            value={formulaBar}
                            onChange={(e) => setFormulaBar(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    if (originalSelectedCell) {
                                        const result = calculateFormula(formulaBar);
                                        setCellValue(originalSelectedCell.row, originalSelectedCell.col, result);
                                        setFormulaBar('');
                                        setIsEditing(false);
                                        setOriginalSelectedCell(null);
                                        setIsFormulaMode(false);
                                    }
                                }
                                if (e.key === 'Escape') {
                                    setFormulaBar('');
                                    setIsEditing(false);
                                    setOriginalSelectedCell(null);
                                    setIsFormulaMode(false);
                                }
                                if (e.key === 'F2') {
                                    e.preventDefault();
                                    setIsEditing(true);
                                }
                                // Handle operators
                                if (['+', '-', '*', '/'].includes(e.key)) {
                                    if (isEditing && formulaBar.startsWith('=')) {
                                        e.preventDefault();
                                        setFormulaBar(formulaBar + e.key);
                                    }
                                }
                                // Handle = key to start formula
                                if (e.key === '=') {
                                    if (selectedCell) {
                                        e.preventDefault();
                                        setOriginalSelectedCell(selectedCell);
                                        setIsEditing(true);
                                        setIsFormulaMode(true);
                                        setFormulaBar('=');
                                    }
                                }
                            }}
                            onFocus={() => setIsEditing(true)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter formula (e.g. =A1+B1)"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <span>{tableStructure.headers[0]}</span>
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                        </svg>
                                    </div>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <span>{tableStructure.headers[1]}</span>
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                    </div>
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" colSpan={months.length}>
                                    {tableStructure.headers[2]}
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                                    Actions
                                </th>
                            </tr>
                            <tr>
                                <th className="px-4 py-2 text-xs font-medium text-gray-500 border-r border-gray-200"></th>
                                <th className="px-4 py-2 text-xs font-medium text-gray-500 border-r border-gray-200"></th>
                                {months.map((month, index) => (
                                    <th key={index} className="px-2 py-2 text-xs font-medium text-gray-500 border-r border-gray-200">
                                        {month}
                                    </th>
                                ))}
                                <th className="px-2 py-2 text-xs font-medium text-gray-500 border-r border-gray-200"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {tableData.map((row, rowIndex) => (
                                <tr key={row.id} className={rowIndex === tableData.length - 1 ? 'bg-gray-50 font-semibold' : 'hover:bg-gray-50'}>
                                    <td
                                        className={`px-4 py-3 text-sm text-gray-900 border-r border-gray-200 ${originalSelectedCell?.row === rowIndex && originalSelectedCell?.col === 0
                                            ? 'bg-green-100 border-green-500'
                                            : selectedCell?.row === rowIndex && selectedCell?.col === 0
                                                ? 'bg-blue-100 border-blue-500'
                                                : 'hover:bg-gray-50'
                                            }`}
                                        onClick={() => handleCellClickForFormula(rowIndex, 0)}
                                        title={`${getCellReference(rowIndex, 0)}: ${row[tableStructure.fields[0]] || 'Empty'}`}
                                    >
                                        <input
                                            type="text"
                                            value={row[tableStructure.fields[0]] || ''}
                                            className="w-full bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                                            onChange={(e) => {
                                                const newData = [...tableData];
                                                newData[rowIndex] = { ...newData[rowIndex], [tableStructure.fields[0]]: e.target.value };
                                                setTableData(newData);
                                            }}
                                            onFocus={(e) => {
                                                e.target.select();
                                                setSelectedCell({ row: rowIndex, col: 0 });
                                                // Only update formula bar if not in formula mode
                                                if (!isFormulaMode) {
                                                    setFormulaBar(row[tableStructure.fields[0]] || '');
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === '=') {
                                                    e.preventDefault();
                                                    setFormulaBar('=');
                                                    setIsEditing(true);
                                                    setOriginalSelectedCell({ row: rowIndex, col: 0 });
                                                    setIsFormulaMode(true);
                                                    // Focus on formula bar
                                                    setTimeout(() => {
                                                        if (formulaBarRef.current) {
                                                            formulaBarRef.current.focus();
                                                        }
                                                    }, 0);
                                                }
                                                // Handle operators in cell input
                                                if (['+', '-', '*', '/'].includes(e.key)) {
                                                    if (isEditing && formulaBar.startsWith('=')) {
                                                        e.preventDefault();
                                                        setFormulaBar(prev => prev + e.key);
                                                    }
                                                }
                                            }}
                                            placeholder={tableStructure.fields[0] === 'jobTitle' ? 'e.g. Software Engineer' : 'Enter value'}
                                        />
                                    </td>
                                    <td
                                        className={`px-4 py-3 text-sm text-gray-900 border-r border-gray-200 ${originalSelectedCell?.row === rowIndex && originalSelectedCell?.col === 1
                                            ? 'bg-green-100 border-green-500'
                                            : selectedCell?.row === rowIndex && selectedCell?.col === 1
                                                ? 'bg-blue-100 border-blue-500'
                                                : 'hover:bg-gray-50'
                                            }`}
                                        onClick={() => handleCellClickForFormula(rowIndex, 1)}
                                        title={`${getCellReference(rowIndex, 1)}: ${row[tableStructure.fields[1]] || 'Empty'}`}
                                    >
                                        <input
                                            type="text"
                                            value={row[tableStructure.fields[1]] || ''}
                                            className="w-full bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                                            onChange={(e) => {
                                                const newData = [...tableData];
                                                newData[rowIndex] = { ...newData[rowIndex], [tableStructure.fields[1]]: e.target.value };
                                                setTableData(newData);
                                            }}
                                            onFocus={(e) => {
                                                e.target.select();
                                                setSelectedCell({ row: rowIndex, col: 1 });
                                                // Only update formula bar if not in formula mode
                                                if (!isFormulaMode) {
                                                    setFormulaBar(row[tableStructure.fields[1]] || '');
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === '=') {
                                                    e.preventDefault();
                                                    setFormulaBar('=');
                                                    setIsEditing(true);
                                                    setOriginalSelectedCell({ row: rowIndex, col: 1 });
                                                    setIsFormulaMode(true);
                                                    // Focus on formula bar
                                                    setTimeout(() => {
                                                        if (formulaBarRef.current) {
                                                            formulaBarRef.current.focus();
                                                        }
                                                    }, 0);
                                                }
                                                // Handle operators in cell input
                                                if (['+', '-', '*', '/'].includes(e.key)) {
                                                    if (isEditing && formulaBar.startsWith('=')) {
                                                        e.preventDefault();
                                                        setFormulaBar(prev => prev + e.key);
                                                    }
                                                }
                                            }}
                                            placeholder={tableStructure.fields[1] === 'salaryPerMonth' ? 'e.g. 5000' : 'Enter value'}
                                        />
                                    </td>
                                    {(row[tableStructure.fields[2]] || []).map((cell, cellIndex) => (
                                        <td
                                            key={cellIndex}
                                            className={`px-2 py-3 text-sm text-gray-900 border-r border-gray-200 ${originalSelectedCell?.row === rowIndex && originalSelectedCell?.col === cellIndex + 2
                                                ? 'bg-green-100 border-green-500'
                                                : selectedCell?.row === rowIndex && selectedCell?.col === cellIndex + 2
                                                    ? 'bg-blue-100 border-blue-500'
                                                    : 'hover:bg-gray-50'
                                                }`}
                                            onClick={() => handleCellClickForFormula(rowIndex, cellIndex + 2)}
                                            title={`${getCellReference(rowIndex, cellIndex + 2)}: ${cell || 'Empty'}`}
                                        >
                                            <input
                                                type="text"
                                                value={cell}
                                                className="w-full bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                                                onChange={(e) => {
                                                    const newData = [...tableData];
                                                    const newArray = [...(newData[rowIndex][tableStructure.fields[2]] || [])];
                                                    newArray[cellIndex] = e.target.value;
                                                    newData[rowIndex] = { ...newData[rowIndex], [tableStructure.fields[2]]: newArray };
                                                    setTableData(newData);
                                                }}
                                                onFocus={(e) => {
                                                    e.target.select();
                                                    setSelectedCell({ row: rowIndex, col: cellIndex + 2 });
                                                    // Only update formula bar if not in formula mode
                                                    if (!isFormulaMode) {
                                                        setFormulaBar(cell || '');
                                                    }
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === '=') {
                                                        e.preventDefault();
                                                        setFormulaBar('=');
                                                        setIsEditing(true);
                                                        setOriginalSelectedCell({ row: rowIndex, col: cellIndex + 2 });
                                                        setIsFormulaMode(true);
                                                        // Focus on formula bar
                                                        setTimeout(() => {
                                                            if (formulaBarRef.current) {
                                                                formulaBarRef.current.focus();
                                                            }
                                                        }, 0);
                                                    }
                                                    // Handle operators in cell input
                                                    if (['+', '-', '*', '/'].includes(e.key)) {
                                                        if (isEditing && formulaBar.startsWith('=')) {
                                                            e.preventDefault();
                                                            setFormulaBar(prev => prev + e.key);
                                                        }
                                                    }
                                                }}
                                                placeholder="0"
                                            />
                                        </td>
                                    ))}
                                    {rowIndex !== tableData.length - 1 && (
                                        <td className="px-2 py-3 text-sm text-gray-500 border-r border-gray-200">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => {
                                                        const newRow = {
                                                            id: Date.now(),
                                                            [tableStructure.fields[0]]: row[tableStructure.fields[0]] + ' (Copy)',
                                                            [tableStructure.fields[1]]: row[tableStructure.fields[1]],
                                                            [tableStructure.fields[2]]: [...(row[tableStructure.fields[2]] || [])]
                                                        };
                                                        const newData = [...tableData.slice(0, -1), newRow, tableData[tableData.length - 1]];
                                                        setTableData(newData);
                                                    }}
                                                    className="text-blue-500 hover:text-blue-700 transition-colors"
                                                    title="Copy row"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const newData = tableData.filter((_, index) => index !== rowIndex);
                                                        setTableData(newData);
                                                    }}
                                                    className="text-red-500 hover:text-red-700 transition-colors"
                                                    title="Delete row"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Add Row Button */}
                <div className="mt-4">
                    <button
                        onClick={() => {
                            const newRow = {
                                id: Date.now(),
                                [tableStructure.fields[0]]: '',
                                [tableStructure.fields[1]]: '',
                                [tableStructure.fields[2]]: Array(months.length).fill('')
                            };
                            setTableData([...tableData.slice(0, -1), newRow, tableData[tableData.length - 1]]);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Add Row</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
